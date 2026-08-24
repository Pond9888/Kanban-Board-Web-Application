importScripts('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');

let extractor = null;
const { pipeline, env } = self.tjs || self.transformers || self;
// Disable local models since we are in the browser
if (env) {
    env.allowLocalModels = false;
}

self.onmessage = async (event) => {
  const { text, type, id } = event.data;
  const transformers = self.tjs || self.transformers || self;
  
  if (type === 'init') {
    self.postMessage({ status: 'loading' });
    try {
      extractor = await transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: x => {
          self.postMessage({ status: 'progress', data: x });
        }
      });
      self.postMessage({ status: 'ready' });
    } catch (e) {
      self.postMessage({ status: 'error', error: e.message });
    }
    return;
  }

  if (type === 'embed') {
    if (!extractor) {
      self.postMessage({ status: 'error', error: 'Model not loaded' });
      return;
    }
    
    try {
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);
      self.postMessage({ status: 'complete', embedding, text, id });
    } catch (e) {
      self.postMessage({ status: 'error', error: e.message, id });
    }
  }
};

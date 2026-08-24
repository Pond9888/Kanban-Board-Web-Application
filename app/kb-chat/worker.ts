import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false; // Just to be safe

let extractor: any = null;

self.addEventListener('message', async (event: MessageEvent) => {
  const { text, type, id } = event.data;
  
  if (type === 'init') {
    self.postMessage({ status: 'loading' });
    try {
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: (x: any) => {
          self.postMessage({ status: 'progress', data: x });
        }
      });
      self.postMessage({ status: 'ready' });
    } catch (e: any) {
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
    } catch (e: any) {
      self.postMessage({ status: 'error', error: e.message, id });
    }
  }
});

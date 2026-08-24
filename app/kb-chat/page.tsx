'use client'

import { useState, useEffect, useRef } from 'react'

function chunkText(text: string, maxChunkSize: number = 800): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\s*\n/);
  
  let currentChunk = '';
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (paragraph.length > maxChunkSize) {
        chunks.push(paragraph.trim());
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

export default function KnowledgeBotPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url))
    workerRef.current.onmessage = (e) => {
      if (e.data.status === 'ready') {
        setModelReady(true)
      } else if (e.data.status === 'error') {
        console.error('Worker Error:', e.data.error)
      }
    }
    workerRef.current.postMessage({ type: 'init' })

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('1/3 Extracting text from PDF...')

    try {
      // 1. Extract text via API
      const formData = new FormData()
      formData.append('file', file)
      
      const extractRes = await fetch('/api/knowledge/extract-text', {
        method: 'POST',
        body: formData,
      })
      
      const extractData = await extractRes.json()
      if (!extractRes.ok) throw new Error(`Extraction failed: ${extractData.error}`)
      
      const text = extractData.text
      const chunks = chunkText(text)
      const fileId = `pdf-${Date.now()}`
      const fileName = file.name

      setUploadStatus(`2/3 Generating AI memory for ${chunks.length} parts... (This happens in your browser and might take a minute)`)

      // 2. Generate Embeddings using Web Worker
      const records: any[] = []
      let processed = 0

      // We wrap the worker message in a Promise to process sequentially or in parallel
      const getEmbedding = (chunk: string, index: number): Promise<number[]> => {
        return new Promise((resolve, reject) => {
          if (!workerRef.current) return reject('Worker not initialized')
          
          const messageHandler = (e: MessageEvent) => {
            if (e.data.id === index) {
              workerRef.current?.removeEventListener('message', messageHandler)
              if (e.data.status === 'complete') {
                resolve(e.data.embedding)
              } else if (e.data.status === 'error') {
                reject(e.data.error)
              }
            }
          }
          
          workerRef.current.addEventListener('message', messageHandler)
          workerRef.current.postMessage({ type: 'embed', text: chunk, id: index })
        })
      }

      for (let i = 0; i < chunks.length; i++) {
        setUploadStatus(`2/3 Thinking... Part ${i + 1} of ${chunks.length}`)
        const embedding = await getEmbedding(chunks[i], i)
        records.push({
          source_type: 'pdf',
          source_id: fileId,
          title: fileName,
          content: chunks[i],
          embedding: embedding
        })
      }

      setUploadStatus(`3/3 Saving ${chunks.length} parts to Supabase...`)

      // 3. Save to Supabase
      const saveRes = await fetch('/api/knowledge/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      })
      
      const saveData = await saveRes.json()
      if (!saveRes.ok) throw new Error(`Save failed: ${saveData.error}`)

      setUploadStatus(`✅ Successfully saved ${fileName} to the AI brain!`)
    } catch (err: any) {
      setUploadStatus('❌ Error: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-black">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base Upload</h1>
            <p className="text-sm text-white/50">Upload company documents or PDFs for the AI to learn from.</p>
          </div>
        </div>

        <div className={`border-2 border-dashed border-white/20 rounded-xl p-10 flex flex-col items-center justify-center transition-all ${modelReady && !isUploading ? 'hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
          <svg className="w-10 h-10 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="text-sm font-medium mb-1">
            {!modelReady ? 'Loading AI Engine in your browser...' : 'Click to upload PDF'}
          </p>
          <p className="text-xs text-white/40 mb-4">Maximum file size: 10MB</p>
          
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileUpload} 
            disabled={isUploading || !modelReady}
            className="hidden" 
            id="pdf-upload"
          />
          {modelReady && (
            <label 
              htmlFor="pdf-upload" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isUploading ? 'bg-indigo-600/50 text-indigo-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {isUploading ? 'Processing...' : 'Select File'}
            </label>
          )}
        </div>

        {uploadStatus && (
          <div className={`mt-4 p-4 rounded-lg text-sm whitespace-pre-wrap ${uploadStatus.startsWith('❌') ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </main>
  )
}

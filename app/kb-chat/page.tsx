'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'

export default function KnowledgeBotPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('Uploading and analyzing PDF...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUploadStatus('✅ ' + data.message)
    } catch (err: any) {
      setUploadStatus('❌ Error: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#080810] text-white">
      <Sidebar />
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

          <div className="border-2 border-dashed border-white/20 rounded-xl p-10 flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all">
            <svg className="w-10 h-10 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm font-medium mb-1">Click to upload PDF</p>
            <p className="text-xs text-white/40 mb-4">Maximum file size: 10MB</p>
            
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              disabled={isUploading}
              className="hidden" 
              id="pdf-upload"
            />
            <label 
              htmlFor="pdf-upload" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isUploading ? 'bg-indigo-600/50 text-indigo-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {isUploading ? 'Processing...' : 'Select File'}
            </label>
          </div>

          {uploadStatus && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${uploadStatus.startsWith('❌') ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {uploadStatus}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

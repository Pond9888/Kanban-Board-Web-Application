import { Board } from '@/components/Board'

export default function BoardPage() {
  return (
    <main className="flex flex-col h-full overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/20 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-white">Kanban Board</h2>
          <p className="text-xs text-white/40">Drag cards • Click to open • AI agents run automatically</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Card
          </button>
          <div className="flex -space-x-2">
            {['T', 'A', 'B', 'C'].map((l, i) => (
              <div key={l} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#080810] flex items-center justify-center text-[10px] font-bold text-white" style={{ zIndex: 4 - i }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Board */}
      <div className="relative z-10 flex-1 overflow-auto p-6">
        <Board />
      </div>
    </main>
  )
}

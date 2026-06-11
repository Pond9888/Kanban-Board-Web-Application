export default function AutomationsPage() {
  return (
    <ComingSoon
      title="Automations"
      breadcrumb="Automations"
      description="Build no-code workflows that trigger actions automatically. Move cards, notify team members, and run AI agents based on rules you define."
      iconPath="M13 10V3L4 14h7v7l9-11h-7z"
      gradient="from-yellow-500 to-orange-600"
      features={['Trigger-based rules', 'AI agent auto-run', 'Slack / email notifications', 'Custom webhook support']}
    />
  )
}

function ComingSoon({ title, breadcrumb, description, iconPath, gradient, features }: {
  title: string; breadcrumb: string; description: string; iconPath: string; gradient: string; features: string[]
}) {
  return (
    <main className="flex flex-col h-full overflow-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>
      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0">
        <p className="text-[11px] text-white/30 mb-0.5">Kanban AI / {breadcrumb}</p>
        <h2 className="text-base font-bold text-white">{title}</h2>
      </header>
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-5 shadow-2xl`}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">{description}</p>
          <div className="rounded-xl bg-white/[0.04] border border-white/8 p-4 text-left space-y-2 mb-6">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-3">Coming features</p>
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-xs text-white/50">{f}</span>
              </div>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Coming Soon
          </span>
        </div>
      </div>
    </main>
  )
}

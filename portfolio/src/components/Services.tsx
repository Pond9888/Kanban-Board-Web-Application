const SERVICES = [
  {
    icon: '🤖',
    title: 'AI Chatbot Integration',
    desc: 'Add Claude AI to your website or internal tool',
    price: 'From $150',
    priceColor: 'var(--violet)',
    timeline: '3–5 days',
  },
  {
    icon: '📊',
    title: 'KPI / Analytics Dashboard',
    desc: 'Custom data dashboard with auto-reports, real-time updates, and PDF export',
    price: 'From $300',
    priceColor: 'var(--cyan)',
    timeline: '5–7 days',
  },
  {
    icon: '🚀',
    title: 'Custom AI Web Application',
    desc: 'Full-stack AI-powered app from scratch',
    price: 'From $500',
    priceColor: 'var(--pink)',
    timeline: '7–14 days',
  },
  {
    icon: '⚡',
    title: 'Business Automation Pipeline',
    desc: 'Workflow automation + API integrations',
    price: 'From $200',
    priceColor: 'var(--violet)',
    timeline: '3–5 days',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 reveal">
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--violet)' }}>
            // SERVICES
          </p>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--white)' }}>
            What I Build
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 reveal transition-all hover:scale-[1.01]"
              data-d={String(i * 80)}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Icon + text */}
              <div className="flex items-center gap-4 flex-1">
                <span className="text-3xl flex-shrink-0">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--white)' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Price + timeline */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1 flex-shrink-0">
                <span className="font-bold text-base" style={{ color: s.priceColor }}>
                  {s.price}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                  {s.timeline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

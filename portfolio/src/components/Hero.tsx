import ParticleCanvas from './ParticleCanvas';

const floatingIcons = [
  { icon: '⚡', style: { top: '22%', left: '7%', animationDuration: '4s', animationDelay: '0s' } },
  { icon: '🤖', style: { top: '38%', right: '9%', animationDuration: '5s', animationDelay: '1s' } },
  { icon: '🏗️', style: { top: '66%', left: '5%', animationDuration: '6s', animationDelay: '0.5s' } },
  { icon: '📊', style: { top: '16%', right: '17%', animationDuration: '4.5s', animationDelay: '1.5s' } },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <ParticleCanvas />

      {/* Floating icons */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {floatingIcons.map(({ icon, style }) => (
          <span
            key={icon}
            className="absolute text-3xl select-none opacity-60"
            style={{
              ...style,
              animation: `floatY ${style.animationDuration} ease-in-out infinite ${style.animationDelay}`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 w-full" style={{ zIndex: 10 }}>
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 reveal"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--cyan)', animation: 'pulse 2s ease-in-out infinite' }}
          />
          <span className="font-mono text-sm" style={{ color: 'var(--cyan)' }}>
            Available for new projects
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 reveal"
          data-d="100"
          style={{ color: 'var(--white)' }}
        >
          I build /{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI systems
          </span>{' '}
          / that work.
        </h1>

        {/* Description */}
        <p
          className="text-lg md:text-xl max-w-2xl mb-9 reveal"
          data-d="200"
          style={{ color: 'var(--muted)' }}
        >
          Full-stack developer &amp; AI strategist. I turn complex business problems into clean automated systems — using Next.js, Supabase, and Claude AI.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 mb-10 reveal" data-d="300">
          {[
            { val: '3+', label: 'Products' },
            { val: '100%', label: 'Automated' },
            { val: '5×', label: 'Faster' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black" style={{ color: 'var(--violet)' }}>
                {s.val}
              </div>
              <div className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 reveal" data-d="400">
          <a
            href="#projects"
            className="px-7 py-3.5 rounded-xl font-bold text-base text-white transition-all hover:opacity-85 hover:scale-105 active:scale-100"
            style={{ backgroundColor: 'var(--violet)' }}
          >
            View My Work →
          </a>
          <a
            href="#contact"
            className="px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:opacity-85"
            style={{ border: '1px solid var(--border)', color: 'var(--white)' }}
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ zIndex: 10 }}>
        <div
          className="w-6 h-10 rounded-full flex items-center justify-center"
          style={{ border: '2px solid rgba(136,146,176,0.35)' }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: 'rgba(136,146,176,0.6)', animation: 'scrollDown 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
}

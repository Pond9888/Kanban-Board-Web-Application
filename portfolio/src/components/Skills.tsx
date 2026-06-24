'use client';
import { useEffect, useRef } from 'react';

const SKILL_BARS = [
  { label: 'Claude API', pct: 95 },
  { label: 'Prompt Engineering', pct: 90 },
  { label: 'RAG/Embeddings', pct: 80 },
];

const OTHER_SKILLS = [
  { icon: '🏗️', title: 'Full-Stack Dev', desc: 'Next.js · React · TypeScript · Supabase · PostgreSQL · REST APIs' },
  { icon: '🔄', title: 'Automation', desc: 'Workflow automation · Cron jobs · Data pipelines · No-code integration' },
  { icon: '📊', title: 'KPI Systems', desc: 'Performance management · OKR frameworks · Auto-reporting · Dashboards' },
  { icon: '🎯', title: 'Product Strategy', desc: 'SaaS design · Go-to-market · Risk management from enterprise background' },
  { icon: '🚀', title: 'Rapid MVP', desc: 'Idea → working product in days. Validated with multiple shipped SaaS products.' },
];

const TECH_STACK = [
  'Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL',
  'Claude API', 'Cloudflare Workers', 'Tailwind CSS', 'Node.js', 'REST API', 'Git', 'Make',
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          barsRef.current.forEach((bar, i) => {
            if (!bar) return;
            setTimeout(() => {
              bar.style.width = bar.dataset.pct + '%';
            }, i * 150);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6" style={{ backgroundColor: 'var(--navy)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 reveal">
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--violet)' }}>
            // EXPERTISE
          </p>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--white)' }}>
            Skills & Stack
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Wide AI card */}
          <div
            className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-4 reveal"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-bold" style={{ color: 'var(--white)' }}>
                AI Integration
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Claude API, prompt engineering, RAG systems, AI chatbots, and automation pipelines that run themselves.
            </p>

            <div className="flex flex-col gap-3 mt-1">
              {SKILL_BARS.map((bar, i) => (
                <div key={bar.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                      {bar.label}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--violet)' }}>
                      {bar.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      ref={(el) => { barsRef.current[i] = el; }}
                      className="h-full rounded-full bar-fill"
                      data-pct={bar.pct}
                      style={{
                        width: '0%',
                        background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other skill cards */}
          {OTHER_SKILLS.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl p-5 flex flex-col gap-2 reveal"
              data-d={String((i + 1) * 80)}
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-bold" style={{ color: 'var(--white)' }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tech stack cloud */}
        <div
          className="rounded-2xl p-6 reveal"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-mono mb-4" style={{ color: 'var(--muted)' }}>
            // Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-sm font-mono transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(108,99,255,0.08)',
                  border: '1px solid var(--border)',
                  color: 'var(--white)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';
import { useRef } from 'react';

const PROJECTS = [
  {
    tag: 'Enterprise · Internal Tool',
    tagColor: 'var(--violet)',
    icon: '📊',
    title: 'KPI / OKR Performance System',
    desc: 'Replaced fragmented Excel reporting at a mid-size Thai corporation with a fully automated pipeline. Data collects, processes, generates PDFs, and distributes itself — zero manual work.',
    stats: ['5× Faster', '100% Automated', '50+ Employees'],
    stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Automation', 'PDF Gen'],
  },
  {
    tag: 'SaaS · B2B Product',
    tagColor: 'var(--cyan)',
    icon: '💈',
    title: 'Queuely — Salon Booking CRM',
    desc: 'Mobile-first SaaS for Thai salons and massage shops. Queue management, CRM, and booking in one tool — designed for non-technical small business owners.',
    stats: ['฿299 Starting', '3-in-1 Platform', 'LINE First UX'],
    stack: ['Next.js', 'Supabase', 'LINE API', 'PostgreSQL', 'Tailwind'],
  },
  {
    tag: 'AI · Automation',
    tagColor: 'var(--pink)',
    icon: '🤖',
    title: 'OrgBot — HR & IT Helpdesk AI',
    desc: 'Internal AI chatbot handling HR policy Q&A and IT support automatically. RAG architecture trained on company knowledge base — instant, accurate answers 24/7.',
    stats: ['24/7 Always On', 'RAG Architecture', '<1s Response'],
    stack: ['Claude API', 'RAG', 'Next.js', 'Supabase', 'Edge'],
  },
  {
    tag: 'Web App · Custom',
    tagColor: 'var(--violet)',
    icon: '🚀',
    title: 'AI Project Management App',
    desc: 'Custom AI-powered project management web app. Claude AI integration for smart task breakdown, real-time progress tracking, and AI-assisted planning for teams.',
    stats: ['AI Task Split', 'Live Dashboard', 'RBAC Auth'],
    stack: ['Next.js', 'Claude API', 'Supabase', 'TypeScript', 'Tailwind'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 reveal">
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--violet)' }}>
            // WORK
          </p>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--white)' }}>
            Selected Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  delay,
}: {
  project: (typeof PROJECTS)[number];
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  }

  function onMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  }

  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-6 flex flex-col gap-5 cursor-default reveal"
      data-d={String(delay)}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        transition: 'transform 0.2s ease',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Tag */}
      <span
        className="inline-block text-xs font-mono font-semibold px-2.5 py-1 rounded-full w-fit"
        style={{ color: project.tagColor, backgroundColor: `${project.tagColor}18` }}
      >
        {project.tag}
      </span>

      {/* Icon + Title */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{project.icon}</span>
        <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--white)' }}>
          {project.title}
        </h3>
      </div>

      {/* Desc */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        {project.desc}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        {project.stats.map((s) => (
          <span
            key={s}
            className="text-xs px-2.5 py-1 rounded-lg font-mono"
            style={{ backgroundColor: 'rgba(108,99,255,0.1)', color: 'var(--white)', border: '1px solid var(--border)' }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
        {project.stack.map((tech) => (
          <span key={tech} className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

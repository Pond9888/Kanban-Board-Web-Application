'use client';
import { useState, useEffect } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#services', label: 'Services' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? { backgroundColor: 'rgba(10,15,46,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' } : {}}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-mono font-bold text-lg" style={{ color: 'var(--white)' }}>
          TW <span style={{ color: 'var(--violet)' }}>//</span> NextHorizon
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--violet)' }}
          >
            Hire Me
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: 'var(--white)' }}
        >
          <span className="block w-6 h-0.5 bg-current transition-all" style={open ? { transform: 'rotate(45deg) translate(3px, 3px)' } : {}} />
          <span className="block w-6 h-0.5 bg-current transition-all" style={open ? { opacity: 0 } : {}} />
          <span className="block w-4 h-0.5 bg-current transition-all" style={open ? { transform: 'rotate(-45deg) translate(3px, -3px)', width: '24px' } : {}} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={open ? { maxHeight: '300px' } : { maxHeight: '0' }}
      >
        <div className="px-6 pb-4 flex flex-col gap-4" style={{ backgroundColor: 'rgba(10,15,46,0.95)', borderTop: '1px solid var(--border)' }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-base py-1 transition-colors"
              style={{ color: 'var(--muted)' }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="py-2.5 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--violet)' }}
            onClick={() => setOpen(false)}
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}

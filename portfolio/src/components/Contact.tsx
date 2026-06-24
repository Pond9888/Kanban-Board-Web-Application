const CONTACT_LINKS = [
  {
    icon: '🛒',
    label: 'Order on Fiverr',
    href: 'https://www.fiverr.com/tt9888',
    sub: 'fiverr.com/tt9888',
  },
  {
    icon: '✉️',
    label: 'Send an Email',
    href: 'mailto:teerawat.traitosprapa@gmail.com',
    sub: 'teerawat.traitosprapa@gmail.com',
  },
  {
    icon: '💼',
    label: 'Connect on LinkedIn',
    href: 'https://linkedin.com/in/',
    sub: 'linkedin.com/in/',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6" style={{ backgroundColor: 'var(--navy)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 reveal">
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--violet)' }}>
            // CONTACT
          </p>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--white)' }}>
            Ready to build?
          </h2>
          <p className="text-lg mt-3 max-w-xl" style={{ color: 'var(--muted)' }}>
            Whether you need an AI chatbot, a data dashboard, or a full custom web app — let&apos;s make it happen fast.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 md:p-8 max-w-xl reveal"
          data-d="100"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex flex-col gap-4">
            {CONTACT_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] group"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
              >
                <span className="text-2xl flex-shrink-0">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold" style={{ color: 'var(--white)' }}>
                    {link.label}
                  </div>
                  <div
                    className="text-sm font-mono truncate transition-colors"
                    style={{ color: 'var(--muted)' }}
                  >
                    {link.sub}
                  </div>
                </div>
                <span className="text-lg opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--violet)' }}>
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

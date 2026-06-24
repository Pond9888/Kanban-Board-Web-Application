export default function Footer() {
  return (
    <footer
      className="py-6 px-6 border-t"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          © 2026 Teerawat — NextHorizon Studio
        </p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Built with{' '}
          <span style={{ color: 'var(--violet)' }}>♥</span>
          {' '}and Claude AI
        </p>
      </div>
    </footer>
  );
}

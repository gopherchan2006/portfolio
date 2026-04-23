const TAGS = [
  { label: 'Go',       color: 'var(--cyan)',   border: 'rgba(0,229,255,0.4)'   },
  { label: 'Trading',  color: 'var(--green)',  border: 'rgba(63,185,80,0.4)'   },
  { label: 'Algo',     color: 'var(--purple)', border: 'rgba(188,140,255,0.4)' },
  { label: 'DSA',      color: 'var(--orange)', border: 'rgba(255,152,0,0.4)'   },
  { label: 'Math',     color: 'var(--yellow)', border: 'rgba(210,153,34,0.4)'  },
  { label: 'Binance',  color: 'var(--cyan)',   border: 'rgba(0,229,255,0.3)'   },
]

export default function Hero() {
  return (
    <div className="hero" id="hero">
      <div className="hero-avatar">🐹</div>

      <h1 className="hero-name">
        gopher<span className="grad">chan</span>
      </h1>

      <p className="hero-role">
        Go Developer
        <span className="dot">·</span>
        Algorithmic Trading
        <span className="dot">·</span>
        Mathematics
      </p>

      <p className="hero-desc">
        Building real-time market analysis tools and quantitative algorithms.
        Passionate about trading systems, mathematical modeling, and neural networks.
      </p>

      <div className="hero-tags">
        {TAGS.map(t => (
          <span
            key={t.label}
            className="tag"
            style={{ color: t.color, borderColor: t.border }}
          >
            {t.label}
          </span>
        ))}
      </div>

      <div className="hero-btns">
        <a className="btn btn-primary" href="https://github.com/gopherchan2006" target="_blank" rel="noreferrer">
          <GithubIcon /> GitHub
        </a>
        <a className="btn btn-secondary" href="#projects">
          <CodeIcon /> Projects
        </a>
        <a className="btn btn-ghost" href="mailto:r3ndyhell@gmail.com">
          <MailIcon /> r3ndyhell@gmail.com
        </a>
      </div>
    </div>
  )
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

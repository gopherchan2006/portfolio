const LINKS = [
  {
    href:    'https://github.com/gopherchan2006',
    variant: 'github',
    icon:    <GithubIcon />,
    label:   'GitHub',
    value:   'gopherchan2006',
  },
  {
    href:    'mailto:r3ndyhell@gmail.com',
    variant: 'email',
    icon:    <MailIcon />,
    label:   'Email',
    value:   'r3ndyhell@gmail.com',
  },
  {
    href:    'https://leetcode.com/u/gopherchan2006/',
    variant: 'leetcode',
    icon:    <LeetcodeIcon />,
    label:   'LeetCode',
    value:   'gopherchan2006',
  },
]

export default function Contact() {
  return (
    <section id="contact">
      <h2 className="section-title">
        <span className="num">03</span> Contact
      </h2>
      <p className="section-sub">Reach out or explore my work</p>

      <div className="contact-cards">
        {LINKS.map(l => (
          <a
            key={l.label}
            className={`contact-card ${l.variant}`}
            href={l.href}
            target={l.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer"
          >
            <span className="contact-icon">{l.icon}</span>
            <span className="contact-label">{l.label}</span>
            <span className="contact-value">{l.value}</span>
          </a>
        ))}
      </div>

      <div className="future-note" style={{ marginTop: '28px' }}>
        <h3>🚀 Coming Soon</h3>
        <p>
          Direct API access to my live trading tools and services — query real-time
          market data, run pattern detection, and explore mathematical models
          right from this page.
        </p>
        <div className="future-tags">
          <span>REST API</span>
          <span>WebSocket</span>
          <span>Pattern Scanner</span>
          <span>Live Charts</span>
          <span>Order Book</span>
        </div>
      </div>
    </section>
  )
}

function GithubIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--cyan)">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function LeetcodeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--purple)">
      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.823-.662l-4.38-4.380c-.966-.966-.966-2.509 0-3.475l4.38-4.38c.466-.466 1.111-.661 1.823-.661s1.357.195 1.823.661l2.697 2.606c.924.925 1.086 2.364.433 3.492L15.16 15c-.498-.498-1.328-.488-1.799 0l-.93.93c-.47.47-.47 1.27 0 1.74l.93.93c.471.47 1.301.48 1.8 0l1.314-1.314c.652 1.127.49 2.567-.433 3.49zM13.421 7.39L11.6 5.567c-.924-.924-2.364-1.086-3.491-.433L6.795 6.449c-.499.498-.489 1.328 0 1.799l.93.93c.47.47 1.27.47 1.74 0l.93-.93c.47-.47 1.3-.48 1.8 0l1.822 1.823c.924.924 1.087 2.363.434 3.491l1.313-1.313c.924-.924 1.086-2.364.434-3.49l-1.777-1.37z"/>
    </svg>
  )
}

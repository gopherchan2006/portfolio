const INTERESTS = [
  {
    icon: '🐹',
    title: 'Go Language',
    desc: 'Deep admiration for Go\'s simplicity, performance, and concurrency model. It\'s my primary tool for everything from CLI utilities to real-time systems.',
    variant: 'c',
  },
  {
    icon: '📈',
    title: 'Algorithmic Trading',
    desc: 'Building real-time market scanners, pattern detectors, and quantitative tools. I connect theory directly to live data from Binance and other exchanges.',
    variant: 'g',
  },
  {
    icon: '∑',
    title: 'Mathematics',
    desc: 'From linear algebra to statistical modeling — math is the foundation of every meaningful system I build. Equations are just code waiting to happen.',
    variant: 'o',
  },
  {
    icon: '🧠',
    title: 'Neural Networks',
    desc: 'Exploring the intersection of deep learning and quantitative finance. Applying ML ideas to market prediction and pattern recognition.',
    variant: 'p',
  },
]

export default function About() {
  return (
    <section id="about">
      <h2 className="section-title">
        <span className="num">01</span> About Me
      </h2>
      <p className="section-sub">Who I am and what drives me</p>

      <div className="glass cyan" style={{ marginBottom: '24px' }}>
        <div className="glass-title">
          <span className="icon">💬</span> In short
        </div>
        <p>
          I'm a Go developer with a deep love and respect for the language.
          I build real-time trading tools, pattern recognition systems, and quantitative
          algorithms — bringing mathematics, clean code, and market intuition together.
          Currently exploring the intersection of neural networks and financial markets.
        </p>
      </div>

      <div className="about-grid">
        {INTERESTS.map(item => (
          <div key={item.title} className={`interest-card ${item.variant}`}>
            <span className="interest-icon">{item.icon}</span>
            <span className="interest-title">{item.title}</span>
            <span className="interest-desc">{item.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

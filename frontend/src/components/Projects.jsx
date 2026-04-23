const PROJECTS = [
  {
    name: 'go-triangle-detector',
    stars: 3,
    variant: 'trading',
    desc: 'Detects ascending triangle patterns in real candlestick data fetched from Binance. Supports multi-symbol batch mode, configurable intervals, and outputs PNG chart screenshots via go-echarts.',
    tags: ['Go', 'Binance API', 'go-echarts', 'Pattern Detection', 'Trading'],
    url: 'https://github.com/gopherchan2006/go-triangle-detector',
  },
  {
    name: 'go-dsa',
    stars: 3,
    variant: 'dsa',
    desc: 'Data Structures & Algorithms implemented in Go with professional-grade benchmarks, detailed walkthroughs, and test coverage. Built for interview prep and deep understanding of core CS concepts.',
    tags: ['Go', 'DSA', 'Benchmarks', 'Algorithms', 'LeetCode'],
    url: 'https://github.com/gopherchan2006/go-dsa',
  },
  {
    name: 'go-linear-equations-solver',
    stars: 3,
    variant: 'math',
    desc: 'CLI tool that parses linear equations, computes all pairwise intersection points, and exports an interactive Plotly.js HTML visualization. Supports configurable axis bounds and incompatible systems.',
    tags: ['Go', 'Plotly.js', 'Mathematics', 'CLI', 'Visualization'],
    url: 'https://github.com/gopherchan2006/go-linear-equations-solver',
  },
  {
    name: 'go-orderwatch',
    stars: 2,
    variant: 'scanner',
    desc: 'Real-time Binance order book anomaly scanner. Connects to WebSocket depth streams across all liquid USDT pairs and detects WALL, SPOOF, and ICEBERG patterns. Terminal redraws every 500 ms.',
    tags: ['Go', 'WebSocket', 'Binance', 'Order Book', 'Real-time'],
    url: 'https://github.com/gopherchan2006/go-orderwatch',
  },
]

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <h2 className="section-title">
        <span className="num">02</span> Go Projects
      </h2>
      <p className="section-sub">Open-source tools in trading, algorithms & mathematics · ≥ 2 stars</p>

      <div className="projects-grid">
        {PROJECTS.map(p => (
          <div key={p.name} className={`project-card ${p.variant}`}>
            <div className="project-header">
              <span className="project-name">{p.name}</span>
            </div>
            <p className="project-desc">{p.desc}</p>
            <div className="project-tags">
              {p.tags.map(t => (
                <span key={t} className="project-tag">{t}</span>
              ))}
            </div>
            <a className="project-link" href={p.url} target="_blank" rel="noreferrer">
              View on GitHub <ArrowRightIcon />
            </a>
          </div>
        ))}
      </div>

      <div className="projects-footer">
        More projects in development — visit{' '}
        <a href="https://github.com/gopherchan2006" target="_blank" rel="noreferrer">
          github.com/gopherchan2006
        </a>{' '}
        for the full list
      </div>
    </section>
  )
}

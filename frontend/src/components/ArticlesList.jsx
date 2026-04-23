import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

const ACCENT_COLORS = {
  cyan:   { tag: 'c', dot: 'var(--cyan)',   dimBorder: 'rgba(0,229,255,0.25)' },
  purple: { tag: 'p', dot: 'var(--purple)', dimBorder: 'rgba(188,140,255,0.25)' },
  orange: { tag: 'o', dot: 'var(--orange)', dimBorder: 'rgba(255,152,0,0.25)' },
  green:  { tag: 'g', dot: 'var(--green)',  dimBorder: 'rgba(63,185,80,0.25)' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ArticlesList() {
  return (
    <div className="articles-page">
      <div className="articles-header">
        <h1 className="articles-title">
          <span className="articles-title-icon">📝</span>
          Articles
        </h1>
        <p className="articles-subtitle">
          Notes on Go, databases, algorithms and frontend
        </p>
      </div>

      <div className="articles-grid">
        {articles.map(article => {
          const ac = ACCENT_COLORS[article.accent] ?? ACCENT_COLORS.cyan
          return (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              className={`article-card article-card--${article.accent}`}
            >
              <div className="article-card__top">
                <div className="article-card__tags">
                  {article.tags.map(t => (
                    <span key={t} className="article-card__tag">{t}</span>
                  ))}
                </div>
                <span className="article-card__read-time">{article.readTime}</span>
              </div>

              <h2 className="article-card__title">{article.title}</h2>
              <p className="article-card__summary">{article.summary}</p>

              <div className="article-card__footer">
                <span className="article-card__date">{formatDate(article.date)}</span>
                <span className="article-card__arrow">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

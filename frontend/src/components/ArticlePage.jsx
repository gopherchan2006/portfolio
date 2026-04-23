import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchArticle, fetchComments, postComment, postReply } from '../api'

// ── Рендер блоков контента ─────────────────────────────────────
function ContentBlock({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="ap-h2">{block.text}</h2>
    case 'paragraph':
      return <p className="ap-p">{block.text}</p>
    case 'code':
      return (
        <pre className="ap-code">
          <div className="ap-code__lang">{block.lang}</div>
          <code>{block.text}</code>
        </pre>
      )
    default:
      return null
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function Comment({ comment, onReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText]         = useState('')
  const [replyName, setReplyName]         = useState('')

  function submitReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(comment.id, {
      name: replyName.trim() || 'Anonymous',
      text: replyText.trim(),
    })
    setReplyText('')
    setReplyName('')
    setShowReplyForm(false)
  }

  return (
    <div className="comment">
      <div className="comment__avatar">
        {comment.author.charAt(0).toUpperCase()}
      </div>
      <div className="comment__body">
        <div className="comment__header">
          <span className="comment__name">{comment.author}</span>
          <span className="comment__date">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="comment__text">{comment.text}</p>
        <button
          className="comment__reply-btn"
          onClick={() => setShowReplyForm(v => !v)}
        >
          {showReplyForm ? 'Cancel' : '↩ Reply'}
        </button>

        {comment.replies?.length > 0 && (
          <div className="comment__replies">
            {comment.replies.map(r => (
              <div key={r.id} className="comment comment--reply">
                <div className="comment__avatar comment__avatar--sm">
                  {r.author.charAt(0).toUpperCase()}
                </div>
                <div className="comment__body">
                  <div className="comment__header">
                    <span className="comment__name">{r.author}</span>
                    <span className="comment__date">{formatDate(r.createdAt)}</span>
                  </div>
                  <p className="comment__text">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showReplyForm && (
          <form className="comment-form comment-form--reply" onSubmit={submitReply}>
            <input
              className="comment-form__input"
              placeholder="Your name (optional)"
              value={replyName}
              onChange={e => setReplyName(e.target.value)}
              maxLength={60}
            />
            <textarea
              className="comment-form__textarea"
              placeholder="Your reply..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={3}
              maxLength={2000}
              required
            />
            <button type="submit" className="btn btn-primary comment-form__submit">
              Post reply
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function CommentsSection({ articleSlug }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [name, setName]         = useState('')
  const [text, setText]         = useState('')
  const formRef                 = useRef(null)

  useEffect(() => {
    setLoading(true)
    fetchComments(articleSlug)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [articleSlug])

  async function addComment(e) {
    e.preventDefault()
    if (!text.trim()) return
    try {
      const c = await postComment(articleSlug, name.trim() || 'Anonymous', text.trim())
      setComments(prev => [...prev, { ...c, replies: [] }])
      setName('')
      setText('')
    } catch {}
  }

  async function addReply(commentId, reply) {
    try {
      const r = await postReply(commentId, reply.name, reply.text)
      setComments(prev =>
        prev.map(c => c.id === commentId ? { ...c, replies: [...c.replies, r] } : c)
      )
    } catch {}
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Comments
        {comments.length > 0 && (
          <span className="comments-count">{comments.length}</span>
        )}
      </h3>

      {loading && <p className="comments-empty">Loading comments...</p>}
      {!loading && comments.length === 0 && (
        <p className="comments-empty">No comments yet. Be the first!</p>
      )}

      <div className="comments-list">
        {comments.map(c => (
          <Comment key={c.id} comment={c} onReply={addReply} />
        ))}
      </div>

      <form ref={formRef} className="comment-form" onSubmit={addComment}>
        <h4 className="comment-form__title">Leave a comment</h4>
        <input
          className="comment-form__input"
          placeholder="Your name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={60}
        />
        <textarea
          className="comment-form__textarea"
          placeholder="Share your thoughts..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          maxLength={2000}
          required
        />
        <button type="submit" className="btn btn-primary comment-form__submit">
          Post
        </button>
      </form>
    </div>
  )
}

export default function ArticlePage() {
  const { slug }                    = useParams()
  const navigate                    = useNavigate()
  const [article, setArticle]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchArticle(slug)
      .then(data => {
        if (!data) setNotFound(true)
        else setArticle(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (loading) {
    return <div className="ap-not-found"><p>Loading...</p></div>
  }

  if (notFound || !article) {
    return (
      <div className="ap-not-found">
        <p>Article not found.</p>
        <Link to="/articles" className="btn btn-secondary">← All articles</Link>
      </div>
    )
  }

  return (
    <div className="ap-wrapper">
      {/* Назад */}
      <button className="ap-back" onClick={() => navigate(-1)}>
        ← All articles
      </button>

      {/* Шапка статьи */}
      <header className={`ap-header ap-header--${article.accent}`}>
        <div className="ap-header__tags">
          {article.tags.map(t => (
            <span key={t} className="article-card__tag">{t}</span>
          ))}
        </div>
        <h1 className="ap-header__title">{article.title}</h1>
        <div className="ap-header__meta">
          <span>{formatDate(article.createdAt)}</span>
          <span className="ap-header__dot">·</span>
          <span>{article.readTime} read</span>
        </div>
        <p className="ap-header__summary">{article.summary}</p>
      </header>

      {/* Контент */}
      <article className="ap-content">
        {article.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}
      </article>

      <div className="ap-divider" />

      {/* Комментарии */}
      <CommentsSection articleSlug={article.slug} />
    </div>
  )
}

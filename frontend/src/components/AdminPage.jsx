import { useState, useEffect, useCallback } from 'react'
import {
  adminLogin, adminFetchArticles,
  adminCreateArticle, adminUpdateArticle, adminDeleteArticle,
} from '../api'

const EMPTY_FORM = {
  slug: '', title: '', summary: '', accent: 'cyan',
  readTime: 5, tags: '', published: false,
  content: '[]',
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await adminLogin(username, password)
      onLogin(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__title">Admin</div>
        <form onSubmit={submit} className="admin-login__form">
          <input
            className="admin-input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <div className="admin-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function ArticleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    let content
    try {
      content = JSON.parse(form.content)
    } catch {
      setError('Content must be valid JSON array')
      return
    }
    const article = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      readTime: Number(form.readTime),
      content,
    }
    try {
      await onSave(article)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="admin-article-form" onSubmit={submit}>
      <div className="admin-form-row">
        <label>Slug</label>
        <input className="admin-input" value={form.slug} onChange={e => set('slug', e.target.value)} required />
      </div>
      <div className="admin-form-row">
        <label>Title</label>
        <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>
      <div className="admin-form-row">
        <label>Summary</label>
        <input className="admin-input" value={form.summary} onChange={e => set('summary', e.target.value)} />
      </div>
      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label>Accent</label>
          <select className="admin-input" value={form.accent} onChange={e => set('accent', e.target.value)}>
            <option>cyan</option>
            <option>purple</option>
            <option>orange</option>
            <option>green</option>
          </select>
        </div>
        <div className="admin-form-row">
          <label>Read time (min)</label>
          <input className="admin-input" type="number" min={1} value={form.readTime} onChange={e => set('readTime', e.target.value)} />
        </div>
      </div>
      <div className="admin-form-row">
        <label>Tags (comma separated)</label>
        <input className="admin-input" value={form.tags} onChange={e => set('tags', e.target.value)} />
      </div>
      <div className="admin-form-row">
        <label>Content (JSON array of blocks)</label>
        <textarea
          className="admin-input admin-textarea"
          rows={8}
          value={form.content}
          onChange={e => set('content', e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="admin-form-row admin-form-row--check">
        <label>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          Published
        </label>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form-actions">
        <button className="btn btn-primary" type="submit">Save</button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function AdminPage() {
  const [token, setToken]       = useState(() => sessionStorage.getItem('admin_token') ?? '')
  const [articles, setArticles] = useState([])
  const [editing, setEditing]   = useState(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading]   = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const list = await adminFetchArticles(token)
      setArticles(list)
    } catch {
      setToken('')
      sessionStorage.removeItem('admin_token')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  function handleLogin(t) {
    sessionStorage.setItem('admin_token', t)
    setToken(t)
  }

  function logout() {
    sessionStorage.removeItem('admin_token')
    setToken('')
    setArticles([])
  }

  async function handleCreate(article) {
    await adminCreateArticle(token, article)
    setCreating(false)
    load()
  }

  async function handleUpdate(article) {
    await adminUpdateArticle(token, editing.id, article)
    setEditing(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this article?')) return
    await adminDeleteArticle(token, id)
    load()
  }

  if (!token) return <LoginForm onLogin={handleLogin} />

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <span className="admin-panel__title">Admin Panel</span>
        <button className="btn btn-ghost btn--sm" onClick={logout}>Log out</button>
      </div>

      {creating ? (
        <>
          <div className="admin-section-title">New article</div>
          <ArticleForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </>
      ) : editing ? (
        <>
          <div className="admin-section-title">Edit: {editing.title}</div>
          <ArticleForm
            initial={{ ...editing, tags: (editing.tags ?? []).join(', '), content: JSON.stringify(editing.content, null, 2) }}
            onSave={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </>
      ) : (
        <>
          <div className="admin-panel__toolbar">
            <button className="btn btn-primary btn--sm" onClick={() => setCreating(true)}>+ New article</button>
          </div>
          {loading ? (
            <div className="admin-status">Loading…</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Title</th>
                  <th>Accent</th>
                  <th>Published</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id}>
                    <td className="admin-table__mono">{a.slug}</td>
                    <td>{a.title}</td>
                    <td><span className={`admin-badge admin-badge--${a.accent}`}>{a.accent}</span></td>
                    <td>{a.published ? '✓' : '—'}</td>
                    <td className="admin-table__actions">
                      <button className="btn btn-ghost btn--sm" onClick={() => setEditing(a)}>Edit</button>
                      <button className="btn btn-danger btn--sm" onClick={() => handleDelete(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}

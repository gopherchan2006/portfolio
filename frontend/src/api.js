export async function fetchArticles() {
  const res = await fetch('/api/articles')
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function fetchArticle(slug) {
  const res = await fetch(`/api/articles/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

export async function fetchComments(slug) {
  const res = await fetch(`/api/articles/${slug}/comments`)
  if (!res.ok) throw new Error('Failed to fetch comments')
  return res.json()
}

export async function postComment(slug, author, text) {
  const res = await fetch(`/api/articles/${slug}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text }),
  })
  if (!res.ok) throw new Error('Failed to post comment')
  return res.json()
}

export async function postReply(commentId, author, text) {
  const res = await fetch(`/api/comments/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text }),
  })
  if (!res.ok) throw new Error('Failed to post reply')
  return res.json()
}

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function adminLogin(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (res.status === 401) throw new Error('Invalid credentials')
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function adminFetchArticles(token) {
  const res = await fetch('/api/admin/articles', { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function adminCreateArticle(token, article) {
  const res = await fetch('/api/admin/articles', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(article),
  })
  if (!res.ok) throw new Error('Failed to create article')
  return res.json()
}

export async function adminUpdateArticle(token, id, article) {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(article),
  })
  if (!res.ok) throw new Error('Failed to update article')
  return res.json()
}

export async function adminDeleteArticle(token, id) {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to delete article')
}

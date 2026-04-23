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

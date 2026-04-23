const BASE = import.meta.env.VITE_API_URL ?? ''

export async function fetchArticles() {
  const res = await fetch(`${BASE}/api/articles`)
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function fetchArticle(slug) {
  const res = await fetch(`${BASE}/api/articles/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

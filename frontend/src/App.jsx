import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import About         from './components/About'
import Projects      from './components/Projects'
import Contact       from './components/Contact'
import ArticlesList  from './components/ArticlesList'
import ArticlePage   from './components/ArticlePage'

// ── Главная страница ──────────────────────────────────────────
function HomePage() {
  // Scroll reveal только для главной
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.05 }
    )
    document.querySelectorAll('section').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="container">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  )
}

// ── Прогресс-бар + роуты ──────────────────────────────────────
function AppInner() {
  const [progress, setProgress] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Сбрасываем прогресс-бар при смене страницы
  useEffect(() => {
    setProgress(0)
  }, [location.pathname])

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="bg-grid" />
      <Navbar />
      <div className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={
            <div className="container"><ArticlesList /></div>
          } />
          <Route path="/articles/:slug" element={
            <div className="container"><ArticlePage /></div>
          } />
        </Routes>
      </div>
      <footer className="footer">
        <span>Built with React · gopherchan2006 · {new Date().getFullYear()}</span>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppInner />
    </BrowserRouter>
  )
}

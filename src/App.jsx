import { useEffect, useState } from 'react'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Projects from './components/Projects'
import Contact  from './components/Contact'

export default function App() {
  const [progress, setProgress] = useState(0)

  // ── Progress bar ──
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Scroll reveal ──
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
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="bg-grid" />
      <Navbar />
      <div className="page">
        <div className="container">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </div>
      </div>
      <footer className="footer">
        <span>Built with React · gopherchan2006 · {new Date().getFullYear()}</span>
      </footer>
    </>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome   = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Якорные ссылки работают только на главной
  function homeAnchor(anchor) {
    return isHome ? anchor : `/${anchor}`
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link className="nav-logo" to="/">
          <span className="logo-bracket">&lt;</span>
          gopherchan2006
          <span className="logo-bracket">/&gt;</span>
        </Link>
        <div className="nav-links">
          <a href={homeAnchor('#about')}>About</a>
          <a href={homeAnchor('#projects')}>Projects</a>
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              isActive ? 'nav-articles nav-articles--active' : 'nav-articles'
            }
          >
            Articles
          </NavLink>
          <a href={homeAnchor('#contact')} className="nav-cta">Contact</a>
        </div>
      </div>
    </nav>
  )
}

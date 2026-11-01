import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Fieldnotes home">
          fieldnotes<span>.</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/" activeProps={{ className: 'nav-link active' }} className="nav-link">Stories</Link>
          <a className="nav-link" href="#about">About</a>
        </nav>
        <Link to="/new" className="write-link">Write a story <ArrowUpRight size={15} /></Link>
      </div>
    </header>
  )
}
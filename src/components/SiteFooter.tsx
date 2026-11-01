import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-panel">
        <div className="footer-top">
          <div>
            <span className="footer-kicker">FIELDNOTES JOURNAL</span>
            <h2>Have a story worth sharing?</h2>
            <p>Good ideas get better when they are shared.</p>
          </div>
          <Link to="/new" className="footer-cta">Write a story <ArrowUpRight size={16} /></Link>
        </div>
        <div className="footer-bottom">
          <Link to="/" className="footer-brand">fieldnotes<span>.</span></Link>
          <span>© {new Date().getFullYear()} Fieldnotes Journal</span>
          <a href="https://api.oluwasetemi.dev/reference" target="_blank" rel="noreferrer">API documentation <ArrowUpRight size={13} /></a>
        </div>
      </div>
    </footer>
  )
}
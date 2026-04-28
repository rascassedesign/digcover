'use client'

export default function Footer() {
  return (
    <footer className="dc-footer">
      <a
        href="https://rascasse.design"
        target="_blank"
        rel="noopener noreferrer"
        className="dc-footer-left"
      >
        <img
          src="/logos/rascasse-design.png"
          alt="Rascasse Design"
          className="dc-footer-logo"
        />
        <span className="dc-footer-name">Rascasse Design</span>
      </a>
      <span className="dc-footer-copy">© 2026 Rascasse Design. Tous droits réservés.</span>
    </footer>
  )
}

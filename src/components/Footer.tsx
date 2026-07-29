'use client'

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  )
}

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
      <a
        href="https://www.instagram.com/digcover.fr/"
        target="_blank"
        rel="noopener noreferrer"
        className="dc-footer-instagram"
        aria-label="DigCover sur Instagram"
      >
        <InstagramIcon />
      </a>
    </footer>
  )
}

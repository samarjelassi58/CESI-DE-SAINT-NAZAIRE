import Link from 'next/link'

/**
 * Skip to main content link for accessibility
 * @returns {JSX.Element} Skip link
 */
export default function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      aria-label="Aller au contenu principal"
    >
      Aller au contenu principal
    </Link>
  )
}

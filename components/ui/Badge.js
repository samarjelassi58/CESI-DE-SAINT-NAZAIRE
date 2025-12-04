import PropTypes from 'prop-types'

/**
 * Composant Badge pour afficher des statuts ou étiquettes
 * @param {Object} props - Les propriétés du badge
 * @param {React.ReactNode} props.children - Contenu du badge
 * @param {('default'|'success'|'warning'|'danger'|'info'|'verified')} props.variant - Style du badge
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {JSX.Element} Badge stylisé
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    verified: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info', 'verified']),
  className: PropTypes.string
}

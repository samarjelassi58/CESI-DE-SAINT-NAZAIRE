import PropTypes from 'prop-types'

/**
 * Composant Card conteneur avec shadow et hover optionnel
 * @param {Object} props - Les propriétés de la carte
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.hover - Active l'effet hover
 * @returns {JSX.Element} Carte conteneur
 */
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool
}

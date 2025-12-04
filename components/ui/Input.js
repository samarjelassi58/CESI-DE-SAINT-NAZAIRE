import PropTypes from 'prop-types'

/**
 * Composant Input avec label, icône et gestion d'erreur
 * @param {Object} props - Les propriétés du champ
 * @param {string} props.label - Label du champ
 * @param {string} props.error - Message d'erreur
 * @param {React.Component} props.icon - Icône Lucide React
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {JSX.Element} Champ de saisie
 */
export default function Input({ label, error, icon: Icon, className = '', ...props }) {
  const inputId = props.id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        )}
        <input
          id={inputId}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } rounded-lg focus:ring-2 focus:border-transparent transition`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  id: PropTypes.string
}

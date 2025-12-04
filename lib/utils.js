/**
 * Utility functions for the Talent Platform
 */

/**
 * Format a date to French locale
 * @param {Date|string} date - Date to format
 * @param {boolean} includeTime - Include time in output
 * @returns {string} Formatted date
 */
export function formatDate(date, includeTime = false) {
  if (!date) return 'N/A'

  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  }

  return dateObj.toLocaleDateString('fr-FR', options)
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Get initials from full name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export function getInitials(name) {
  if (!name) return '?'

  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Generate random color from name (consistent)
 * @param {string} name - Name for color generation
 * @returns {string} Hex color
 */
export function getColorFromName(name) {
  if (!name) return '#3b82f6'

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#6366f1'
  ]

  return colors[Math.abs(hash) % colors.length]
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and errors
 */
export function validatePassword(password) {
  const errors = []
  let strength = 0

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères')
  } else {
    strength += 1
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule')
  } else {
    strength += 1
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule')
  } else {
    strength += 1
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
  } else {
    strength += 1
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)')
  } else {
    strength += 1
  }

  return {
    isValid: errors.length === 0,
    strength, // 0-5
    errors
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Sort array by multiple keys
 * @param {Array} array - Array to sort
 * @param {Array<Object>} sortKeys - Array of {key, order} objects
 * @returns {Array} Sorted array
 */
export function multiSort(array, sortKeys) {
  return [...array].sort((a, b) => {
    for (const { key, order = 'asc' } of sortKeys) {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * Generate slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slug
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/**
 * Check if user has permission
 * @param {Object} user - User object
 * @param {string} permission - Required permission
 * @returns {boolean} Has permission
 */
export function hasPermission(user, permission) {
  if (!user) return false

  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'verify_badges'],
    user: ['read', 'write']
  }

  return rolePermissions[user.role]?.includes(permission) || false
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num)
}

/**
 * Calculate reading time
 * @param {string} text - Text content
 * @param {number} wordsPerMinute - Reading speed
 * @returns {string} Reading time
 */
export function calculateReadingTime(text, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min de lecture`
}

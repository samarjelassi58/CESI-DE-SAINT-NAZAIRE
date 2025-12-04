/**
 * Configuration constants for the Talent Platform application
 */

// App Information
export const APP_CONFIG = {
  name: 'Talent Map',
  description: 'Plateforme de cartographie des talents CESI',
  version: '1.0.0',
  author: 'CESI Saint-Nazaire'
}

// Pagination
export const PAGINATION = {
  TALENTS_PER_PAGE: 20,
  ADMIN_USERS_PER_PAGE: 25,
  PROJECTS_PER_PAGE: 10,
  COLLABORATIONS_PER_PAGE: 15
}

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

// Badge Types
export const BADGE_TYPES = {
  VERIFIED: 'verified',
  EXPERT: 'expert',
  MENTOR: 'mentor',
  COLLABORATOR: 'collaborator',
  INNOVATOR: 'innovator'
}

// Skill Categories
export const SKILL_CATEGORIES = {
  TECHNIQUE: 'technique',
  LINGUISTIC: 'linguistique',
  SOFT_SKILL: 'soft-skill',
  OTHER: 'autre'
}

// Skill Levels
export const SKILL_LEVELS = {
  BEGINNER: 'debutant',
  INTERMEDIATE: 'intermediaire',
  ADVANCED: 'avance',
  EXPERT: 'expert'
}

// Language Proficiency (CEFR)
export const LANGUAGE_PROFICIENCY = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
  NATIVE: 'natif'
}

// Collaboration Status
export const COLLABORATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed'
}

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  MAX_PROJECT_TITLE_LENGTH: 100,
  MAX_SKILL_NAME_LENGTH: 50,
  MIN_YEARS_EXPERIENCE: 0,
  MAX_YEARS_EXPERIENCE: 50
}

// Toast Configuration
export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '10px',
    background: '#333',
    color: '#fff'
  }
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE_EDIT: '/profile/edit',
  TALENTS: '/talents',
  MAP: '/map',
  COLLABORATIONS: '/collaborations',
  COLLABORATIONS_NEW: '/collaborations/new',
  ADMIN: '/admin'
}

// Protected Routes (require authentication)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE_EDIT,
  ROUTES.COLLABORATIONS,
  ROUTES.COLLABORATIONS_NEW,
  ROUTES.ADMIN
]

// Admin Only Routes
export const ADMIN_ROUTES = [ROUTES.ADMIN]

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    LOGIN_FAILED: 'Échec de la connexion. Vérifiez vos identifiants.',
    REGISTER_FAILED: "Échec de l'inscription. Veuillez réessayer.",
    UNAUTHORIZED: "Vous n'êtes pas autorisé à accéder à cette page.",
    SESSION_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.'
  },
  PROFILE: {
    LOAD_FAILED: 'Erreur lors du chargement du profil.',
    UPDATE_FAILED: 'Erreur lors de la mise à jour du profil.'
  },
  TALENTS: {
    LOAD_FAILED: 'Impossible de charger les talents.',
    NOT_FOUND: 'Aucun talent trouvé.'
  },
  COLLABORATION: {
    CREATE_FAILED: 'Erreur lors de la création de la collaboration.',
    UPDATE_FAILED: 'Erreur lors de la mise à jour de la collaboration.',
    LOAD_FAILED: 'Erreur lors du chargement des collaborations.'
  },
  GENERIC: 'Une erreur est survenue. Veuillez réessayer.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Connexion réussie !',
    REGISTER: 'Inscription réussie ! Bienvenue.',
    LOGOUT: 'Déconnexion réussie.'
  },
  PROFILE: {
    UPDATED: 'Profil mis à jour avec succès.',
    SKILL_ADDED: 'Compétence ajoutée.',
    SKILL_DELETED: 'Compétence supprimée.'
  },
  COLLABORATION: {
    CREATED: 'Demande de collaboration envoyée.',
    ACCEPTED: 'Collaboration acceptée !',
    DECLINED: 'Collaboration refusée.',
    COMPLETED: 'Collaboration marquée comme terminée.'
  },
  ADMIN: {
    USER_VERIFIED: 'Utilisateur vérifié avec succès.',
    ROLE_CHANGED: 'Rôle modifié avec succès.'
  }
}

// Theme Colors
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  categories: {
    technique: '#3b82f6',
    linguistique: '#8b5cf6',
    'soft-skill': '#10b981',
    autre: '#f59e0b'
  }
}

// API Rate Limits
export const RATE_LIMITS = {
  SEARCH_DEBOUNCE_MS: 300,
  AUTO_SAVE_DEBOUNCE_MS: 1000
}

// Feature Flags
export const FEATURES = {
  ENABLE_REAL_TIME: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_PWA: false
}

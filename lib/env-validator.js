/**
 * Environment Variable Validator
 * Ensures all required environment variables are present before the app starts
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

function validateEnv() {
  const missing = requiredEnvVars.filter(
    varName => !process.env[varName]
  )

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please create a .env.local file with these variables.\n` +
      `See .env.example for reference.`
    )
  }

  // Validate URL format
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url && !url.startsWith('https://') && !url.startsWith('http://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL starting with https://')
  }

  console.log('✅ Environment variables validated successfully')
}

// Run validation
validateEnv()

module.exports = { validateEnv }

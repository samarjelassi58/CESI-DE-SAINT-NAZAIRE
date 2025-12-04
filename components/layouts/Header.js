import Link from 'next/link'
import { Users } from 'lucide-react'

export default function Header({ user = null, showAuth = true }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Talent Map</h1>
        </Link>

        {showAuth && (
          <nav className="flex space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link href="/talents" className="text-gray-600 hover:text-blue-600 transition">
                  Talents
                </Link>
                <Link href="/map" className="text-gray-600 hover:text-blue-600 transition">
                  Carte
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition">
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

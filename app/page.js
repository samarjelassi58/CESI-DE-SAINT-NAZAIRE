import Link from 'next/link'
import { Users, Search, Map, Award } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Talent Map</h1>
          </div>
          <nav className="flex space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition">
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              S'inscrire
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Découvrez et partagez vos
            <span className="text-blue-600"> talents</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Plateforme collaborative pour cartographier les compétences, trouver des collaborateurs
            et développer des projets ensemble.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Créer mon profil
            </Link>
            <Link
              href="/talents"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
            >
              Explorer les talents
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-12 h-12 text-blue-600" />}
            title="Profils Talents"
            description="Créez votre profil complet avec vos compétences, passions, langues et projets réalisés"
          />
          <FeatureCard
            icon={<Search className="w-12 h-12 text-purple-600" />}
            title="Recherche Avancée"
            description="Trouvez facilement des collaborateurs selon leurs compétences et disponibilités"
          />
          <FeatureCard
            icon={<Map className="w-12 h-12 text-green-600" />}
            title="Carte Interactive"
            description="Visualisez l'écosystème des talents avec des cartes et nuages de compétences"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="0" label="Talents inscrits" />
            <StatCard number="0" label="Compétences" />
            <StatCard number="0" label="Projets" />
            <StatCard number="0" label="Collaborations" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-4">Badge Talent Verified</h3>
          <p className="text-xl text-blue-100 mb-8">
            Faites valider vos compétences par un responsable et obtenez votre badge officiel
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="w-6 h-6" />
              <span className="text-xl font-bold">Talent Map</span>
            </div>
            <p className="text-gray-400 mb-4">
              Plateforme de cartographie des talents - Défi National CESI
            </p>
            <p className="text-gray-500 text-sm">© 2025 Talent Map. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StatCard({ number, label }) {
  return (
    <div>
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

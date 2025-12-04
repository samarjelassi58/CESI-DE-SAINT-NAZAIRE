'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Search, Filter, Users, MapPin, Award, 
  Linkedin, Github, Globe, Mail, X, CheckCircle 
} from 'lucide-react'

export default function TalentsPage() {
  const [talents, setTalents] = useState([])
  const [filteredTalents, setFilteredTalents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    skills: '',
    languages: '',
    available: false,
    verified: false
  })

  useEffect(() => {
    loadTalents()
  }, [])

  useEffect(() => {
    filterTalents()
  }, [searchTerm, filters, talents])

  const loadTalents = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills (*),
          languages (*),
          projects (*),
          passions (*),
          badges!badges_user_id_fkey (*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error.message, error.details)
        throw error
      }
      
      console.log('Profiles loaded:', profiles?.length || 0)
      setTalents(profiles || [])
      setFilteredTalents(profiles || [])
    } catch (error) {
      console.error('Error loading talents:', error.message || error)
      // En cas d'erreur, on affiche quand même une liste vide au lieu de crasher
      setTalents([])
      setFilteredTalents([])
    } finally {
      setLoading(false)
    }
  }

  const filterTalents = () => {
    let filtered = [...talents]

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by skills
    if (filters.skills) {
      filtered = filtered.filter(talent =>
        talent.skills?.some(skill =>
          skill.name.toLowerCase().includes(filters.skills.toLowerCase())
        )
      )
    }

    // Filter by languages
    if (filters.languages) {
      filtered = filtered.filter(talent =>
        talent.languages?.some(lang =>
          lang.name.toLowerCase().includes(filters.languages.toLowerCase())
        )
      )
    }

    // Filter by availability
    if (filters.available) {
      filtered = filtered.filter(talent => talent.is_available)
    }

    // Filter by verified status
    if (filters.verified) {
      filtered = filtered.filter(talent => talent.is_verified)
    }

    setFilteredTalents(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Explorer les Talents</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/map" className="text-blue-600 hover:text-blue-700 font-semibold">
                Voir la carte
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rechercher par nom..."
                />
              </div>
            </div>

            <input
              type="text"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Compétence..."
            />

            <input
              type="text"
              value={filters.languages}
              onChange={(e) => setFilters({ ...filters, languages: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Langue..."
            />

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.available}
                  onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Disponibles</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Vérifiés</span>
              </label>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filters.skills || filters.languages || filters.available || filters.verified) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <FilterTag label={`Recherche: ${searchTerm}`} onRemove={() => setSearchTerm('')} />
              )}
              {filters.skills && (
                <FilterTag label={`Compétence: ${filters.skills}`} onRemove={() => setFilters({ ...filters, skills: '' })} />
              )}
              {filters.languages && (
                <FilterTag label={`Langue: ${filters.languages}`} onRemove={() => setFilters({ ...filters, languages: '' })} />
              )}
              {filters.available && (
                <FilterTag label="Disponibles" onRemove={() => setFilters({ ...filters, available: false })} />
              )}
              {filters.verified && (
                <FilterTag label="Vérifiés" onRemove={() => setFilters({ ...filters, verified: false })} />
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          <span className="font-semibold">{filteredTalents.length}</span> talent{filteredTalents.length > 1 ? 's' : ''} trouvé{filteredTalents.length > 1 ? 's' : ''}
        </div>

        {/* Talents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>

        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun talent trouvé</p>
            <p className="text-gray-400 mt-2">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterTag({ label, onRemove }) {
  return (
    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="hover:text-blue-900">
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

function TalentCard({ talent }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>{talent.full_name || 'Anonyme'}</span>
            {talent.is_verified && (
              <CheckCircle className="w-5 h-5 text-blue-600" title="Talent Verified" />
            )}
          </h3>
          {talent.location && (
            <p className="text-gray-600 text-sm flex items-center space-x-1 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{talent.location}</span>
            </p>
          )}
        </div>
        {talent.is_available && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Disponible
          </span>
        )}
      </div>

      {talent.bio && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{talent.bio}</p>
      )}

      {/* Skills */}
      {talent.skills && talent.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compétences</h4>
          <div className="flex flex-wrap gap-1">
            {talent.skills.slice(0, 5).map((skill) => (
              <span key={skill.id} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                {skill.name}
              </span>
            ))}
            {talent.skills.length > 5 && (
              <span className="text-xs text-gray-500">+{talent.skills.length - 5}</span>
            )}
          </div>
        </div>
      )}

      {/* Languages */}
      {talent.languages && talent.languages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Langues</h4>
          <div className="flex flex-wrap gap-1">
            {talent.languages.slice(0, 3).map((lang) => (
              <span key={lang.id} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        {talent.linkedin_url && (
          <a href={talent.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {talent.github_url && (
          <a href={talent.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
            <Github className="w-5 h-5" />
          </a>
        )}
        {talent.portfolio_url && (
          <a href={talent.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600">
            <Globe className="w-5 h-5" />
          </a>
        )}
        <div className="flex-1"></div>
        <Link 
          href={`/collaborations/new?talent=${talent.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          Contacter
        </Link>
      </div>

      {/* Badges */}
      {talent.badges && talent.badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {talent.badges.map((badge) => (
            <div key={badge.id} className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
              <Award className="w-3 h-3" />
              <span>{badge.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

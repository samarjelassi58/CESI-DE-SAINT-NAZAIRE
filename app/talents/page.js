'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { PAGINATION } from '@/lib/constants'
import {
  Search,
  Filter,
  Users,
  MapPin,
  Award,
  Linkedin,
  Github,
  Globe,
  Mail,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function TalentsPage() {
  const [talents, setTalents] = useState([])
  const [filteredTalents, setFilteredTalents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    skills: '',
    languages: '',
    available: false,
    verified: false
  })

  const talentsPerPage = PAGINATION.TALENTS_PER_PAGE
  const totalPages = Math.ceil(filteredTalents.length / talentsPerPage)
  const startIndex = (currentPage - 1) * talentsPerPage
  const endIndex = startIndex + talentsPerPage
  const currentTalents = filteredTalents.slice(startIndex, endIndex)

  useEffect(() => {
    loadTalents()
  }, [])

  useEffect(() => {
    filterTalents()
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [searchTerm, filters, talents])

  const loadTalents = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(
          `
          *,
          skills (*),
          languages (*),
          projects (*),
          passions (*),
          badges!badges_user_id_fkey (*)
        `
        )
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Erreur lors du chargement des talents')
        throw error
      }

      setTalents(profiles || [])
      setFilteredTalents(profiles || [])
    } catch (error) {
      toast.error('Impossible de charger les talents')
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
      filtered = filtered.filter(
        talent =>
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
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rechercher par nom..."
                />
              </div>
            </div>

            <input
              type="text"
              value={filters.skills}
              onChange={e => setFilters({ ...filters, skills: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Compétence..."
            />

            <input
              type="text"
              value={filters.languages}
              onChange={e => setFilters({ ...filters, languages: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Langue..."
            />

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.available}
                  onChange={e => setFilters({ ...filters, available: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Disponibles</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={e => setFilters({ ...filters, verified: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Vérifiés</span>
              </label>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm ||
            filters.skills ||
            filters.languages ||
            filters.available ||
            filters.verified) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <FilterTag label={`Recherche: ${searchTerm}`} onRemove={() => setSearchTerm('')} />
              )}
              {filters.skills && (
                <FilterTag
                  label={`Compétence: ${filters.skills}`}
                  onRemove={() => setFilters({ ...filters, skills: '' })}
                />
              )}
              {filters.languages && (
                <FilterTag
                  label={`Langue: ${filters.languages}`}
                  onRemove={() => setFilters({ ...filters, languages: '' })}
                />
              )}
              {filters.available && (
                <FilterTag
                  label="Disponibles"
                  onRemove={() => setFilters({ ...filters, available: false })}
                />
              )}
              {filters.verified && (
                <FilterTag
                  label="Vérifiés"
                  onRemove={() => setFilters({ ...filters, verified: false })}
                />
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-600">
            <span className="font-semibold">{filteredTalents.length}</span> talent
            {filteredTalents.length > 1 ? 's' : ''} trouvé{filteredTalents.length > 1 ? 's' : ''}
            {totalPages > 1 && (
              <span className="ml-2 text-sm">
                (Page {currentPage} sur {totalPages})
              </span>
            )}
          </div>
        </div>

        {/* Talents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentTalents.map(talent => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Précédent</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Page suivante"
            >
              <span>Suivant</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

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

      {talent.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{talent.bio}</p>}

      {/* Skills */}
      {talent.skills && talent.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compétences</h4>
          <div className="flex flex-wrap gap-1">
            {talent.skills.slice(0, 5).map(skill => (
              <span
                key={skill.id}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
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
            {talent.languages.slice(0, 3).map(lang => (
              <span
                key={lang.id}
                className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full"
              >
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        {talent.linkedin_url && (
          <a
            href={talent.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {talent.github_url && (
          <a
            href={talent.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900"
          >
            <Github className="w-5 h-5" />
          </a>
        )}
        {talent.portfolio_url && (
          <a
            href={talent.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-600"
          >
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
          {talent.badges.map(badge => (
            <div
              key={badge.id}
              className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full"
            >
              <Award className="w-3 h-3" />
              <span>{badge.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

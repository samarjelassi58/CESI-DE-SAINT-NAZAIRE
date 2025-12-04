'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Map, Users, ArrowLeft, Filter } from 'lucide-react'

export default function TalentMapPage() {
  const [talents, setTalents] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('cloud') // 'cloud' or 'network'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load all profiles with skills
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          is_verified,
          is_available,
          skills (*)
        `)

      if (profilesError) throw profilesError

      setTalents(profiles || [])

      // Aggregate all skills with counts
      const skillsMap = {}
      profiles?.forEach(profile => {
        profile.skills?.forEach(skill => {
          const key = skill.name.toLowerCase()
          if (!skillsMap[key]) {
            skillsMap[key] = {
              name: skill.name,
              count: 0,
              levels: {},
              categories: {},
              users: []
            }
          }
          skillsMap[key].count++
          skillsMap[key].levels[skill.level] = (skillsMap[key].levels[skill.level] || 0) + 1
          skillsMap[key].categories[skill.category] = true
          skillsMap[key].users.push({
            id: profile.id,
            name: profile.full_name,
            level: skill.level
          })
        })
      })

      const skillsArray = Object.values(skillsMap).sort((a, b) => b.count - a.count)
      setAllSkills(skillsArray)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSkillColor = (category) => {
    const colors = {
      'technique': '#3b82f6',
      'linguistique': '#8b5cf6',
      'soft-skill': '#10b981',
      'autre': '#f59e0b'
    }
    return colors[category] || colors['autre']
  }

  const getSkillSize = (count, maxCount) => {
    const minSize = 14
    const maxSize = 48
    return minSize + (count / maxCount) * (maxSize - minSize)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const maxSkillCount = allSkills[0]?.count || 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/talents" className="text-gray-600 hover:text-blue-600 transition">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Map className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Carte des Talents</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/talents" className="text-gray-600 hover:text-blue-600 transition">
                Liste des talents
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{talents.length}</div>
                <div className="text-gray-600 text-sm">Talents</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Map className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allSkills.length}</div>
                <div className="text-gray-600 text-sm">Compétences uniques</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {talents.filter(t => t.is_available).length}
                </div>
                <div className="text-gray-600 text-sm">Disponibles</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setViewMode('cloud')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === 'cloud'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Nuage de Compétences
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === 'bars'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Graphique à Barres
          </button>
        </div>

        {/* Skills Cloud View */}
        {viewMode === 'cloud' && (
          <div className="bg-white rounded-xl shadow-sm p-12 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Nuage de Compétences
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4 min-h-[400px]">
              {allSkills.slice(0, 50).map((skill, index) => {
                const fontSize = getSkillSize(skill.count, maxSkillCount)
                const category = Object.keys(skill.categories)[0]
                const color = getSkillColor(category)
                
                return (
                  <div
                    key={index}
                    className="skill-bubble hover:scale-110 transition-transform cursor-pointer group relative"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: color,
                      fontWeight: skill.count > maxSkillCount / 2 ? 'bold' : 'normal',
                      opacity: 0.7 + (skill.count / maxSkillCount) * 0.3
                    }}
                    title={`${skill.name} - ${skill.count} personne${skill.count > 1 ? 's' : ''}`}
                  >
                    {skill.name}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                        <div className="font-bold">{skill.name}</div>
                        <div>{skill.count} talent{skill.count > 1 ? 's' : ''}</div>
                        <div className="text-gray-300 text-xs">{category}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bars Chart View */}
        {viewMode === 'bars' && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Top 20 Compétences
            </h2>
            <div className="space-y-4">
              {allSkills.slice(0, 20).map((skill, index) => {
                const category = Object.keys(skill.categories)[0]
                const color = getSkillColor(category)
                const percentage = (skill.count / talents.length) * 100
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{skill.name}</span>
                        <span className="text-xs text-gray-500">({category})</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {skill.count} talent{skill.count > 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Légende des catégories</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700">Technique</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-600"></div>
              <span className="text-sm text-gray-700">Linguistique</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-sm text-gray-700">Soft Skills</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
              <span className="text-sm text-gray-700">Autre</span>
            </div>
          </div>
        </div>

        {/* Top Skills by Category */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>Top Compétences Techniques</span>
            </h3>
            <div className="space-y-2">
              {allSkills
                .filter(s => s.categories['technique'])
                .slice(0, 5)
                .map((skill, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="font-semibold text-blue-600">{skill.count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              <span>Top Soft Skills</span>
            </h3>
            <div className="space-y-2">
              {allSkills
                .filter(s => s.categories['soft-skill'])
                .slice(0, 5)
                .map((skill, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="font-semibold text-green-600">{skill.count}</span>
                  </div>
                ))}
              {allSkills.filter(s => s.categories['soft-skill']).length === 0 && (
                <p className="text-gray-500 text-sm">Aucune soft skill enregistrée</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  User,
  Settings,
  LogOut,
  Users,
  Search,
  Map,
  Award,
  FolderOpen,
  MessageSquare,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    collaborations: 0,
    badges: 0
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Fetch profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(profileData)

      // Fetch stats
      await fetchStats(user.id)
    } catch (error) {
      toast.error('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async userId => {
    try {
      const [skills, projects, collaborations, badges] = await Promise.all([
        supabase.from('skills').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('projects').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase
          .from('collaborations')
          .select('id', { count: 'exact' })
          .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`),
        supabase.from('badges').select('id', { count: 'exact' }).eq('user_id', userId)
      ])

      setStats({
        skills: skills.count || 0,
        projects: projects.count || 0,
        collaborations: collaborations.count || 0,
        badges: badges.count || 0
      })
    } catch (error) {
      // Stats non critiques, pas besoin d'alerter l'utilisateur
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Déconnexion réussie')
      router.push('/')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Talent Map</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/talents" className="text-gray-600 hover:text-blue-600 transition">
                Explorer
              </Link>
              <Link href="/collaborations" className="text-gray-600 hover:text-blue-600 transition">
                Collaborations
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenue, {profile?.full_name || 'Talent'} !</h2>
          <p className="text-blue-100 mb-4">
            {profile?.is_verified ? (
              <span className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Profil vérifié ✓</span>
              </span>
            ) : (
              'Complétez votre profil pour obtenir le badge Talent Verified'
            )}
          </p>
          <Link
            href="/profile/edit"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Modifier mon profil</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Award className="w-8 h-8 text-blue-600" />}
            title="Compétences"
            value={stats.skills}
            href="/profile/edit#skills"
            color="bg-blue-50"
          />
          <StatCard
            icon={<FolderOpen className="w-8 h-8 text-purple-600" />}
            title="Projets"
            value={stats.projects}
            href="/profile/edit#projects"
            color="bg-purple-50"
          />
          <StatCard
            icon={<MessageSquare className="w-8 h-8 text-green-600" />}
            title="Collaborations"
            value={stats.collaborations}
            href="/collaborations"
            color="bg-green-50"
          />
          <StatCard
            icon={<Award className="w-8 h-8 text-yellow-600" />}
            title="Badges"
            value={stats.badges}
            href="/profile/edit#badges"
            color="bg-yellow-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <ActionCard
            icon={<Search className="w-12 h-12 text-blue-600" />}
            title="Trouver des Talents"
            description="Recherchez des collaborateurs par compétences"
            href="/talents"
            buttonText="Explorer"
          />
          <ActionCard
            icon={<Map className="w-12 h-12 text-purple-600" />}
            title="Carte des Talents"
            description="Visualisez l'écosystème des compétences"
            href="/map"
            buttonText="Voir la carte"
          />
          <ActionCard
            icon={<Plus className="w-12 h-12 text-green-600" />}
            title="Nouvelle Collaboration"
            description="Proposez un projet ou demandez de l'aide"
            href="/collaborations/new"
            buttonText="Créer"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, href, color }) {
  return (
    <Link href={href} className="block">
      <div className={`${color} rounded-xl p-6 hover:shadow-lg transition`}>
        <div className="flex items-center justify-between mb-2">
          <div>{icon}</div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-gray-600">{title}</div>
      </div>
    </Link>
  )
}

function ActionCard({ icon, title, description, href, buttonText }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={href}
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        {buttonText}
      </Link>
    </div>
  )
}

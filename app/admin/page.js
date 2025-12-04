'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Shield, Users, Award, CheckCircle, X, TrendingUp, Activity } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalSkills: 0,
    totalProjects: 0,
    totalCollaborations: 0,
    pendingBadges: 0
  })
  const [users, setUsers] = useState([])
  const [pendingVerifications, setPendingVerifications] = useState([])

  useEffect(() => {
    checkAdminAndLoadData()
  }, [])

  const checkAdminAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        toast.error('Accès non autorisé')
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await loadStats()
      await loadUsers()
      await loadPendingVerifications()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const [users, skills, projects, collaborations] = await Promise.all([
        supabase.from('profiles').select('id, is_verified', { count: 'exact' }),
        supabase.from('skills').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('collaborations').select('id', { count: 'exact' })
      ])

      setStats({
        totalUsers: users.count || 0,
        verifiedUsers: users.data?.filter(u => u.is_verified).length || 0,
        totalSkills: skills.count || 0,
        totalProjects: projects.count || 0,
        totalCollaborations: collaborations.count || 0,
        pendingBadges: users.data?.filter(u => !u.is_verified).length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills (count),
          projects (count),
          badges (count)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadPendingVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills (count),
          projects (count)
        `)
        .eq('is_verified', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingVerifications(data || [])
    } catch (error) {
      console.error('Error loading pending verifications:', error)
    }
  }

  const handleVerifyUser = async (userId, verify = true) => {
    try {
      // Update user verification status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: verify })
        .eq('id', userId)

      if (profileError) throw profileError

      // If verifying, create a Talent Verified badge
      if (verify) {
        const { data: { user } } = await supabase.auth.getUser()
        
        const { error: badgeError } = await supabase
          .from('badges')
          .insert([{
            user_id: userId,
            type: 'verified',
            name: 'Talent Verified',
            description: 'Profil vérifié par un administrateur',
            verified_by: user.id,
            verified_at: new Date().toISOString()
          }])

        if (badgeError) throw badgeError
      }

      toast.success(verify ? 'Utilisateur vérifié !' : 'Vérification révoquée')
      await loadStats()
      await loadUsers()
      await loadPendingVerifications()
    } catch (error) {
      console.error('Error verifying user:', error)
      toast.error('Erreur lors de la vérification')
    }
  }

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      toast.success(`Rôle changé en ${newRole}`)
      await loadUsers()
    } catch (error) {
      console.error('Error changing role:', error)
      toast.error('Erreur lors du changement de rôle')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="Utilisateurs"
            value={stats.totalUsers}
            color="bg-blue-50"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            title="Vérifiés"
            value={stats.verifiedUsers}
            color="bg-green-50"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-yellow-600" />}
            title="Compétences"
            value={stats.totalSkills}
            color="bg-yellow-50"
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-purple-600" />}
            title="Projets"
            value={stats.totalProjects}
            color="bg-purple-50"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
            title="Collaborations"
            value={stats.totalCollaborations}
            color="bg-indigo-50"
          />
          <StatCard
            icon={<X className="w-6 h-6 text-red-600" />}
            title="En attente"
            value={stats.pendingBadges}
            color="bg-red-50"
          />
        </div>

        {/* Pending Verifications */}
        {pendingVerifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-6 h-6 text-yellow-600" />
              <span>Demandes de vérification en attente ({pendingVerifications.length})</span>
            </h2>
            <div className="space-y-4">
              {pendingVerifications.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.full_name || 'Sans nom'}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{user.skills?.[0]?.count || 0} compétences</span>
                      <span>{user.projects?.[0]?.count || 0} projets</span>
                      <span className="text-xs">
                        Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerifyUser(user.id, true)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Vérifier</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <span>Ignorer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Tous les utilisateurs</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-gray-700">Utilisateur</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Email</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Compétences</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Projets</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Badges</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Rôle</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{user.full_name || 'Sans nom'}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3 text-sm text-gray-600">{user.skills?.[0]?.count || 0}</td>
                    <td className="py-3 text-sm text-gray-600">{user.projects?.[0]?.count || 0}</td>
                    <td className="py-3 text-sm text-gray-600">{user.badges?.[0]?.count || 0}</td>
                    <td className="py-3">
                      {user.is_verified ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Vérifié
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Non vérifié
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role || 'user'}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        {!user.is_verified ? (
                          <button
                            onClick={() => handleVerifyUser(user.id, true)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Vérifier
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyUser(user.id, false)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Révoquer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`${color} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  )
}

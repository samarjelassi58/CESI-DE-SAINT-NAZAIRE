'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Send, Users } from 'lucide-react'

export default function NewCollaborationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const talentId = searchParams.get('talent')

  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [talents, setTalents] = useState([])
  const [formData, setFormData] = useState({
    receiver_id: talentId || '',
    project_title: '',
    description: '',
    required_skills: '',
    message: ''
  })

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      // Load talents for dropdown
      const { data: talentsData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .neq('id', user.id)
      
      setTalents(talentsData || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.receiver_id) {
      toast.error('Veuillez sélectionner un talent')
      return
    }

    setLoading(true)

    try {
      const collaborationData = {
        requester_id: userId,
        receiver_id: formData.receiver_id,
        project_title: formData.project_title,
        description: formData.description,
        required_skills: formData.required_skills ? formData.required_skills.split(',').map(s => s.trim()) : [],
        message: formData.message,
        status: 'pending'
      }

      const { error } = await supabase
        .from('collaborations')
        .insert([collaborationData])

      if (error) throw error

      toast.success('Demande de collaboration envoyée !')
      router.push('/collaborations')
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link href="/collaborations" className="text-gray-600 hover:text-blue-600 transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle Collaboration</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un talent *
              </label>
              <select
                value={formData.receiver_id}
                onChange={(e) => setFormData({ ...formData, receiver_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choisir un talent...</option>
                {talents.map((talent) => (
                  <option key={talent.id} value={talent.id}>
                    {talent.full_name || talent.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du projet *
              </label>
              <input
                type="text"
                required
                value={formData.project_title}
                onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Développement d'une application mobile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du projet *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez votre projet, les objectifs, le contexte..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences recherchées
              </label>
              <input
                type="text"
                value={formData.required_skills}
                onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, Design UI/UX... (séparées par des virgules)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message personnel
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ajoutez un message personnel pour présenter votre demande..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Envoi...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Envoyer la demande</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

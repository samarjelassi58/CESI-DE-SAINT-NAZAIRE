'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Users, Inbox, Send, Check, X, Clock, MessageSquare, Plus } from 'lucide-react'

export default function CollaborationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [tab, setTab] = useState('received') // 'received' or 'sent'
  const [collaborations, setCollaborations] = useState([])

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
      await loadCollaborations(user.id)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCollaborations = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          *,
          requester:requester_id (id, full_name, email),
          receiver:receiver_id (id, full_name, email)
        `)
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCollaborations(data || [])
    } catch (error) {
      console.error('Error loading collaborations:', error)
    }
  }

  const handleStatusUpdate = async (collaborationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('collaborations')
        .update({ status: newStatus })
        .eq('id', collaborationId)

      if (error) throw error

      toast.success(
        newStatus === 'accepted' ? 'Collaboration acceptée !' :
        newStatus === 'declined' ? 'Collaboration refusée' :
        'Statut mis à jour'
      )

      await loadCollaborations(userId)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const receivedCollaborations = collaborations.filter(c => c.receiver_id === userId)
  const sentCollaborations = collaborations.filter(c => c.requester_id === userId)

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
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Collaborations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/collaborations/new"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle demande</span>
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-8 flex space-x-2">
          <button
            onClick={() => setTab('received')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition ${
              tab === 'received'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Inbox className="w-5 h-5" />
            <span>Reçues ({receivedCollaborations.length})</span>
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition ${
              tab === 'sent'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Envoyées ({sentCollaborations.length})</span>
          </button>
        </div>

        {/* Collaborations List */}
        <div className="space-y-4">
          {tab === 'received' && (
            <>
              {receivedCollaborations.length === 0 ? (
                <EmptyState message="Aucune demande de collaboration reçue" />
              ) : (
                receivedCollaborations.map((collab) => (
                  <CollaborationCard
                    key={collab.id}
                    collaboration={collab}
                    type="received"
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </>
          )}

          {tab === 'sent' && (
            <>
              {sentCollaborations.length === 0 ? (
                <EmptyState message="Aucune demande de collaboration envoyée" />
              ) : (
                sentCollaborations.map((collab) => (
                  <CollaborationCard
                    key={collab.id}
                    collaboration={collab}
                    type="sent"
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CollaborationCard({ collaboration, type, onStatusUpdate }) {
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'En attente' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: <Check className="w-4 h-4" />, label: 'Acceptée' },
      declined: { bg: 'bg-red-100', text: 'text-red-800', icon: <X className="w-4 h-4" />, label: 'Refusée' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Check className="w-4 h-4" />, label: 'Terminée' }
    }
    const badge = badges[status] || badges.pending
    return (
      <div className={`flex items-center space-x-1 ${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm`}>
        {badge.icon}
        <span>{badge.label}</span>
      </div>
    )
  }

  const partner = type === 'received' ? collaboration.requester : collaboration.receiver

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{collaboration.project_title}</h3>
            {getStatusBadge(collaboration.status)}
          </div>
          <p className="text-gray-600 text-sm">
            {type === 'received' ? 'De' : 'À'}: <span className="font-semibold">{partner?.full_name || partner?.email}</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {new Date(collaboration.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{collaboration.description}</p>

      {collaboration.required_skills && collaboration.required_skills.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Compétences recherchées :</p>
          <div className="flex flex-wrap gap-2">
            {collaboration.required_skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {collaboration.message && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 italic">"{collaboration.message}"</p>
        </div>
      )}

      {type === 'received' && collaboration.status === 'pending' && (
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onStatusUpdate(collaboration.id, 'accepted')}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Check className="w-5 h-5" />
            <span>Accepter</span>
          </button>
          <button
            onClick={() => onStatusUpdate(collaboration.id, 'declined')}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            <X className="w-5 h-5" />
            <span>Refuser</span>
          </button>
        </div>
      )}

      {collaboration.status === 'accepted' && (
        <div className="pt-4 border-t border-gray-200">
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold">
            <MessageSquare className="w-5 h-5" />
            <span>Envoyer un message</span>
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
      <Link
        href="/collaborations/new"
        className="inline-flex items-center space-x-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus className="w-5 h-5" />
        <span>Créer une demande</span>
      </Link>
    </div>
  )
}

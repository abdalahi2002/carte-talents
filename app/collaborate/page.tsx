'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { Profile, CollaborationRequest } from '@/types'
import { Send, MessageSquare, CheckCircle, XCircle, Award } from 'lucide-react'
import Avatar from '@/components/Avatar'

export default function CollaboratePage() {
  const { user, profile } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()
  
  const [profiles, setProfiles] = useState<(Profile & { skills: any[] })[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [message, setMessage] = useState('')
  const [myRequests, setMyRequests] = useState<CollaborationRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<(CollaborationRequest & { from_profile: Profile })[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadData()
  }, [user])

  const loadData = async () => {
    if (!profile) return

    try {
      setLoading(true)

      // Load all profiles except current and admins
      const { data: profilesData } = await supabase
        .from('profiles')
        .select(`
          *,
          skills (*)
        `)
        .neq('id', profile.id)
        .eq('role', 'user') // Only show students, not admins

      if (profilesData) setProfiles(profilesData)

      // Load my sent requests
      const { data: sentRequests } = await supabase
        .from('collaboration_requests')
        .select('*')
        .eq('from_profile_id', profile.id)
        .order('created_at', { ascending: false })

      if (sentRequests) setMyRequests(sentRequests)

      // Load received requests
      const { data: receivedData } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          from_profile:profiles!collaboration_requests_from_profile_id_fkey (*)
        `)
        .eq('to_profile_id', profile.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (receivedData) {
        setReceivedRequests(receivedData as any)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendRequest = async () => {
    if (!profile || !selectedProfile || !message.trim()) return

    try {
      setSending(true)
      const { error } = await supabase
        .from('collaboration_requests')
        .insert({
          from_profile_id: profile.id,
          to_profile_id: selectedProfile.id,
          message: message.trim(),
        })

      if (error) throw error

      setMessage('')
      setSelectedProfile(null)
      loadData()
    } catch (error) {
      console.error('Error sending request:', error)
      alert('Erreur lors de l\'envoi de la demande')
    } finally {
      setSending(false)
    }
  }

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('collaboration_requests')
        .update({ status })
        .eq('id', requestId)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error responding to request:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Trouver un Collaborateur
      </h1>

      {/* Received Requests */}
      {receivedRequests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Demandes Reçues ({receivedRequests.length})
          </h2>
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <div key={request.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      avatarUrl={request.from_profile?.avatar_url}
                      firstName={request.from_profile?.first_name || ''}
                      lastName={request.from_profile?.last_name || ''}
                      size="sm"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {request.from_profile?.first_name} {request.from_profile?.last_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 mt-2">{request.message}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => respondToRequest(request.id, 'accepted')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Accepter</span>
                  </button>
                  <button
                    onClick={() => respondToRequest(request.id, 'rejected')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Request Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Envoyer une Demande de Collaboration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sélectionner un profil
            </label>
            <select
              value={selectedProfile?.id || ''}
              onChange={(e) => {
                const profile = profiles.find(p => p.id === e.target.value)
                setSelectedProfile(profile || null)
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Choisir un profil...</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} {p.verified && '✓ Verified'}
                </option>
              ))}
            </select>
          </div>
          {selectedProfile && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar
                  avatarUrl={selectedProfile.avatar_url}
                  firstName={selectedProfile.first_name}
                  lastName={selectedProfile.last_name}
                  size="md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {selectedProfile.first_name} {selectedProfile.last_name}
                    {selectedProfile.verified && (
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProfile.email}</p>
                </div>
              </div>
              {selectedProfile.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selectedProfile.bio}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Expliquez votre projet ou votre besoin de collaboration..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={sendRequest}
            disabled={!selectedProfile || !message.trim() || sending}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>{sending ? 'Envoi...' : 'Envoyer la demande'}</span>
          </button>
        </div>
      </div>

      {/* My Sent Requests */}
      {myRequests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Mes Demandes Envoyées ({myRequests.length})
          </h2>
          <div className="space-y-4">
            {myRequests.map((request) => {
              const statusColors = {
                pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
                accepted: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
                rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
              }
              return (
                <div key={request.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
                      {request.status === 'pending' && 'En attente'}
                      {request.status === 'accepted' && 'Acceptée'}
                      {request.status === 'rejected' && 'Refusée'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{request.message}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Profiles */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Profils Disponibles ({profiles.length})
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedProfile(p)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Avatar
                  avatarUrl={p.avatar_url}
                  firstName={p.first_name}
                  lastName={p.last_name}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {p.first_name} {p.last_name}
                    {p.verified && <Award className="h-4 w-4 text-yellow-500" />}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{p.email}</p>
                </div>
              </div>
              {p.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{p.bio}</p>
              )}
              {p.skills && p.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map(skill => (
                    <span key={skill.id} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


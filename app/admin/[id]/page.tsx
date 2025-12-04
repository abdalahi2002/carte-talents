'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { Profile, Skill, Language, Project, SkillLevel } from '@/types'
import { ArrowLeft, Save, Award, Mail, User, Briefcase, Globe, Github, Edit2, X } from 'lucide-react'
import Avatar from '@/components/Avatar'

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuthStore()
  const supabase = createClient()
  const studentId = params.id as string

  const [student, setStudent] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editedLevels, setEditedLevels] = useState<Record<string, SkillLevel>>({})

  useEffect(() => {
    if (!user || !profile) {
      router.push('/auth/login')
      return
    }

    if (profile.role !== 'admin') {
      router.push('/')
      return
    }

    loadStudentData()
  }, [user, profile, studentId])

  const loadStudentData = async () => {
    try {
      setLoading(true)

      // Load student profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .single()

      if (profileError) throw profileError
      if (!profileData) return

      setStudent(profileData)

      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('profile_id', studentId)
        .order('created_at', { ascending: false })

      if (skillsData) {
        setSkills(skillsData)
        const initialLevels: Record<string, SkillLevel> = {}
        skillsData.forEach(skill => {
          initialLevels[skill.id] = skill.level
        })
        setEditedLevels(initialLevels)
      }

      // Load languages
      const { data: languagesData } = await supabase
        .from('languages')
        .select('*')
        .eq('profile_id', studentId)
        .order('created_at', { ascending: false })

      if (languagesData) setLanguages(languagesData)

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', studentId)
        .order('created_at', { ascending: false })

      if (projectsData) setProjects(projectsData)
    } catch (error) {
      console.error('Error loading student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSkillLevel = async (skillId: string, newLevel: SkillLevel) => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('skills')
        .update({ level: newLevel })
        .eq('id', skillId)

      if (error) throw error

      setSkills(prev => prev.map(s => s.id === skillId ? { ...s, level: newLevel } : s))
      setEditingSkill(null)
    } catch (error) {
      console.error('Error updating skill level:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const toggleVerification = async () => {
    if (!student) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update({
          verified: !student.verified,
          verified_by: !student.verified ? user?.id : null,
          verified_at: !student.verified ? new Date().toISOString() : null,
        })
        .eq('id', student.id)

      if (error) throw error
      setStudent({ ...student, verified: !student.verified })
    } catch (error) {
      console.error('Error toggling verification:', error)
      alert('Erreur lors de la modification')
    } finally {
      setSaving(false)
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

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Étudiant non trouvé</p>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour à la liste</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <Avatar
                avatarUrl={student.avatar_url}
                firstName={student.first_name}
                lastName={student.last_name}
                size="lg"
              />
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {student.first_name} {student.last_name}
                  </h1>
                  {student.verified && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-semibold">
                      <Award className="h-4 w-4 mr-1" />
                      Talent Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>
                </div>
                {student.bio && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300">{student.bio}</p>
                )}
              </div>
            </div>
            <button
              onClick={toggleVerification}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                student.verified
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
              } disabled:opacity-50`}
            >
              {student.verified ? 'Retirer la vérification' : 'Vérifier le talent'}
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Compétences ({skills.length})
        </h2>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {skill.category}
                  </span>
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{skill.description}</p>
                )}
                {editingSkill === skill.id ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={editedLevels[skill.id] || skill.level}
                      onChange={(e) => setEditedLevels({ ...editedLevels, [skill.id]: e.target.value as SkillLevel })}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="débutant">Débutant</option>
                      <option value="intermédiaire">Intermédiaire</option>
                      <option value="avancé">Avancé</option>
                      <option value="expert">Expert</option>
                    </select>
                    <button
                      onClick={() => updateSkillLevel(skill.id, editedLevels[skill.id] || skill.level)}
                      disabled={saving}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1"
                    >
                      <Save className="h-4 w-4" />
                      <span>Enregistrer</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingSkill(null)
                        setEditedLevels({ ...editedLevels, [skill.id]: skill.level })
                      }}
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Niveau actuel: <span className="font-medium">{skill.level}</span>
                    </span>
                    <button
                      onClick={() => setEditingSkill(skill.id)}
                      className="ml-2 px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex items-center space-x-1 text-sm"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Modifier</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune compétence</p>
          )}
        </div>
      </div>

      {/* Languages Section */}
      {languages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Langues ({languages.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {languages.map((language) => (
              <div key={language.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{language.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Niveau: {language.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Projets ({projects.length})
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-4">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Voir le projet</span>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:underline text-sm"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


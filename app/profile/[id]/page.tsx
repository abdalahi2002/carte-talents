'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile, Skill, Language, Project } from '@/types'
import { Award, Mail, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import Avatar from '@/components/Avatar'

export default function PublicProfilePage() {
  const params = useParams()
  const profileId = params.id as string
  const supabase = createClient()
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profileId) {
      loadProfile()
    }
  }, [profileId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (profileError) throw profileError
      if (!profileData) return

      setProfile(profileData)

      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (skillsData) setSkills(skillsData)

      // Load languages
      const { data: languagesData } = await supabase
        .from('languages')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (languagesData) setLanguages(languagesData)

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (projectsData) setProjects(projectsData)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Profil non trouvé</p>
          <Link href="/search" className="mt-4 text-blue-600 hover:underline">
            Retour à la recherche
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          <Avatar
            avatarUrl={profile.avatar_url}
            firstName={profile.first_name}
            lastName={profile.last_name}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.verified && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-semibold">Talent Verified</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.email}</p>
            {profile.bio && (
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Compétences ({skills.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {skill.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Niveau: <span className="font-medium">{skill.level}</span>
                </p>
                {skill.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">{skill.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages Section */}
      {languages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Langues ({languages.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {languages.map((language) => (
              <div key={language.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {language.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Niveau: <span className="font-medium">{language.level}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Projets ({projects.length})
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
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
                      <ExternalLink className="h-4 w-4" />
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

      <div className="mt-6">
        <Link
          href="/collaborate"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Contacter pour collaboration
        </Link>
      </div>
    </div>
  )
}


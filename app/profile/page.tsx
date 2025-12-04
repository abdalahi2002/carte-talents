'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { Profile, Skill, Language, Project, SkillCategory, SkillLevel, LanguageLevel } from '@/types'
import { Plus, X, Save, Award, CheckCircle } from 'lucide-react'
import { validateName, validateURL } from '@/lib/validation'
import AvatarUpload from '@/components/AvatarUpload'
import Avatar from '@/components/Avatar'

export default function ProfilePage() {
  const { user, profile, loading: authLoading, fetchProfile } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()
  
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form states
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [showLanguageForm, setShowLanguageForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  
  const [newSkill, setNewSkill] = useState({ name: '', category: 'technique' as SkillCategory, level: 'intermédiaire' as SkillLevel, description: '' })
  const [newLanguage, setNewLanguage] = useState({ name: '', level: 'B2' as LanguageLevel })
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', url: '', github_url: '' })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
    
    if (user && profile) {
      loadProfileData()
    }
  }, [user, profile, authLoading])

  const loadProfileData = async () => {
    if (!profile) return
    
    try {
      setLoading(true)
      
      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
      
      if (skillsData) setSkills(skillsData)
      
      // Load languages
      const { data: languagesData } = await supabase
        .from('languages')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
      
      if (languagesData) setLanguages(languagesData)
      
      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
      
      if (projectsData) setProjects(projectsData)
      
      setProfileData(profile)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!profile || !profileData) return
    
    // Validation
    if (!validateName(profileData.first_name)) {
      alert('Le prénom doit contenir entre 2 et 50 caractères')
      return
    }
    
    if (!validateName(profileData.last_name)) {
      alert('Le nom doit contenir entre 2 et 50 caractères')
      return
    }
    
    if (profileData.bio && profileData.bio.length > 500) {
      alert('La bio ne doit pas dépasser 500 caractères')
      return
    }
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name.trim(),
          last_name: profileData.last_name.trim(),
          bio: profileData.bio?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
      
      if (error) throw error
      await fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    if (!profile) return
    
    // Validation
    if (!newSkill.name.trim()) {
      alert('Le nom de la compétence est requis')
      return
    }
    
    if (newSkill.name.length > 100) {
      alert('Le nom de la compétence ne doit pas dépasser 100 caractères')
      return
    }
    
    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          profile_id: profile.id,
          name: newSkill.name.trim(),
          category: newSkill.category,
          level: newSkill.level,
          description: newSkill.description?.trim() || null,
        })
      
      if (error) throw error
      
      setNewSkill({ name: '', category: 'technique', level: 'intermédiaire', description: '' })
      setShowSkillForm(false)
      loadProfileData()
    } catch (error) {
      console.error('Error adding skill:', error)
      alert('Erreur lors de l\'ajout de la compétence')
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      loadProfileData()
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const addLanguage = async () => {
    if (!profile) return
    
    // Validation
    if (!newLanguage.name.trim()) {
      alert('Le nom de la langue est requis')
      return
    }
    
    if (newLanguage.name.length > 50) {
      alert('Le nom de la langue ne doit pas dépasser 50 caractères')
      return
    }
    
    try {
      const { error } = await supabase
        .from('languages')
        .insert({
          profile_id: profile.id,
          name: newLanguage.name.trim(),
          level: newLanguage.level,
        })
      
      if (error) throw error
      
      setNewLanguage({ name: '', level: 'B2' })
      setShowLanguageForm(false)
      loadProfileData()
    } catch (error) {
      console.error('Error adding language:', error)
      alert('Erreur lors de l\'ajout de la langue')
    }
  }

  const deleteLanguage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      loadProfileData()
    } catch (error) {
      console.error('Error deleting language:', error)
    }
  }

  const addProject = async () => {
    if (!profile) return
    
    // Validation
    if (!newProject.title.trim()) {
      alert('Le titre du projet est requis')
      return
    }
    
    if (newProject.title.length > 200) {
      alert('Le titre ne doit pas dépasser 200 caractères')
      return
    }
    
    if (!newProject.description.trim()) {
      alert('La description du projet est requise')
      return
    }
    
    if (newProject.description.length > 1000) {
      alert('La description ne doit pas dépasser 1000 caractères')
      return
    }
    
    if (newProject.url && !validateURL(newProject.url)) {
      alert('L\'URL du projet n\'est pas valide')
      return
    }
    
    if (newProject.github_url && !validateURL(newProject.github_url)) {
      alert('L\'URL GitHub n\'est pas valide')
      return
    }
    
    try {
      const technologies = newProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
      
      const { error } = await supabase
        .from('projects')
        .insert({
          profile_id: profile.id,
          title: newProject.title.trim(),
          description: newProject.description.trim(),
          technologies: technologies.length > 0 ? technologies : null,
          url: newProject.url?.trim() || null,
          github_url: newProject.github_url?.trim() || null,
        })
      
      if (error) throw error
      
      setNewProject({ title: '', description: '', technologies: '', url: '', github_url: '' })
      setShowProjectForm(false)
      loadProfileData()
    } catch (error) {
      console.error('Error adding project:', error)
      alert('Erreur lors de l\'ajout du projet')
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      loadProfileData()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-6">
            <AvatarUpload
              currentAvatarUrl={profileData?.avatar_url}
              userId={user?.id || ''}
              onUploadComplete={async (url) => {
                if (profileData) {
                  setProfileData({ ...profileData, avatar_url: url || undefined })
                  // Update in database
                  await supabase
                    .from('profiles')
                    .update({ avatar_url: url || null })
                    .eq('id', profile?.id)
                  await fetchProfile()
                }
              }}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                {profileData?.first_name} {profileData?.last_name}
                {profileData?.verified && (
                  <span title="Talent Verified">
                    <Award className="h-6 w-6 text-yellow-500" />
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{profileData?.email}</p>
            </div>
          </div>
          <button
            onClick={updateProfile}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={profileData?.first_name || ''}
              onChange={(e) => setProfileData({ ...profileData!, first_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={profileData?.last_name || ''}
              onChange={(e) => setProfileData({ ...profileData!, last_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profileData?.bio || ''}
              onChange={(e) => setProfileData({ ...profileData!, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Parlez-nous de vous..."
            />
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compétences</h2>
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {showSkillForm && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="React, Python, Design..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as SkillCategory })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="technique">Technique</option>
                  <option value="linguistique">Linguistique</option>
                  <option value="projet">Projet</option>
                  <option value="passion">Passion</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niveau
                </label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as SkillLevel })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Description optionnelle"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowSkillForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.category} • {skill.level}
                </p>
                {skill.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{skill.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteSkill(skill.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Langues</h2>
          <button
            onClick={() => setShowLanguageForm(!showLanguageForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {showLanguageForm && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langue
                </label>
                <input
                  type="text"
                  value={newLanguage.name}
                  onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Anglais, Espagnol..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niveau
                </label>
                <select
                  value={newLanguage.level}
                  onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value as LanguageLevel })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="natif">Natif</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addLanguage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowLanguageForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {languages.map((language) => (
            <div key={language.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{language.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Niveau: {language.level}</p>
              </div>
              <button
                onClick={() => deleteLanguage(language.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projets</h2>
          <button
            onClick={() => setShowProjectForm(!showProjectForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {showProjectForm && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Mon super projet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Description du projet..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={newProject.url}
                  onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={newProject.github_url}
                onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addProject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowProjectForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-4">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        Voir le projet
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:underline text-sm">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-600 hover:text-red-700 ml-4"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


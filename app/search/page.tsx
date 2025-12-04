'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Skill, Language, Project, SearchFilters } from '@/types'
import Link from 'next/link'
import { Search, Award, Filter, X } from 'lucide-react'
import Avatar from '@/components/Avatar'

export default function SearchPage() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<(Profile & { skills: Skill[], languages: Language[], projects: Project[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [allSkills, setAllSkills] = useState<string[]>([])
  const [allLanguages, setAllLanguages] = useState<string[]>([])

  useEffect(() => {
    loadAllOptions()
    searchProfiles()
  }, [])

  useEffect(() => {
    searchProfiles()
  }, [filters, searchTerm])

  const loadAllOptions = async () => {
    try {
      const { data: skillsData } = await supabase
        .from('skills')
        .select('name')
      
      if (skillsData) {
        const uniqueSkills = [...new Set(skillsData.map(s => s.name))]
        setAllSkills(uniqueSkills.sort())
      }

      const { data: languagesData } = await supabase
        .from('languages')
        .select('name')
      
      if (languagesData) {
        const uniqueLanguages = [...new Set(languagesData.map(l => l.name))]
        setAllLanguages(uniqueLanguages.sort())
      }
    } catch (error) {
      console.error('Error loading options:', error)
    }
  }

  const searchProfiles = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('profiles')
        .select(`
          *,
          skills (*),
          languages (*),
          projects (*)
        `)
        .eq('role', 'user') // Only show students, not admins

      // Apply search term
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
      }

      // Apply verified filter
      if (filters.verified !== undefined) {
        query = query.eq('verified', filters.verified)
      }

      const { data, error } = await query

      if (error) throw error

      if (!data) {
        setProfiles([])
        setLoading(false)
        return
      }

      // Filter by skills
      let filtered = data
      if (filters.skills && filters.skills.length > 0) {
        filtered = filtered.filter(profile => 
          profile.skills.some((skill: Skill) => filters.skills!.includes(skill.name))
        )
      }

      // Filter by languages
      if (filters.languages && filters.languages.length > 0) {
        filtered = filtered.filter(profile => 
          profile.languages.some((lang: Language) => filters.languages!.includes(lang.name))
        )
      }

      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(profile => 
          profile.skills.some((skill: Skill) => filters.categories!.includes(skill.category))
        )
      }

      setProfiles(filtered)
    } catch (error) {
      console.error('Error searching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFilter = (type: 'skills' | 'languages' | 'categories', value: string) => {
    setFilters(prev => {
      const current = prev[type] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [type]: updated.length > 0 ? updated : undefined }
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Recherche de Talents
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, bio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </button>
          {(filters.skills?.length || filters.languages?.length || filters.categories?.length || filters.verified !== undefined || searchTerm) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <X className="h-5 w-5" />
              <span>Effacer</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compétences
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {allSkills.map(skill => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.skills?.includes(skill) || false}
                        onChange={() => toggleFilter('skills', skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langues
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {allLanguages.map(lang => (
                    <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.languages?.includes(lang) || false}
                        onChange={() => toggleFilter('languages', lang)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégories
                </label>
                <div className="space-y-2">
                  {['technique', 'linguistique', 'projet', 'passion', 'autre'].map(cat => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories?.includes(cat as any) || false}
                        onChange={() => toggleFilter('categories', cat)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified === true}
                      onChange={(e) => setFilters({ ...filters, verified: e.target.checked ? true : undefined })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Talent Verified uniquement</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Recherche en cours...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Avatar
                  avatarUrl={profile.avatar_url}
                  firstName={profile.first_name}
                  lastName={profile.last_name}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {profile.first_name} {profile.last_name}
                    {profile.verified && (
                      <span title="Talent Verified">
                        <Award className="h-5 w-5 text-yellow-500" />
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
                </div>
              </div>
              {profile.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {profile.bio}
                </p>
              )}
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Compétences ({profile.skills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 3).map(skill => (
                      <span key={skill.id} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {skill.name}
                      </span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                        +{profile.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                {profile.languages.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Langues ({profile.languages.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {profile.languages.map(lang => (
                        <span key={lang.id} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                          {lang.name} ({lang.level})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && profiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Aucun profil trouvé</p>
        </div>
      )}
    </div>
  )
}


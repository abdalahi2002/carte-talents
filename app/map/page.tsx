'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Skill } from '@/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function MapPage() {
  const supabase = createClient()
  const [skillData, setSkillData] = useState<{ name: string; value: number; category: string }[]>([])
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([])
  const [levelData, setLevelData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: skills, error } = await supabase
        .from('skills')
        .select('*')

      if (error) throw error

      if (!skills) {
        setLoading(false)
        return
      }

      // Count skills by name
      const skillCounts: Record<string, number> = {}
      const categoryCounts: Record<string, number> = {}
      const levelCounts: Record<string, number> = {}

      skills.forEach(skill => {
        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1
        categoryCounts[skill.category] = (categoryCounts[skill.category] || 0) + 1
        levelCounts[skill.level] = (levelCounts[skill.level] || 0) + 1
      })

      // Convert to array and sort
      const skillArray = Object.entries(skillCounts)
        .map(([name, value]) => {
          const skill = skills.find(s => s.name === name)
          return { name, value, category: skill?.category || 'autre' }
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 20)

      const categoryArray = Object.entries(categoryCounts)
        .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
        .sort((a, b) => b.value - a.value)

      const levelArray = Object.entries(levelCounts)
        .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
        .sort((a, b) => b.value - a.value)

      setSkillData(skillArray)
      setCategoryData(categoryArray)
      setLevelData(levelArray)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Carte Interactive des Talents
      </h1>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Top 20 Compétences
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={skillData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Répartition par Catégorie
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Levels Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Répartition par Niveau
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={levelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skills Cloud (Text-based) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Nuage de Compétences
        </h2>
        <div className="flex flex-wrap gap-3">
          {skillData.map((skill, index) => {
            const size = Math.max(12, Math.min(24, 12 + (skill.value * 2)))
            return (
              <span
                key={skill.name}
                className="px-3 py-1 rounded-full text-white"
                style={{
                  fontSize: `${size}px`,
                  backgroundColor: COLORS[index % COLORS.length],
                  opacity: 0.8 + (skill.value / 10) * 0.2,
                }}
              >
                {skill.name} ({skill.value})
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}


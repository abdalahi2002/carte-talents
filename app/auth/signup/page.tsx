'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { validateEmail, validatePassword, validateName } from '@/lib/validation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPasswordErrors([])

    // Validation
    if (!validateName(firstName)) {
      setError('Le prénom doit contenir entre 2 et 50 caractères')
      return
    }

    if (!validateName(lastName)) {
      setError('Le nom doit contenir entre 2 et 50 caractères')
      return
    }

    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setPasswordErrors(passwordValidation.errors)
      setError('Le mot de passe ne respecte pas les critères requis')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) throw error

      router.push('/profile')
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (value.length > 0) {
      setShowPasswordRequirements(true)
      const validation = validatePassword(value)
      setPasswordErrors(validation.errors)
    } else {
      setShowPasswordRequirements(false)
      setPasswordErrors([])
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ou{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              connectez-vous
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prénom
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                    passwordErrors.length > 0 && password.length > 0
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : password.length > 0 && passwordErrors.length === 0
                      ? 'border-green-300 dark:border-green-700 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Le mot de passe doit contenir :
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center space-x-1 ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {password.length >= 8 ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Au moins 8 caractères</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {/[A-Z]/.test(password) ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Une majuscule</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {/[a-z]/.test(password) ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Une minuscule</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {/[0-9]/.test(password) ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Un chiffre</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Un caractère spécial</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? 'Création...' : 'Créer un compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
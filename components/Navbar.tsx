'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { User, LogOut, Search, Map, Users, Award, Shield, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, profile, signOut } = useAuthStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
    router.push('/')
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <Map className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Carte des Talents
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/search"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Recherche</span>
            </Link>
            <Link
              href="/map"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Map className="h-4 w-4" />
              <span>Carte</span>
            </Link>
            <Link
              href="/collaborate"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Collaborer</span>
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{profile?.first_name || 'Profil'}</span>
                  {profile?.verified && (
                    <span title="Talent Verified">
                      <Award className="h-4 w-4 text-yellow-500" />
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/search"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Recherche</span>
            </Link>
            <Link
              href="/map"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              <Map className="h-5 w-5" />
              <span>Carte</span>
            </Link>
            <Link
              href="/collaborate"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Collaborer</span>
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{profile?.first_name || 'Profil'}</span>
                  {profile?.verified && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 w-full text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <Link
                  href="/auth/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base font-medium transition-colors"
                >
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Vérifier que les variables d'environnement sont définies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Si les variables ne sont pas définies, retourner une réponse d'erreur pour les routes API
    // mais permettre la navigation pour afficher un message d'erreur
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Variables d\'environnement Supabase non configurées. Veuillez créer un fichier .env.local avec NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      )
    }
    // Pour les autres routes, continuer normalement (l'erreur sera gérée côté client)
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Routes d'authentification que les utilisateurs connectés ne peuvent pas accéder
  const authRoutes = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/forgot-password']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'authentification
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ['/profile', '/admin', '/collaborate']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
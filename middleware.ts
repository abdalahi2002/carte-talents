import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Vérifier que les variables d'environnement sont définies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_AB
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_AB

  if (!supabaseUrl || !supabaseAnonKey) {
    // Si les variables ne sont pas définies, retourner une réponse d'erreur pour les routes API
    // mais permettre la navigation pour afficher un message d'erreur
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Variables d\'environnement Supabase non configurées. Veuillez créer un fichier .env.local avec NEXT_PUBLIC_SUPABASE_URL_AB et NEXT_PUBLIC_SUPABASE_ANON_KEY_AB' },
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

  await supabase.auth.getUser()

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


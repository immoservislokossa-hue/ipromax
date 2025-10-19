'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client' // ✅ Nouveau import correct
import Sidebar from '@/components/admin/Sidebar'

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ Crée une instance Supabase côté client
  const supabase = createClient()

  useEffect(() => {
    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      // 🚫 Pas de session → redirection vers /login
      if (!session) {
        router.replace('/login')
        return
      }

      // 🔒 Si tu veux limiter à l’admin seulement :
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (adminEmail && session.user.email !== adminEmail) {
        await supabase.auth.signOut()
        router.replace('/login')
        return
      }

      setLoading(false)
    }

    verifySession()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-700">
        Chargement du tableau de bord...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block md:hidden p-2 bg-blue-700 rounded hover:bg-blue-800"
            >
              ☰
            </button>
            <h1 className="font-bold text-xl">Epropulse Player</h1>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Se déconnecter
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

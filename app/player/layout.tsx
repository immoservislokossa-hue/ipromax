'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* ✅ Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* ✅ Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* 🔹 Header */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block md:hidden p-2 bg-blue-700 rounded hover:bg-blue-800"
            >
              ☰
            </button>
            <h1 className="font-bold text-xl">Propulser Admin</h1>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Se déconnecter
          </button>
        </header>

        {/* 🔹 Contenu dynamique */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

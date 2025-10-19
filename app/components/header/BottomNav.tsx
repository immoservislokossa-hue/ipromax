'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, BookOpen, Wrench } from 'lucide-react';

interface NavigationItem {
  id: string;
  icon: React.ForwardRefExoticComponent<any>;
  label: string;
  href: string;
  badge?: number;
}

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const getActiveTab = () => {
    if (pathname.startsWith('/produits')) return 'boutique';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname.startsWith('/services')) return 'services';
    if (pathname === '/') return 'home';
    return null;
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setMounted(true);
    setActiveTab(getActiveTab());
  }, [pathname]);

  const navigationItems: NavigationItem[] = [
    { id: 'home', icon: Home, label: 'Accueil', href: '/' },
    { id: 'boutique', icon: ShoppingBag, label: 'Boutique', href: '/produits' },
    { id: 'blog', icon: BookOpen, label: 'Blog', href: '/blog' },
    { id: 'services', icon: Wrench, label: 'Services', href: '/services' },
  ];

  const handleNavigation = (href: string) => router.push(href);

  return (
    <div 
      className="fixed bottom-4 left-0 right-0 z-50 flex justify-center md:hidden w-full max-w-[100vw] overflow-x-hidden"
    >
      <div
        className={`relative bg-black/90 backdrop-blur-xl border border-blue-400/10 shadow-lg shadow-blue-900/20 rounded-2xl p-2 flex items-center justify-between w-[94%] sm:w-[90%] max-w-md mx-auto transition-all duration-500
          ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
        `}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={`relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ease-out min-w-[60px]
                ${isActive
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-800/40 scale-110'
                  : 'text-blue-100/80 hover:text-white hover:scale-105 hover:bg-blue-500/10'}
              `}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={22}
                  className={`transition-transform duration-300 ${
                    isActive
                      ? 'animate-pulse drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      : 'group-hover:rotate-12'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold border border-white/30 shadow-md">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-medium tracking-wide ${
                  isActive ? 'text-white' : 'text-blue-100/70'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_6px_rgba(96,165,250,0.9)] animate-bounce" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

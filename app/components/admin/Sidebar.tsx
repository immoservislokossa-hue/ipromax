'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaPenFancy, FaShoppingBag } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/player', label: 'Dashboard', icon: <FaHome /> },
    { href: '/player/blog', label: 'Articles', icon: <FaPenFancy /> },
  { href: '/player/produits', label: 'Produits', icon: <FaShoppingBag /> },
  ];

  return (
    <>
      {/* ✅ Overlay mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <div className="p-4 text-center border-b font-bold text-blue-600">
          🧭 Propulser Admin
        </div>

        <nav className="mt-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition 
                ${
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700'
                }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

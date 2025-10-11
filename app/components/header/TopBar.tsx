'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        relative md:fixed md:top-0 md:left-0 md:right-0 z-50
        transition-all duration-300
        ${scrolled ? 'backdrop-blur-xl bg-white/90 shadow-md' : 'bg-transparent backdrop-blur-md'}
      `}
    >
      <div className="w-[95%] md:w-[80%] mx-auto bg-[#F2F2FF]/90 md:rounded-b-2xl md:shadow-md overflow-hidden">
        {/* Promo bar */}
        <div className="bg-[#FF6F00]/10 text-[#FF6F00] text-center text-xs py-2">
           Propulsez-vous avec Propulser!
        </div>

        {/* Contenu principal */}
        <div
          className="
            flex flex-col md:flex-row 
            items-center justify-center md:justify-between 
            px-4 md:px-8 py-3
            text-center
          "
        >
          {/* Logo centré */}
          <div className="flex justify-center w-full md:w-auto mb-2 md:mb-0">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/propulser-logo.svg"
                alt="Propulser"
                width={130}
                height={50}
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Menu */}
          <nav className="hidden md:flex gap-10 justify-center flex-1">
            <Link
              href="/products"
              className="text-[#0F23E8] hover:text-[#0A1ACF] font-medium transition-colors"
            >
              Produits
            </Link>
            <Link
              href="/blog"
              className="text-[#0F23E8] hover:text-[#0A1ACF] font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/services"
              className="text-[#0F23E8] hover:text-[#0A1ACF] font-medium transition-colors"
            >
              Services
            </Link>
          </nav>

          {/* Bouton contact */}
          <Link
            href="/contact"
            className="hidden md:inline-block bg-[#0F23E8] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#0A1ACF] transition-all shadow-md"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

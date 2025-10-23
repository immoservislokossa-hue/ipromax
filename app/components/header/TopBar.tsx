'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 10);

      // Cache la barre sur mobile uniquement
      if (window.innerWidth < 768) {
        if (currentScroll > lastScrollY && currentScroll > 50) {
          // Scrolling vers le bas → cacher
          setHidden(true);
        } else {
          // Scrolling vers le haut → montrer
          setHidden(false);
        }
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 w-full
          transition-all duration-300 ease-in-out
          ${scrolled
            ? 'backdrop-blur-xl bg-white/90 shadow-md'
            : 'bg-transparent backdrop-blur-md'}
          ${hidden ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className="w-full md:w-[80%] mx-auto bg-[#F8F9FF]/95 md:rounded-b-3xl shadow-sm overflow-hidden">
          {/* 🔹 Barre promo */}
          <div className="bg-blue-600 text-white text-center text-[12px] font-medium tracking-wide py-2.5 md:py-3">
            Propulsez-vous avec <span className="font-semibold">EPropulse</span> !
          </div>

          {/* 🔹 Contenu principal */}
          <div
            className="
              flex flex-col md:flex-row items-center 
              justify-between px-6 md:px-10 py-3 md:py-5
              text-center md:text-left
            "
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start w-full md:w-auto"
            >
              <Image
                src="/propulser-logo.svg"
                alt="Propulser"
                width={160}
                height={50}
                className="h-8 md:h-11 w-auto object-contain transition-all duration-300"
              />
            </Link>

            {/* Menu */}
            <nav className="hidden md:flex gap-14 text-[#0F23E8] font-medium tracking-wide">
              <Link href="/produits" className="hover:text-[#0A1ACF] transition-colors duration-300">
                Produits
              </Link>
              <Link href="/blog" className="hover:text-[#0A1ACF] transition-colors duration-300">
                Blog
              </Link>
              <Link href="/services" className="hover:text-[#0A1ACF] transition-colors duration-300">
                Services
              </Link>
            </nav>

            {/* Bouton Contact */}
            <Link
              href="/contact"
              className="
                hidden md:inline-block 
                bg-[#0F23E8] text-white text-sm font-medium 
                px-8 py-2.5 rounded-xl 
                shadow-md hover:bg-[#0A1ACF] hover:shadow-lg 
                transition-all duration-300
              "
            >
              Contact
            </Link>
          </div>
        </div>
      </header>

      {/* 🪄 Espace entre le TopBar et le contenu principal */}
      <div className="h-[80px] md:h-[100px]" />
    </>
  );
}

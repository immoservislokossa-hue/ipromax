'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Slide {
  imageDesktop: string;
  imageMobile: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    imageDesktop: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    imageMobile: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'Blog Propulser - Ressources et articles',
    title: 'Explorez nos articles',
    subtitle: 'Découvrez, apprenez, évoluez',
    description: 'Une collection d\'articles, de guides et de ressources pour vous aider à développer vos compétences et réussir dans votre parcours professionnel.',
    ctaText: 'Découvrir les articles',
    ctaHref: '/blog',
  },
  {
    imageDesktop: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    imageMobile: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    alt: 'Tutoriels et guides pratiques',
    title: 'Guides pratiques',
    subtitle: 'Apprenez par la pratique',
    description: 'Des tutoriels détaillés et des guides pratiques pour maîtriser de nouvelles compétences et techniques.',
    ctaText: 'Voir les guides',
    ctaHref: '/blog',
  }
];

export default function BlogBannerHero() {
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = slides.flatMap(slide => [slide.imageDesktop, slide.imageMobile]);
      
      imageUrls.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoading(false);
      });
    };

    preloadImages();
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden px-4" aria-label="Bannière Blog Propulser">
      <div className="w-full md:w-[80%] mx-auto">
        <div className="relative w-full aspect-[6/3.5] md:aspect-[16/6] rounded-3xl overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl z-30" />
          )}
          
          <picture>
            <source media="(min-width: 768px)" srcSet={slide.imageDesktop} />
            <img
              src={slide.imageMobile}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-500"
              onLoad={() => setIsLoading(false)}
              loading="eager"
            />
          </picture>

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 rounded-3xl" />

          <div className="flex flex-col justify-center z-20 absolute inset-0 px-6 md:px-8 lg:px-16 max-w-5xl">
            <motion.h1
              key={`${slide.title}-desktop`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-2xl"
            >
              {slide.title}
            </motion.h1>
            <motion.h2
              key={`${slide.subtitle}-desktop`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl mt-2 text-white/90 drop-shadow-lg"
            >
              {slide.subtitle}
            </motion.h2>
            <motion.p
              key={`${slide.description}-desktop`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-base lg:text-lg mt-4 max-w-2xl text-white/80 drop-shadow hidden md:block"
            >
              {slide.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-4 md:mt-6"
            >
              <Link
                href={slide.ctaHref}
                className="inline-block bg-[#0F23E8] text-white px-6 md:px-8 py-2 md:py-3 rounded-xl text-sm md:text-lg font-semibold hover:bg-[#0A1ACF] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {slide.ctaText}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 border-2 border-white ${
              current === i ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Aller au slide ${i + 1}`}
            aria-current={current === i ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  );
}
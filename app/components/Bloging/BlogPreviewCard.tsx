'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';

interface BlogPreviewCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  cover_image?: string;
  published_at: string;
  category_name: string;
  author_name?: string;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/34123134/pexels-photo-34123134.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";

const BlogPreviewCard: React.FC<BlogPreviewCardProps> = ({
  slug,
  title,
  excerpt,
  cover_image,
  published_at,
  category_name,
  author_name,
}) => {
  if (!slug) return null;

  const href = `/blog/${slug}`;
  const [imageError, setImageError] = useState(false);

  // 🔹 Gestion automatique du fallback
  const getImageSrc = () => {
    if (imageError || !cover_image || cover_image.trim() === "") return FALLBACK_IMAGE;
    if (cover_image.startsWith("http")) return cover_image;
    return FALLBACK_IMAGE;
  };

  const formattedDate = new Date(published_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 border border-gray-100">
      {/* 💫 Lueur bleue au survol */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      {/* --- IMAGE --- */}
      <Link href={href} className="relative h-64 w-full block overflow-hidden">
        <Image
          src={getImageSrc()}
          alt={title}
          fill
          onError={() => setImageError(true)}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />

        {/* Overlay bleu */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Catégorie */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/20 shadow-sm">
            {category_name}
          </span>
        </div>

        {/* Date */}
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-light">
          {formattedDate}
        </div>
      </Link>

      {/* --- CONTENU --- */}
      <div className="relative p-6 flex flex-col flex-1 z-10 bg-white">
        {/* Titre */}
        <h2 className="text-lg font-semibold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
          <Link href={href} className="relative inline-block">
            {title}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
        </h2>

        {/* Extrait */}
        {excerpt && (
          <p className="text-gray-600 font-light leading-relaxed mb-3 line-clamp-3 text-sm">
            {excerpt}
          </p>
        )}

        {/* Auteur */}
        {author_name && (
          <div className="flex items-center text-gray-500 text-xs mb-4 font-light">
            <svg
              className="w-4 h-4 mr-1 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Par {author_name}
          </div>
        )}

        {/* Ligne décorative */}
        <div className="w-12 h-px bg-gradient-to-r from-blue-400 to-transparent mb-4" />

        {/* CTA Bleu luxueux */}
        <Link
          href={href}
          className="mt-auto group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl text-sm font-medium text-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          <span className="relative flex items-center justify-center">
            Lire l’article
            <svg
              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>
      </div>

      {/* Bordure subtile au survol */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/40 transition-all duration-500 pointer-events-none" />
    </article>
  );
};

export default BlogPreviewCard;

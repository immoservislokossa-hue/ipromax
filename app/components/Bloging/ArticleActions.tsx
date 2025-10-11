"use client";
import React from 'react';

export default function ArticleActions({ title, excerpt }: { title: string; excerpt?: string }) {
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if ((navigator as any).share) {
      (navigator as any).share({
        title,
        text: excerpt || '',
        url,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Lien copié dans le presse-papier !');
      });
    }
  };

  const handleBookmark = () => {
    // Minimal client-side bookmark behaviour (could post to API)
    alert('Article ajouté aux favoris !');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleBookmark}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Ajouter aux favoris"
      >
        {/* Simple bookmark icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <button
        onClick={handleShare}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Partager l'article"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
          <path d="M16 6l-4-4-4 4" />
          <path d="M12 2v14" />
        </svg>
      </button>
    </div>
  );
}

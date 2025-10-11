"use client";
import React from 'react';

export default function SocialShareButtons({ title }: { title: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex gap-2">
      <button
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}
        className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
        aria-label="Partager sur Facebook"
      >
        <span className="text-sm font-semibold">f</span>
      </button>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')}
        className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center hover:bg-sky-200 transition-colors"
        aria-label="Partager sur Twitter"
      >
        <span className="text-sm font-semibold">t</span>
      </button>
      <button
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')}
        className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
        aria-label="Partager sur LinkedIn"
      >
        <span className="text-sm font-semibold">in</span>
      </button>
    </div>
  );
}

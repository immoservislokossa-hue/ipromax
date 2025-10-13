"use client";
import React from "react";

export default function SocialShareButtons({ title }: { title: string }) {
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Découvre cet article incroyable 👇",
          url: url,
        });
      } catch (error) {
        console.error("Partage annulé ou erreur :", error);
      }
    } else {
      // Fallback si le navigateur ne supporte pas navigator.share
      try {
        await navigator.clipboard.writeText(url);
        alert("Lien copié dans le presse-papiers !");
      } catch (error) {
        alert("Impossible de copier le lien.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md"
    >
      <span className="font-medium">Appuie sur le bouton pour partager</span>
    </button>
  );
}

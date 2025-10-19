import { useCallback, useRef } from 'react';

interface SEOStats {
  words: number;
  readingTime: number;
  h1: number;
  h2: number;
  h3: number;
  links: number;
  images: number;
  videos: number;
}

// Debounce maison avec typage correct
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useSEOAnalysis = () => {
  const analysisCache = useRef<Map<string, SEOStats>>(new Map());

  const analyzeContent = useCallback(
    debounce((html: string, text: string, onStatsUpdate?: (stats: SEOStats) => void) => {
      // Vérifier que les paramètres sont valides
      if (!html || !text) {
        return;
      }

      const cacheKey = `${html.length}-${text.length}`;
      
      if (analysisCache.current.has(cacheKey)) {
        onStatsUpdate?.(analysisCache.current.get(cacheKey)!);
        return;
      }

      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 200);
      
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const stats: SEOStats = {
          words: wordCount,
          readingTime,
          h1: doc.querySelectorAll('h1').length,
          h2: doc.querySelectorAll('h2').length,
          h3: doc.querySelectorAll('h3').length,
          links: doc.querySelectorAll('a').length,
          images: doc.querySelectorAll('img').length,
          videos: doc.querySelectorAll('video').length,
        };

        analysisCache.current.set(cacheKey, stats);
        onStatsUpdate?.(stats);
      } catch (error) {
        console.error('Erreur lors de l\'analyse SEO:', error);
        // Stats par défaut en cas d'erreur
        const defaultStats: SEOStats = {
          words: 0,
          readingTime: 0,
          h1: 0,
          h2: 0,
          h3: 0,
          links: 0,
          images: 0,
          videos: 0,
        };
        onStatsUpdate?.(defaultStats);
      }
    }, 500),
    []
  );

  return { analyzeContent };
};
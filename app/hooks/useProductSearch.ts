'use client';

import { useState, useMemo, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface UseProductSearchProps {
  initialProducts: any[] | null | undefined;
  searchKeys: string[];
}


export function useProductSearch({ initialProducts, searchKeys }: UseProductSearchProps) {
  const [searchTerm, setSearchTermRaw] = useState('');
  const [selectedCategory, setSelectedCategoryRaw] = useState('');

  /**  Nettoyage et validation sécurisée des entrées utilisateur */
  const sanitizeInput = useCallback((value: string) => {
    if (!value) return '';
    //  Neutraliser HTML / scripts
    let clean = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    //  Supprimer caractères suspects
    clean = clean.replace(/[<>$`{};]/g, '');

    // Limiter la longueur
    return clean.trim().slice(0, 64);
  }, []);

  /** Gestion sécurisée des changements */
  const setSearchTerm = useCallback(
    (val: string) => setSearchTermRaw(sanitizeInput(val)),
    [sanitizeInput]
  );
  const setSelectedCategory = useCallback(
    (val: string) => setSelectedCategoryRaw(sanitizeInput(val)),
    [sanitizeInput]
  );

  /** Normalisation des produits */
  const safeInitialProducts = useMemo(() => {
    if (!initialProducts || !Array.isArray(initialProducts)) return [];

    return initialProducts.map((p) => ({
      ...p,
      name: DOMPurify.sanitize(p.name || ''),
      description: DOMPurify.sanitize(p.description || ''),
      category: DOMPurify.sanitize(p.category || ''),
      brand: DOMPurify.sanitize(p.brand || ''),
    }));
  }, [initialProducts]);

  /** Liste unique des catégories */
  const categories = useMemo(() => {
    const set = new Set<string>();
    safeInitialProducts.forEach((p) => {
      if (p.category && typeof p.category === 'string') set.add(p.category);
    });
    return Array.from(set);
  }, [safeInitialProducts]);

  /** 🔎 Filtrage intelligent */
  const filteredProducts = useMemo(() => {
    return safeInitialProducts.filter((product) => {
      // Recherche
      const matchesSearch =
        !searchTerm ||
        searchKeys.some((key) => {
          const val = product[key];
          return (
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      // Catégorie
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, safeInitialProducts, searchKeys]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    categories,
  };
}

export default useProductSearch;

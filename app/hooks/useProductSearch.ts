// hooks/useProductSearch.ts
import { useState, useMemo } from 'react';

interface UseProductSearchProps {
  initialProducts: any[] | null | undefined;
  searchKeys: string[];
}

export function useProductSearch({ initialProducts, searchKeys }: UseProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Garantir que safeInitialProducts est toujours un tableau
  const safeInitialProducts = useMemo(() => {
    if (!initialProducts) return [];
    if (!Array.isArray(initialProducts)) return [];
    return initialProducts;
  }, [initialProducts]);

  // Extraction des catégories uniques
  const categories = useMemo(() => {
    return Array.from(new Set(safeInitialProducts.map(p => p.category))).filter(Boolean);
  }, [safeInitialProducts]);

  // Filtrage des produits - toujours retourner un tableau
  const filteredProducts = useMemo(() => {
    if (!safeInitialProducts || !Array.isArray(safeInitialProducts)) return [];
    
    return safeInitialProducts.filter(product => {
      // Filtre par recherche
      const matchesSearch =
        searchTerm === '' ||
        searchKeys.some(key => {
          const value = product[key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });

      // Filtre par catégorie
      const matchesCategory = !selectedCategory || product.category === selectedCategory;

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
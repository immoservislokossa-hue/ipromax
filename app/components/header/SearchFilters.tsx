'use client'

import { Search, X, Filter } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DOMPurify from 'dompurify'

interface SearchFiltersProps {
  onSearch: (query: string) => void
  onCategorySelect: (category: string) => void
  onFilterClick?: () => void
  categories: string[]
  selectedCategory?: string
  searchTerm?: string
  suggestions?: string[]
  productNames?: string[]
}

// Placeholders adaptés à Propulser
const placeholderDesktop = [
  "Recherchez une formation, un ebook ou un outil...",
  "Quel savoir voulez-vous acquérir aujourd'hui ?",
  "Explorez nos guides et formations exclusives...",
  "Votre apprentissage commence ici...",
  "Trouvez l’outil digital qui boostera vos compétences..."
]

const placeholderMobile = [
  "Que souhaitez-vous apprendre ?",
  "Trouvez votre formation idéale",
  "Découvrir un ebook inspirant ?",
  "Recherche rapide...",
  "Explorez nos ressources Propulser"
]

export default function SearchFilters({
  onSearch,
  onCategorySelect,
  onFilterClick,
  categories = [],
  selectedCategory,
  searchTerm = '',
  suggestions = [],
  productNames = []
}: SearchFiltersProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Détection mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Placeholder dynamique
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % (isMobile ? placeholderMobile.length : placeholderDesktop.length))
    }, 5000)
    return () => clearInterval(interval)
  }, [isMobile])

  // Suggestions filtrées et sécurisées
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) return suggestions
    const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const allSuggestions = [...new Set([...suggestions, ...productNames])]
    return allSuggestions.filter(item => 
      item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch)
    ).slice(0, 5)
  }, [searchTerm, suggestions, productNames])

  // Clic en dehors pour fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = DOMPurify.sanitize(e.target.value)
    onSearch(sanitized)
    setShowSuggestions(sanitized.length > 0)
  }

  const currentPlaceholder = isMobile ? placeholderMobile[placeholderIndex] : placeholderDesktop[placeholderIndex]

  return (
    <div className="w-full bg-[#F2F2FF] border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 py-4">

          {/* Barre de recherche + bouton filtre */}
          <div className="flex gap-3 w-full md:flex-1">
            <div ref={searchRef} className="relative flex-1">
              <input
                type="text"
                placeholder={currentPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => { setIsFocused(true); if (searchTerm) setShowSuggestions(true) }}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F23E8]/30 shadow transition-all duration-300 border border-gray-200"
              />
              <Search size={20} strokeWidth={2.2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F23E8]" />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Effacer la recherche"
                  onClick={() => { onSearch(''); setShowSuggestions(false) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}

              {/* Suggestions animées */}
              <AnimatePresence>
                {isFocused && showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => { onSearch(suggestion); setIsFocused(false); setShowSuggestions(false) }}
                        className="w-full px-4 py-3 text-left hover:bg-[#fef7f3] transition flex items-center group border-b border-gray-100 last:border-b-0"
                      >
                        <Search size={16} className="mr-3 text-gray-400 group-hover:text-[#0F23E8]" />
                        <span className="text-gray-700 group-hover:text-[#0F23E8] font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bouton filtre */}
            {onFilterClick && (
              <button
                type="button"
                aria-label="Filtrer"
                onClick={onFilterClick}
                className="flex-shrink-0 p-3.5 bg-[#FF6F00] text-white rounded-xl shadow hover:bg-[#FF6F00]/90 transition flex items-center justify-center"
              >
                <Filter size={20} strokeWidth={1.8} />
              </button>
            )}
          </div>

          {/* Catégories scrollables */}
          <div className="flex-1 flex items-center overflow-x-auto gap-2 scrollbar-hide pt-1 md:pt-0">
            <button
              type="button"
              onClick={() => onCategorySelect('')}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg whitespace-nowrap transition flex items-center gap-1 text-sm font-medium
                ${!selectedCategory
                  ? 'bg-[#0F23E8] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              Tout
            </button>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategorySelect(category)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-lg whitespace-nowrap transition flex items-center gap-1 text-sm font-medium
                  ${selectedCategory === category
                    ? 'bg-[#0F23E8] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

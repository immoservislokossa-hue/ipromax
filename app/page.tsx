'use client';
import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Flame, Star, ArrowRight, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import { services } from './services/data/services';
import truncateText from '@/lib/truncateText';

const ProductCard = dynamic(() => import('@/components/Produits/ProductCard'), { ssr: false, loading: () => <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> });
const RecentBlogPosts = dynamic(() => import('@/components/Bloging/RecentBlogPosts'), { ssr: false, loading: () => <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> });
const BannerHero = dynamic(() => import('@/components/BannerHero/BlogBannerHero'), { ssr: false, loading: () => <div className="h-[260px] md:h-[380px] w-full bg-gray-100 animate-pulse rounded-3xl" /> });

function useProductSearch(initialProducts: any[] | null | undefined, searchKeys: string[]) {
  const [searchTerm] = useState('');
  const [selectedCategory] = useState('');
  const sanitizeInput = useCallback((value: string) => {
    if (!value) return '';
    let clean = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    clean = clean.replace(/[<>$`{};]/g, '');
    return clean.trim().slice(0, 64);
  }, []);
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
  const filteredProducts = useMemo(() => {
    return safeInitialProducts.filter((p) => {
      const matchesSearch = !searchTerm || searchKeys.some((key) => {
        const val = p[key];
        return val && val.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, safeInitialProducts, searchKeys]);
  return { filteredProducts };
}

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('Propulser').select('*');
      if (error) console.error(error);
      setProducts(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const { filteredProducts } = useProductSearch(products, ['name', 'description', 'category', 'brand']);
  const getProductsToShow = (arr: any[]) => arr.slice(0, 8);
  const promoProducts = filteredProducts.filter((p) => p.promo);
  const bestSellers = filteredProducts.filter((p) => p.rating >= 4.5);

  return (
    <div className="min-h-screen text-gray-900 font-[Poppins]">
      {/* 🔹 Hero Section */}
      <div className="relative">
        <Suspense fallback={<div className="animate-pulse h-[280px] bg-gray-100 rounded-3xl" />}>
          <BannerHero />
        </Suspense>
      </div>

      
      {/* 🔹 Section Qui sommes-nous ? */}
      <section className="container mx-auto px-4 md:px-6 py-8 space-y-4 text-center md:text-left mt-8 md:mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="   p-2 md:p-2 mx-auto"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-[#0F23E8] mb-2 text-center">Qui sommes-nous ?</h2>
          <h3 className="text-gray-700 text-md leading-relaxed max-w-2xl mx-auto text-center">
            Propulser est une plateforme digitale dédiée à la croissance des créateurs, coachs, formateurs et entrepreneurs.
            Notre mission est de rendre la réussite accessible à tous, grâce à des outils, formations et ressources numériques puissants.
          </h3>
          <div className="flex justify-center mt-5">
            <Link
              href="/about"
              className="inline-flex items-center bg-[#0F23E8] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#0A1ACF] transition-all duration-300"
            >
              En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 🔹 Autres sections (inchangées, mais espacements harmonisés) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 md:px-8 py-8 space-y-16">
        <Suspense fallback={<LoadingSection label="Chargement des promotions..." />}>
          {promoProducts.length > 0 && (
            <>
              <SectionWithMotion title={<span className="flex items-center"><Flame className="mr-2 text-[#0F23E8]" /> Promotions</span>} linkHref="/produits">
                <GridAnimated>{getProductsToShow(promoProducts).map((p) => (<ProductCard key={p.slug} product={p} />))}</GridAnimated>
              </SectionWithMotion>
              <CTASection href="/produits" label="Découvrir la boutique" icon={<Star className="mr-2 text-yellow-300" />} />
            </>
          )}
        </Suspense>

        <Suspense fallback={<LoadingSection label="Chargement des services..." />}>
          <SectionWithMotion title={<span className="flex items-center"><Star className="mr-2 text-[#0F23E8]" /> Services IA</span>} linkHref="/services">
            <GridAnimated>
              {services.slice(0, 8).map((service) => (
                <motion.div key={service.id} whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                  <img src={service.image} alt={service.title} className="object-cover w-full h-48 rounded-t-2xl" loading="lazy" />
                  <div className="p-5 flex flex-col justify-between min-h-[200px]">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{truncateText(service.description, 100)}</p>
                    </div>
                    <Link href={`/services/${service.slug}`} className="inline-flex mt-4 items-center justify-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 w-full">
                      Découvrir le service <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </GridAnimated>
          </SectionWithMotion>
          <CTASection href="/services" label="Voir tous les services" icon={<Star className="mr-2 text-yellow-300" />} />
        </Suspense>

        <Suspense fallback={<LoadingSection label="Chargement du blog..." />}>
          <SectionWithMotion title={<span className="flex items-center"><Star className="mr-2 text-[#0F23E8]" /> Derniers articles</span>} linkHref="/blog">
            <RecentBlogPosts limit={8} />
          </SectionWithMotion>
          <CTASection href="/blog" label="Découvrir le blog" icon={<Star className="mr-2 text-yellow-300" />} />
        </Suspense>
      </motion.div>
    </div>
  );
}

function LoadingSection({ label }: { label: string }) {
  return <div className="w-full py-10 text-center text-gray-500 text-sm animate-pulse">{label}</div>;
}
function CTASection({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center mt-8">
      <Link href={href} className="inline-flex items-center px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        {icon} {label}
      </Link>
    </div>
  );
}
function GridAnimated({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
function SectionWithMotion({ title, linkHref, children }: { title: React.ReactNode; linkHref?: string; children: React.ReactNode; }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative sm:rounded-2xl sm:bg-white/90 sm:backdrop-blur-md sm:border sm:border-blue-100 sm:p-6 sm:shadow-md sm:max-w-full sm:mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F23E8]">{title}</h2>
        {linkHref && (
          <Link href={linkHref} className="text-[#0F23E8] hover:text-blue-700 transition flex items-center gap-1 text-sm">
            Voir plus <ArrowRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </motion.section>
  );
}

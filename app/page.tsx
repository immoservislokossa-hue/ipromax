'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Flame, Sparkles, Gem, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/Products/ProductCard';
import BannerHero from '@/components/BannerHero/BannerHero';
import RecentBlogPosts from '@/components/Bloging/RecentBlogPosts';
import { useProductSearch } from './hooks/useProductSearch';
import { services } from './services/data/services';
import truncateText from '@/lib/truncateText';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération des produits
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('Propulser').select('*');
      if (error) console.error(error);
      setProducts(
        data?.map((p: any) => ({
          ...p,
          name: DOMPurify.sanitize(p.name || ''),
          description: DOMPurify.sanitize(p.description || ''),
          category: DOMPurify.sanitize(p.category || ''),
          brand: DOMPurify.sanitize(p.brand || ''),
        })) || []
      );
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const {
    searchTerm,
    selectedCategory,
    filteredProducts,
  } = useProductSearch({
    initialProducts: products,
    searchKeys: ['name', 'description', 'category', 'brand'],
  });

  const getProductsToShow = (arr: any[]) => arr.slice(0, 8);
  const promoProducts = products.filter((p) => p.promo);
  const newProducts = products.filter((p) => p.is_new);
  const luxuryProducts = products.filter((p) => p.is_luxury);
  const bestSellers = products.filter((p) => p.rating >= 4.5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 text-gray-900 font-[Poppins]">
      {/* 🚀 Bannière principale */}
      <main className="pt-[60px] md:pt-[100px] lg:pt-[120px]">
        <BannerHero />
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 md:px-8 py-16 space-y-20"
      >
        {/* 🔥 Promotions */}
        {promoProducts.length > 0 && (
          <>
            <SectionWithMotion
              title={
                <span className="flex items-center">
                  <Flame className="mr-2 text-[#FF6F00]" /> Promotions exclusives
                </span>
              }
              linkHref="/promotions"
            >
              <GridAnimated>
                {getProductsToShow(promoProducts).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </GridAnimated>
            </SectionWithMotion>
            <CTASection />
          </>
        )}

       
       

        {/* ⭐ Best-sellers */}
        {bestSellers.length > 0 && (
          <>
            <SectionWithMotion
              title={
                <span className="flex items-center">
                  <Star className="mr-2 text-[#FF6F00]" /> Best-sellers
                </span>
              }
              linkHref="/best-sellers"
            >
              <GridAnimated>
                {getProductsToShow(bestSellers).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </GridAnimated>
            </SectionWithMotion>
            <CTASection />
          </>
        )}

        {/* 🧠 Services IA */}
        <SectionWithMotion
          title={
            <span className="flex items-center">
              <Star className="mr-2 text-[#FF6F00]" /> Services IA
            </span>
          }
          linkHref="/services"
        >
          <GridAnimated>
            {services.slice(0, 8).map((service) => (
              <motion.div
                key={service.id}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                      {service.category.charAt(0).toUpperCase() +
                        service.category.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between min-h-[210px]">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {truncateText(service.description, 120)}
                    </p>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 w-full"
                    >
                      Découvrir le service
                      <svg
                        className="w-4 h-4 ml-2"
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
                    </Link>
                  </div>
                </div>

                {/* Light blue glow */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-blue-100/40 to-indigo-100/30 blur-2xl"></div>
              </motion.div>
            ))}
          </GridAnimated>
        </SectionWithMotion>

        {/* 📰 Blog */}
        <SectionWithMotion
          title={
            <span className="flex items-center">
              <Star className="mr-2 text-[#FF6F00]" /> Derniers articles
            </span>
          }
          linkHref="/blog"
        >
          <RecentBlogPosts />
        </SectionWithMotion>

        <CTASection />
      </motion.div>
    </div>
  );
}

/* 🎬 GRILLE ANIMÉE */
function GridAnimated({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* 🧩 SECTION AVEC MOTION */
function SectionWithMotion({
  title,
  linkHref,
  children,
}: {
  title: React.ReactNode;
  linkHref?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100 p-6 md:p-10 shadow-md hover:shadow-lg transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F23E8]">{title}</h2>
        {linkHref && (
          <Link
            href={linkHref}
            className="text-[#0F23E8] hover:text-blue-700 transition flex items-center gap-1 text-sm"
          >
            Voir plus <ArrowRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </motion.section>
  );
}

/* ⭐ CTA */
function CTASection() {
  return (
    <div className="text-center mt-14">
      <Link
        href="/products"
        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
      >
        <Star className="mr-2 text-yellow-300" /> Découvrir la boutique
      </Link>
    </div>
  );
}

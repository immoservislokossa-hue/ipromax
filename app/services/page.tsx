"use client";

import { useState } from "react";
import Link from "next/link";
import { services, getServicesByCategory } from "./data/services";
import { motion } from "framer-motion";

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState<
    "tous" | "création" | "automatisation" | "consulting" | "marketing" | "data"
  >("tous");

  const categories = [
    { id: "tous", name: "Tous les services" },
    { id: "création", name: "Création IA" },
    { id: "automatisation", name: "Automatisation" },
    { id: "consulting", name: "Consulting & Formation" },
    { id: "marketing", name: "Marketing IA" },
    { id: "data", name: "Data & Analytics" },
  ];

  const filteredServices = getServicesByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/40 to-blue-100/20 text-gray-900">
      {/* Hero */}
      <header className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/60 via-indigo-50/40 to-blue-50/30 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Nos <span className="text-blue-600">Services IA</span>
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-lg">
            Découvrez toutes nos solutions IA classées par catégorie —
            de la création automatisée à la data intelligente.
          </p>
        </div>
      </header>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md ${
              activeCategory === category.id
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-400/30 scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filteredServices.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-500">
            Aucun service trouvé dans cette catégorie.
          </div>
        )}
      </section>
    </div>
  );
};

const ServiceCard = ({ service }: any) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "…";
  };

  return (
    <motion.div
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
            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
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
  );
};

export default ServicesPage;

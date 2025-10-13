// app/500/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Erreur 500 — Problème technique | Epropulse",
  description:
    "Une erreur interne est survenue sur Epropulse. Notre équipe technique a été informée et travaille à la corriger. Découvrez nos formations, services IA et ressources digitales en attendant.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.epropulse.com/500",
  },
  openGraph: {
    title: "Erreur 500 — Problème technique | Epropulse",
    description:
      "Une erreur technique est survenue, mais pas de panique : Epropulse continue de vous aider à réussir avec le digital.",
    url: "https://www.epropulse.com/500",
    siteName: "Epropulse",
    images: [
      {
        url: "https://www.epropulse.com/og/epropulse-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Epropulse — Plateforme IA et digital",
      },
    ],
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Erreur 500 — Problème technique | Epropulse",
    description:
      "Une erreur interne est survenue, notre équipe s'en occupe ! Continuez votre découverte d’Epropulse.",
    images: ["https://www.epropulse.com/og/epropulse-1200x630.png"],
  },
};

export default function ServerErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50 px-6 py-20 text-center">
      {/* JSON-LD Schema SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.epropulse.com/500#webpage",
            url: "https://www.epropulse.com/500",
            name: "Erreur 500 — Problème technique | Epropulse",
            description:
              "Une erreur interne est survenue sur Epropulse. Notre équipe technique a été alertée et résout le problème.",
            publisher: {
              "@type": "Organization",
              name: "Epropulse",
              logo: {
                "@type": "ImageObject",
                url: "https://www.epropulse.com/digital-logo.svg",
              },
            },
          }),
        }}
      />

      <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-200 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
          ⚠️ Erreur 500 — Oups !
        </h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          Une erreur technique inattendue s'est produite sur{" "}
          <strong>Epropulse</strong>.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Pas d’inquiétude, notre équipe IA et technique a été alertée
          automatiquement  et travaille déjà à corriger le problème.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Retourner à l’accueil
          </Link>
          <Link
            href="/blog"
            className="border border-blue-600 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
          >
            Lire nos articles
          </Link>
        </div>
      </div>

      {/* Section SEO-friendly / Confiance */}
      <section className="mt-12 max-w-3xl text-gray-700">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
          Pourquoi vous voyez cette page ?
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          Une erreur 500 signifie que le serveur a rencontré un problème interne.
          Cela peut arriver après une mise à jour, un pic de trafic, ou une
          maintenance en cours.
        </p>
        <p className="text-sm text-gray-600">
          Si le problème persiste, vous pouvez{" "}
          <Link
            href="/contact"
            className="text-blue-600 font-medium hover:underline"
          >
            contacter notre équipe
          </Link>{" "}
          pour nous le signaler.
        </p>
      </section>

      {/* Branding */}
      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Epropulse — Formations, consulting & services IA.
      </footer>
    </main>
  );
}

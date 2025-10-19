import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import BottomNav from "./components/header/BottomNav";
import Footer from "./components/Footer/Footer";
import TopBar from "./components/header/TopBar";
import InstallPrompt from "./components/PWA/InstallPrompt";

import "./globals.css";

// ✅ Police optimisée
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"], 
  display: "swap",
});

// ✅ Configuration PWA + SEO + Accessibilité
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F23E8",
};

export const metadata: Metadata = {
  title: "Propulser - Formations, ebooks et outils digitaux premium",
  description:
    "Propulser vous accompagne pour apprendre, créer et réussir : formations, ebooks et outils digitaux premium pour professionnels, créateurs et passionnés.",
  manifest: "/manifest.json", // ✅ correction ici
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Propulser",
  },
  icons: {
    icon: "/digital-logo.svg",
    shortcut: "/digital-logo.svg",
    apple: "/icons/propulser.png",
  },
  openGraph: {
    title: "Propulser - Plateforme digitale pour apprendre et créer",
    description:
      "Formations, ebooks et outils digitaux premium pour professionnels et créateurs.",
    url: "https://www.propulser.shop",
    siteName: "Propulser",
    images: [
      {
        url: "/og/propulser-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Propulser — Formations et ebooks digitaux",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Propulser - Formations et ebooks digitaux",
    description:
      "Apprenez, créez et réussissez avec Propulser : formations, ebooks et outils digitaux premium.",
    images: ["/og/propulser-1200x630.png"],
    creator: "@propulser",
  },
};

// ✅ LAYOUT PRINCIPAL
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Balises META spécifiques PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Propulser" />
        <meta name="theme-color" content="#0F23E8" />

        {/* Favicon */}
        <link rel="icon" href="/digital-logo.svg" type="image/svg+xml" />

        {/* JSON-LD SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Propulser",
              url: "https://www.propulser.shop",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.propulser.shop/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body
        className={`bg-[#F2F2FF] flex flex-col min-h-screen overflow-x-hidden w-full max-w-[100vw] ${poppins.className}`}
        suppressHydrationWarning
      >
        <div className="flex flex-col min-h-screen w-full max-w-[100vw] mx-auto">
          {/* ✅ Accessibilité SEO */}
          <h1 className="sr-only">
            Propulser - Plateforme digitale pour formations, ebooks et outils digitaux
          </h1>

          {/* ✅ Header / Navigation */}
          <TopBar />
          <InstallPrompt />

          {/* ✅ Contenu principal */}
          <main className="flex-1 w-full max-w-[100vw] overflow-hidden px-4 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* ✅ Footer + navigation mobile */}
          <Footer />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

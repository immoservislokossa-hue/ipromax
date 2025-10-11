// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import BottomNav from "./components/header/BottomNav";
import Footer from "./components/Footer/Footer";
import TopBar from "./components/header/TopBar";
import InstallPrompt from "./components/PWA/InstallPrompt";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400","500","600","700"], display: "swap" });

// ✅ Next 15: exporter le viewport plutôt que metadata.viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F23E8", // aide aussi l’installabilité
};

export const metadata: Metadata = {
  title: "Propulser - Formations, ebooks et outils digitaux premium",
  description:
    "Propulser vous accompagne pour apprendre, créer et réussir : formations en ligne, ebooks numériques et outils digitaux pour professionnels, créateurs et passionnés.",
  // ⬇️ ✅ Lier le manifest PWA
  manifest: "/manifest.webmanifest",
  // (facultatif mais utile pour iOS)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Propulser",
  },
  icons: {
    // Ces favicons ne servent pas à l’installabilité PWA (c’est le manifest qui compte)
    icon: "/digital-LOGO.SVG",
    shortcut: "/digital-LOGO.SVG",
    apple: "/icons/propulser.png", // ✅ icône iOS (PNG)
  },
  openGraph: {
    title: "Propulser - Plateforme digitale pour apprendre et créer",
    description:
      "Formations, ebooks et outils digitaux premium pour professionnels et créateurs.",
    url: "https://www.propulser.shop",
    siteName: "Propulser",
    // Recommande: image PNG/JPG pour l’aperçu OG
    images: [{ url: "/og/propulser-1200x630.png", width: 1200, height: 630 }],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD */}
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
        {/* Favicons (OK en SVG), + icône Apple en PNG */}
        <link rel="icon" href="/digital-LOGO.SVG" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/propulser.png" />
      </head>
      <body className={`bg-[#F2F2FF] min-h-screen flex flex-col ${poppins.className}`} suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <h1 className="sr-only">Propulser - Plateforme digitale pour formations, ebooks et outils digitaux</h1>
          <TopBar />
          <InstallPrompt />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

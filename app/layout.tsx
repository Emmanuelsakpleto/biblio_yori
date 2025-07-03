import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "YORI - Bibliothèque Universitaire",
  description: "Plateforme moderne de gestion bibliothécaire pour l'enseignement supérieur",
  keywords: ["bibliothèque", "livres", "emprunts", "université", "étudiants", "yori"],
  authors: [{ name: "YORI Team" }],
  openGraph: {
    title: "YORI - Bibliothèque Universitaire",
    description: "Plateforme moderne de gestion bibliothécaire pour l'enseignement supérieur",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Importer le viewport depuis le fichier dédié
export { viewport } from './viewport';

import { AuthProvider } from '../contexts/AuthContext';
import { ConfigProvider } from '../contexts/ConfigContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="smooth-scroll">
      <head>
        <meta name="theme-color" content="#1e293b" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 overflow-x-hidden`}
      >
        {/* Main App Container */}
        <div className="relative z-10 min-h-screen">
          <ConfigProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ConfigProvider>
        </div>
      </body>
    </html>
  );
}

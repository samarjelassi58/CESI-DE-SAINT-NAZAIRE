import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import SkipToContent from '@/components/layouts/SkipToContent'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Talent Map - Cartographie des Talents CESI',
  description:
    'Plateforme de découverte et mise en relation des talents pour le Défi National CESI',
  keywords: 'talents, compétences, collaboration, CESI, skills, networking',
  authors: [{ name: 'CESI Saint-Nazaire' }],
  openGraph: {
    title: 'Talent Map - Cartographie des Talents CESI',
    description: 'Découvrez et partagez vos talents avec la communauté CESI',
    type: 'website',
    locale: 'fr_FR'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <SkipToContent />
        <main id="main-content">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff'
              }
            }
          }}
        />
      </body>
    </html>
  )
}

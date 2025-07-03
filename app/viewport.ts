import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Permettre aux utilisateurs de zoomer pour une meilleure accessibilité
  maximumScale: 5,
  userScalable: true,
  // Couleurs de thème plus conformes à la palette sobre et premium de YORI
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1b1e' }
  ]
}

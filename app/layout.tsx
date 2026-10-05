import type { Metadata } from 'next'

import '@fontsource-variable/inter'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/600.css'
import '@fontsource/quicksand/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

import '../src/index.css'

export const metadata: Metadata = {
  title: 'Murmura Labs | Urban science & technology',
  description:
    "An independent lab exploring cities through spatial data, fieldwork, and software.",
  metadataBase: new URL('https://murmuralabs.com'),
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://murmuralabs.com/',
    title: 'Murmura Labs | Urban science & technology',
    description:
      "An independent lab exploring cities through spatial data, fieldwork, and software.",
    siteName: 'Murmura Labs',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Murmura Labs | Urban science & technology',
    description:
      "Urban science and technology. Explore current work in spatial data, city modeling, and street-level reconstruction.",
  },
  other: { 'theme-color': '#190f0a' },
}

const organizationLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Murmura Labs',
  url: 'https://murmuralabs.com',
  logo: 'https://murmuralabs.com/favicon.svg',
  description:
    'Independent lab exploring cities through spatial data, fieldwork, and software.',
  email: 'hello@murmuralabs.com',
  areaServed: 'San Francisco Bay Area',
  knowsAbout: [
    'urban planning',
    'agent-based modeling',
    'scenario modeling',
    'spatial data science',
    'network science',
    '3D Gaussian splatting',
    'street-level reconstruction',
  ],
}

const softwareLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'murmur',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://murmur.murmuralabs.com',
  description:
    'Explore neighborhood conditions and modeled responses to city decisions across housing, health, environment, mobility, and equity.',
  creator: {
    '@type': 'Organization',
    name: 'Murmura Labs',
    url: 'https://murmuralabs.com',
  },
}

const groundLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'murmura ground',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  url: 'https://district.murmuralabs.com',
  description: 'Experimental street-level 3D reconstruction and browser exploration, focused on San Francisco sidewalks.',
  creator: { '@type': 'Organization', name: 'Murmura Labs', url: 'https://murmuralabs.com' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://murmur.murmuralabs.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareLD, groundLD]) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

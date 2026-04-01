import type { Metadata } from 'next'

import '@fontsource-variable/inter'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/600.css'
import '@fontsource/quicksand/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

import '../src/index.css'

export const metadata: Metadata = {
  title: 'Murmura Labs — Urban Foresight Platform | murmur.ai',
  description:
    "See the second-order effects of urban decisions before they're made. murmur models cascading impacts across demographics, health, environment, housing, transit, and equity.",
  metadataBase: new URL('https://murmuralabs.com'),
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    url: 'https://murmuralabs.com/',
    title: 'Murmura Labs — Urban Foresight Platform',
    description:
      "See the second-order effects of urban decisions before they're made. murmur models cascading impacts across demographics, health, environment, housing, transit, and equity.",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    siteName: 'Murmura Labs',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Murmura Labs — Urban Foresight Platform',
    description:
      "See the second-order effects of urban decisions before they're made. Scenario modeling across demographics, health, environment, housing, transit, and equity.",
    images: ['/og-image.png'],
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
    'Urban intelligence company building murmur, an agent-based simulation platform for modeling cascading impacts of city decisions.',
  email: 'hello@murmuralabs.com',
  areaServed: 'San Francisco Bay Area',
  knowsAbout: [
    'urban planning',
    'agent-based modeling',
    'scenario modeling',
    'spatial data science',
    'network science',
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
    'Urban foresight platform. Model cascading impacts of city decisions across demographics, health, environment, housing, transit, and equity.',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/PreOrder',
  },
  creator: {
    '@type': 'Organization',
    name: 'Murmura Labs',
    url: 'https://murmuralabs.com',
  },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

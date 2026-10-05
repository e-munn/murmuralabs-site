import type { Metadata } from 'next'
import MurmurPage from './MurmurPage'

export const metadata: Metadata = {
  title: 'murmur | Murmura Labs',
  description: 'Explore neighborhood conditions and modeled urban scenarios with murmur, a Murmura Labs project.',
  alternates: { canonical: '/murmur' },
  openGraph: { title: 'murmur | Murmura Labs', url: 'https://murmuralabs.com/murmur', description: 'Explore neighborhood conditions and modeled urban scenarios with murmur.' },
}

export default MurmurPage

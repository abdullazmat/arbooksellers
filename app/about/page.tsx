import { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about AR Book Sellers, your trusted source for authentic Islamic books in Pakistan. Our journey, values, and commitment to Islamic scholarship.',
  openGraph: {
    title: 'About Us | AR Book Sellers',
    description: 'Our journey of providing authentic Islamic literature across Pakistan since 2009.',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'}/about`,
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutClient />
}

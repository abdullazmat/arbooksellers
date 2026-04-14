import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with AR Book Sellers. Contact us for orders, book inquiries, or support. We are located in Urdu Bazar, Lahore, Pakistan.',
  openGraph: {
    title: 'Contact Us | AR Book Sellers',
    description: 'We are here to help. Reach out to us for any questions regarding your Islamic book orders.',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'}/contact`,
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactClient />
}

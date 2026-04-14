import type { Metadata } from 'next'
import { Inter, Amiri } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { WishlistProvider } from '@/contexts/wishlist-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'),
  title: {
    template: '%s | AR Book Sellers',
    default: 'Islamic BookStore in Pakistan | AR Book Sellers',
  },
  description: 'Shop authentic Quran, Hadith, Tafsir, and Islamic literature from AR Book Sellers. Your trusted online Islamic bookstore in Pakistan.',
  keywords: ['Islamic books', 'Quran', 'Hadith', 'Tafsir', 'Seerah', 'Islamic bookstore Pakistan', 'Islamic gift sets', 'Original Islamic Books', 'Urdu Bazar Lahore'],
  authors: [{ name: 'AR Book Sellers' }],
  creator: 'AR Book Sellers',
  publisher: 'AR Book Sellers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com',
    siteName: 'AR Book Sellers',
    title: 'AR Book Sellers | Authentic Islamic Books in Pakistan',
    description: 'Shop authentic Quran, Hadith, Tafsir, and Islamic literature. Your trusted online Islamic bookstore in Pakistan.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AR Book Sellers - Islamic Bookstore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AR Book Sellers | Authentic Islamic Books in Pakistan',
    description: 'Shop authentic Quran, Hadith, Tafsir, and Islamic literature. Your trusted online Islamic bookstore in Pakistan.',
    images: ['/og-image.png'],
    creator: '@arbooksellers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'OnlineStore',
          name: 'AR Book Sellers',
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com',
          logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'}/logo.png`,
          sameAs: [
            'https://facebook.com/arbooksellers',
            'https://instagram.com/arbooksellers',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+92-300-8016812',
            contactType: 'customer service',
            areaServed: 'PK',
            availableLanguage: ['Urdu', 'English'],
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: '17 Aziz Market, Urdu Bazar',
            addressLocality: 'Lahore',
            addressRegion: 'Punjab',
            postalCode: '54000',
            addressCountry: 'PK',
          },
        }),
      }}
    />
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <OrganizationSchema />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

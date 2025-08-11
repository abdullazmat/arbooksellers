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
  title: 'Islamic Books - Authentic Literature',
  description: 'Your one-stop shop for authentic Quran, Hadith, and Islamic studies books.',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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

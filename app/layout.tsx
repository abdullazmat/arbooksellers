import type { Metadata } from 'next'
import { Inter, Amiri } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { WishlistProvider } from '@/contexts/wishlist-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ClientOnly } from '@/components/ui/client-only'

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
    <html lang="en" className={`${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ClientOnly fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            </div>
          }>
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
          </ClientOnly>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

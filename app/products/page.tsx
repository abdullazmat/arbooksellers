import { Metadata } from 'next'
import ProductsClient from './ProductsClient'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our extensive collection of authentic Islamic books. We offer Quran Majeed, Hadith sets from Sahih Bukhari & Muslim, Tafsir, and Islamic literature with delivery across Pakistan.',
  openGraph: {
    title: 'Islamic Books Collection | AR Book Sellers',
    description: 'Shop authentic Quran and Islamic literature online. Fast delivery in Pakistan.',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'}/products`,
    type: 'website',
  },
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-48 bg-gray-200 rounded mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2rem]"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsClient />
    </Suspense>
  )
}

import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/components/products/product-card'
import connectDB from '@/lib/db'
import Product from '@/models/Product'

async function getFeaturedProducts() {
  await connectDB()
  try {
    const products = await Product.find({ featured: true })
      .limit(8)
      .sort({ createdAt: -1 })
      .lean()
    
    // Serialize MongoDB objects to plain JSON
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background font-inter overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-islamic-green-50 dark:bg-islamic-green-950/30 text-islamic-green-700 dark:text-islamic-green-300 hover:bg-islamic-green-100 dark:hover:bg-islamic-green-900/50 border-islamic-green-200 dark:border-islamic-green-800 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              Curated Selection
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
              Discover Our <br/>
              <span className="gradient-text">Featured</span> Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
             A carefully chosen collection of popular and trusted Islamic books in Pakistan.
            </p>
          </div>

          <Link href="/products" className="hidden md:block">
            <button className="group flex items-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-islamic-green-600 hover:text-white dark:hover:bg-islamic-green-600 hover:shadow-2xl hover:shadow-islamic-green-100/20">
              Explore All Books
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mb-16">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile-only CTA */}
        <div className="md:hidden text-center">
            <Link href="/products">
              <button className="w-full bg-gray-900 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs">
                Explore All Products
              </button>
            </Link>
        </div>
      </div>
    </section>
  )
}

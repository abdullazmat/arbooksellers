"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Eye, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'
import { formatPrice, getProductImageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductCard, ProductCardData } from '@/components/products/product-card'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/products?featured=true&limit=8')
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }
        
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Failed to load featured products')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-white font-inter">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-islamic-green-50 border border-islamic-green-100 text-[10px] font-black uppercase tracking-widest text-islamic-green-700">Curated Collection</div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">Hand-Picked <span className="text-islamic-green-600">Featured</span> Books</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="aspect-[4/5] bg-gray-50 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return null; // Don't show anything if no products/error
  }

  return (
    <section className="py-24 bg-white font-inter overflow-hidden border-y border-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-islamic-green-50 text-islamic-green-700 hover:bg-islamic-green-100 border-islamic-green-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              Curated Selection
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Discover Our <br/>
              <span className="text-islamic-green-600 font-serif italic font-normal">Featured</span> Collections
            </h2>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
             A carefully chosen collection of popular and trusted Islamic books in Pakistan.
            </p>
          </div>

          <Link href="/products" className="hidden md:block">
            <button className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-islamic-green-600 hover:shadow-2xl hover:shadow-islamic-green-100">
              Explore All Books
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mb-16">
          {products.map((product) => (
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

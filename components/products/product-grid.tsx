'use client'

import { ProductCard } from '@/components/products/product-card'

interface Product {
  _id: string
  title: string
  author?: string
  price: number
  originalPrice?: number
  images: string[]
  inStock: boolean
  featured: boolean
  size?: string
  pages?: number
  paper?: string
  binding?: string
  rating?: number
  reviews?: number
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

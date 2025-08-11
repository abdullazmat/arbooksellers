'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  author?: string
  price: number
  originalPrice?: number
  images: string[]
  inStock: boolean
  featured: boolean
  rating?: number
  reviews?: number
  size?: string
  pages?: number
  paper?: string
  binding?: string
}

interface ProductGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
    })
    
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart`,
    })
  }

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
      toast({
        title: 'Removed from wishlist',
        description: `${product.title} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(product._id, {
        title: product.title,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        author: product.author || 'Unknown',
      })
      toast({
        title: 'Added to wishlist',
        description: `${product.title} has been added to your wishlist`,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <div className="flex">
              {/* Product Image */}
              <div className="w-48 h-48 flex-shrink-0">
                <img
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      <Link href={`/products/${product._id}`} className="hover:text-green-600">
                        {product.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-lg mb-2">
                      by {product.author}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span>({product.reviews || 0})</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      {product.size && <div>Size: {product.size}</div>}
                      {product.pages && <div>Pages: {product.pages}</div>}
                      {product.paper && <div>Paper: {product.paper}</div>}
                      {product.binding && <div>Binding: {product.binding}</div>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {product.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    <Badge variant={product.inStock ? 'default' : 'destructive'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(product.price)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-lg text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWishlistToggle(product)}
                      className={isInWishlist(product._id) ? 'text-red-600 border-red-600' : ''}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Link href={`/products/${product._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWishlistToggle(product)}
                  className={`bg-white/90 hover:bg-white ${
                    isInWishlist(product._id) ? 'text-red-600 border-red-600' : ''
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </Button>
                
                <Link href={`/products/${product._id}`}>
                  <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Status Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.featured && (
                <Badge variant="secondary" className="text-xs">Featured</Badge>
              )}
              <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2 line-clamp-2">
              <Link href={`/products/${product._id}`} className="hover:text-green-600">
                {product.title}
              </Link>
            </CardTitle>
            
            <CardDescription className="text-sm mb-3 line-clamp-1">
              by {product.author}
            </CardDescription>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({product.reviews || 0})</span>
              </div>
            )}

            {/* Product Details */}
            <div className="text-xs text-gray-600 mb-3 space-y-1">
              {product.size && <div>Size: {product.size}</div>}
              {product.pages && <div>Pages: {product.pages}</div>}
              {product.paper && <div>Paper: {product.paper}</div>}
              {product.binding && <div>Binding: {product.binding}</div>}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

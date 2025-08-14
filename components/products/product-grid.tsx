'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'
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
  size?: string
  pages?: number
  paper?: string
  binding?: string
  rating?: number
  reviews?: number
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

  if (viewMode === 'list') {
    return (
      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row">
              {/* Product Image */}
              <div className="w-full sm:w-48 h-48 sm:h-48 flex-shrink-0">
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
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl mb-2">
                      <Link href={`/products/${product._id}`} className="hover:text-green-600 transition-colors">
                        {product.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg mb-2">
                      by {product.author}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {product.rating && product.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{Number(product.rating).toFixed(1)}</span>
                          <span>({product.reviews || 0})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="h-4 w-4" />
                          <span>No ratings yet</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      {product.size && <div><span className="font-medium">Size:</span> {product.size}</div>}
                      {product.pages && <div><span className="font-medium">Pages:</span> {product.pages}</div>}
                      {product.paper && <div><span className="font-medium">Paper:</span> {product.paper}</div>}
                      {product.binding && <div><span className="font-medium">Binding:</span> {product.binding}</div>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {product.featured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                    <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-base sm:text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWishlistToggle(product)}
                      className={`${isInWishlist(product._id) ? 'text-red-600 border-red-600' : ''}`}
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
                      className="bg-green-600 hover:bg-green-700 text-sm sm:text-base"
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
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
      {products.map((product) => (
        <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-gray-300">
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
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
              <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWishlistToggle(product)}
                  className={`bg-white/90 hover:bg-white shadow-lg h-8 w-8 sm:h-9 sm:w-9 p-0 ${
                    isInWishlist(product._id) ? 'text-red-600 border-red-600' : ''
                  }`}
                >
                  <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </Button>
                
                <Link href={`/products/${product._id}`}>
                  <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white shadow-lg h-8 w-8 sm:h-9 sm:w-9 p-0">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Status Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.featured && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium shadow-md">
                  Featured
                </Badge>
              )}
              <Badge className={`text-xs font-medium shadow-md ${
                product.inStock 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-2.5 sm:p-3 lg:p-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 line-clamp-2 leading-tight">
              <Link href={`/products/${product._id}`} className="hover:text-green-600 transition-colors">
                {product.title}
              </Link>
            </CardTitle>
            
            <CardDescription className="text-xs sm:text-sm mb-1.5 sm:mb-2 lg:mb-3 line-clamp-1 text-gray-600">
              by {product.author}
            </CardDescription>

            {/* Rating */}
            {product.rating && product.rating > 0 ? (
              <div className="flex items-center gap-1 mb-1.5 sm:mb-2 lg:mb-3">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
                <span className="text-xs text-gray-500">({product.reviews || 0})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mb-1.5 sm:mb-2 lg:mb-3 text-gray-400">
                <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">No ratings yet</span>
              </div>
            )}

            {/* Product Details - Responsive */}
            <div className="text-xs text-gray-600 mb-2 sm:mb-2.5 lg:mb-3 space-y-0.5 sm:space-y-1">
              {product.size && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Size:</span>
                  <span className="truncate">{product.size}</span>
                </div>
              )}
              {product.pages && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Pages:</span>
                  <span>{product.pages}</span>
                </div>
              )}
              {product.paper && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Paper:</span>
                  <span className="truncate">{product.paper}</span>
                </div>
              )}
              {product.binding && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Binding:</span>
                  <span className="truncate">{product.binding}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3 lg:mb-4">
              <span className="text-base sm:text-lg lg:text-xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
              className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm lg:text-base py-1.5 sm:py-2 lg:py-2.5 transition-all duration-200 h-8 sm:h-9 lg:h-10"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 lg:mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

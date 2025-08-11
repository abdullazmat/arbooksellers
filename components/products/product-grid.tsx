'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  author: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviews: number
  category: string
  language: string
  inStock: boolean
  stockQuantity: number
  description: string
  featured: boolean
  discountPercentage?: number
}

interface ProductGridProps {
  filters: {
    category: string
    priceRange: [number, number]
    language: string
    author: string
    inStock: boolean
  }
  sortBy: string
  viewMode: 'grid' | 'list'
}

export function ProductGrid({ filters, sortBy, viewMode }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }
      
      if (filters.language && filters.language !== 'all') {
        params.append('language', filters.language)
      }
      
      if (filters.author) {
        params.append('search', filters.author)
      }
      
      if (filters.inStock) {
        params.append('inStock', 'true')
      }

      // Add sorting
      switch (sortBy) {
        case 'price-low':
          params.append('sortBy', 'price')
          params.append('sortOrder', 'asc')
          break
        case 'price-high':
          params.append('sortBy', 'price')
          params.append('sortOrder', 'desc')
          break
        case 'rating':
          params.append('sortBy', 'rating')
          params.append('sortOrder', 'desc')
          break
        case 'newest':
          params.append('sortBy', 'createdAt')
          params.append('sortOrder', 'desc')
          break
        default:
          params.append('sortBy', 'createdAt')
          params.append('sortOrder', 'desc')
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      
      // Apply price range filter on client side
      let filteredProducts = data.products.filter((product: Product) => {
        return product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      })

      setProducts(filteredProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
    })
  }

  const handleWishlistToggle = async (product: Product) => {
    if (!user) {
      // Show login prompt or redirect to login
      return
    }

    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id)
    } else {
      await addToWishlist(product._id, {
        title: product.title,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        author: product.author,
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-200 rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchProducts} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
        <Button onClick={fetchProducts} variant="outline">
          Clear Filters
        </Button>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link href={`/products/${product._id}`} className="hover:text-green-600 transition-colors">
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-2">by {product.author}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          PKR {product.price.toFixed(2)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            PKR {product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWishlistToggle(product)}
                          className={isInWishlist(product._id) ? 'text-red-500' : ''}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white ${
                  isInWishlist(product._id) ? 'text-red-500' : 'text-gray-600'
                }`}
                onClick={() => handleWishlistToggle(product)}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
              </Button>

              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                <Link
                  href={`/products/${product._id}`}
                  className="hover:text-green-600 transition-colors"
                >
                  {product.title}
                </Link>
              </h3>

              <p className="text-sm text-gray-600 mb-2">{product.author}</p>

              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-islamic-green-700">
                    PKR {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      PKR {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/products/${product._id}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              {!product.inStock && (
                <Badge variant="secondary" className="mt-2">
                  Out of Stock
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

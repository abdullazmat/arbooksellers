"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Product {
  _id: string
  title: string
  author?: string
  price: number
  originalPrice?: number
  images: string[]
  featured: boolean
  inStock: boolean
  stockQuantity: number
  size?: string
  pages?: number
  paper?: string
  binding?: string
  rating?: number
  reviews?: number
}

export default function FeaturedProducts() {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
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

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
    })
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart`,
    })
  }

  const handleWishlistToggle = async (product: Product) => {
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id)
        toast({
          title: 'Removed from wishlist',
          description: `${product.title} has been removed from your wishlist`,
        })
      } else {
        await addToWishlist(product._id, {
          title: product.title,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          author: product.author || 'Unknown',
        })
        toast({
          title: 'Added to wishlist',
          description: `${product.title} has been added to your wishlist`,
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <section className="py-12 md:py-24 lg:py-32 bg-gray-50 font-inter">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
              Featured Books
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
              Discover our hand-picked selection of the most popular and highly-rated Islamic books.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-xl shadow-modern animate-pulse">
                <div className="h-60 bg-gray-200"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex gap-2 mt-3">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 md:py-24 lg:py-32 bg-gray-50 font-inter">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
              Featured Books
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
              Discover our hand-picked selection of the most popular and highly-rated Islamic books.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="gradient-primary hover:shadow-islamic"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-24 lg:py-32 bg-gray-50 font-inter">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
              Featured Books
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
              Discover our hand-picked selection of the most popular and highly-rated Islamic books.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No featured products available at the moment.</p>
            <Link href="/products">
              <Button className="gradient-primary hover:shadow-islamic">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gray-50 font-inter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
            Featured Books
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
            Discover our hand-picked selection of the most popular and highly-rated Islamic books.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => (
            <Card key={product._id} className={`overflow-hidden rounded-xl shadow-modern hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up stagger-${index + 3}`}>
              <Link href={`/products/${product._id}`} className="block relative h-60 w-full overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                
                {/* Status Pills - Top Left */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium shadow-md">
                      Featured
                    </Badge>
                  )}
                  {product.inStock && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium shadow-md">
                      In Stock
                    </Badge>
                  )}
                </div>
                
                {/* Discount Badge - Top Right */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-500 text-white">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
                
                {/* Out of Stock Badge - Bottom Left (if no stock) */}
                {!product.inStock && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-gray-500 text-white">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </Link>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  <Link href={`/products/${product._id}`} className="hover:text-islamic-green-600 transition-colors">
                    {product.title}
                  </Link>
                </h3>
                {product.author && (
                  <p className="text-sm text-muted-foreground">by {product.author}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-islamic-green-700">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-islamic-gold-500">
                    <Star className="h-4 w-4 fill-islamic-gold-500" />
                    <span>
                      {product.rating && product.rating > 0 
                        ? `${Number(product.rating).toFixed(1)} (${product.reviews || 0})`
                        : 'No ratings yet'
                      }
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    className="flex-1 gradient-primary hover:shadow-islamic transition-all duration-300 group"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`border-islamic-green-300 text-islamic-green-700 hover:bg-islamic-green-50 hover:border-islamic-green-500 transition-all duration-300 group ${
                      isInWishlist(product._id) ? 'bg-islamic-green-50 border-islamic-green-500 text-islamic-green-800' : ''
                    }`}
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <Heart className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                      isInWishlist(product._id) ? 'fill-current text-red-500' : ''
                    }`} />
                    <span className="sr-only">
                      {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up stagger-last">
          <Link href="/products">
            <Button className="h-12 px-8 text-lg rounded-full gradient-primary shadow-islamic hover:shadow-lg transition-all duration-300 hover-lift">
              View All Books
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

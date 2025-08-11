'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
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
  fullDescription: string
  specifications: {
    publisher: string
    pages: number
    isbn: string
    dimensions: string
    weight: string
    binding: string
  }
  tags: string[]
  featured: boolean
  discountPercentage?: number
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Product not found')
      }
      
      const data = await response.json()
      setProduct(data.product)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
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

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your wishlist',
        variant: 'destructive',
      })
      return
    }

    if (!product) return

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
        author: product.author,
      })
      toast({
        title: 'Added to wishlist',
        description: `${product.title} has been added to your wishlist`,
      })
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/products" className="text-gray-500 hover:text-gray-700 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600 mb-4">by {product.author}</p>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-green-600">
                  PKR {product.price.toFixed(2)}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-lg text-gray-500 line-through">
                    PKR {product.originalPrice.toFixed(2)}
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product._id) ? 'text-red-500 border-red-200' : ''}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {!product.inStock && (
                <Badge variant="secondary" className="text-red-600">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Publisher:</dt>
                    <dd className="font-medium">{product.specifications.publisher}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Pages:</dt>
                    <dd className="font-medium">{product.specifications.pages}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">ISBN:</dt>
                    <dd className="font-medium">{product.specifications.isbn}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Dimensions:</dt>
                    <dd className="font-medium">{product.specifications.dimensions}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Weight:</dt>
                    <dd className="font-medium">{product.specifications.weight}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Binding:</dt>
                    <dd className="font-medium">{product.specifications.binding}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Language:</dt>
                    <dd className="font-medium">{product.language}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

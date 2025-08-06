'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Product {
  id: string
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
}

const productData: Record<string, Product> = {
  '1': {
    id: '1',
    title: 'The Noble Quran - Arabic & English',
    author: 'Translation by Dr. Muhammad Taqi-ud-Din',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      '/placeholder-34zy2.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.9,
    reviews: 1250,
    category: 'quran',
    language: 'Arabic/English',
    inStock: true,
    description: 'Complete Quran with accurate English translation and Arabic text',
    fullDescription: 'This beautiful edition of the Noble Quran features the original Arabic text alongside an accurate English translation by Dr. Muhammad Taqi-ud-Din Al-Hilali and Dr. Muhammad Muhsin Khan. The translation is known for its clarity and adherence to the original meaning, making it an excellent choice for both Arabic speakers and English readers seeking to understand the Quran. The book includes helpful footnotes and references to provide context and deeper understanding of the verses.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 1056,
      isbn: '978-9960-892-64-2',
      dimensions: '6.5 x 9.5 inches',
      weight: '2.8 lbs',
      binding: 'Hardcover'
    }
  },
  '2': {
    id: '2',
    title: 'Sahih Al-Bukhari Complete Set',
    author: 'Imam Al-Bukhari',
    price: 89.99,
    originalPrice: 120.00,
    images: [
      '/sahih-bukhari-books.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.8,
    reviews: 890,
    category: 'hadith',
    language: 'Arabic/English',
    inStock: true,
    description: 'The most authentic collection of Prophet Muhammad\'s sayings',
    fullDescription: 'Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari. It is considered the most authentic book after the Quran by the majority of Muslims. This complete set contains all 7,563 hadith, carefully authenticated and organized by topic. Each hadith includes the chain of narration and has been verified for authenticity according to the strictest standards.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 4200,
      isbn: '978-9960-717-31-3',
      dimensions: '7 x 10 inches',
      weight: '12 lbs',
      binding: 'Hardcover Set (9 Volumes)'
    }
  }
}

const relatedProducts = [
  {
    id: '3',
    title: 'Stories of the Prophets for Children',
    author: 'Ibn Kathir (Adapted)',
    price: 19.99,
    image: '/islamic-children-book-prophets.png',
    rating: 4.7
  },
  {
    id: '4',
    title: 'The Sealed Nectar - Biography of Prophet',
    author: 'Safi-ur-Rahman al-Mubarakpuri',
    price: 24.99,
    image: '/placeholder-au4fi.png',
    rating: 4.9
  },
  {
    id: '5',
    title: 'Fortress of the Muslim - Duas & Supplications',
    author: 'Sa\'id bin Wahf Al-Qahtani',
    price: 12.99,
    image: '/fortress-muslim-duas-book.png',
    rating: 4.8
  }
]

const reviews = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    rating: 5,
    date: '2024-01-10',
    comment: 'Excellent quality and authentic translation. The Arabic text is clear and the English translation is very accurate. Highly recommended for anyone wanting to understand the Quran better.',
    verified: true
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    rating: 5,
    date: '2024-01-08',
    comment: 'Beautiful book with high-quality printing. The binding is sturdy and will last for years. Perfect for daily reading and study.',
    verified: true
  },
  {
    id: 3,
    name: 'Omar Abdullah',
    rating: 4,
    date: '2024-01-05',
    comment: 'Good translation and presentation. The footnotes are helpful for understanding context. Delivery was fast and packaging was excellent.',
    verified: true
  }
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    const productInfo = productData[productId]
    if (productInfo) {
      setProduct(productInfo)
    }
  }, [productId])

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      })
    }
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.title} added to your cart.`,
    })
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        author: product.author
      })
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.replace('-', ' ').toUpperCase()}
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
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-green-600">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-500">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex space-x-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Authentic</p>
                  <p className="text-xs text-gray-600">Verified publishers</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">30-Day Returns</p>
                  <p className="text-xs text-gray-600">Easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">About This Book</h3>
                <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-900">Publisher:</span>
                    <span className="ml-2 text-gray-700">{product.specifications.publisher}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Pages:</span>
                    <span className="ml-2 text-gray-700">{product.specifications.pages}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">ISBN:</span>
                    <span className="ml-2 text-gray-700">{product.specifications.isbn}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Dimensions:</span>
                    <span className="ml-2 text-gray-700">{product.specifications.dimensions}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Weight:</span>
                    <span className="ml-2 text-gray-700">{product.specifications.weight}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Binding:</span>
                    <span className="ml-2 text-gray-700">{product.specifications.binding}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      <Link href={`/products/${relatedProduct.id}`} className="hover:text-green-600 transition-colors">
                        {relatedProduct.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{relatedProduct.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        ${relatedProduct.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

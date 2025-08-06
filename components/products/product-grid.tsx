'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  title: string
  author: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  language: string
  inStock: boolean
  description: string
}

const allProducts: Product[] = [
  {
    id: '1',
    title: 'The Noble Quran - Arabic & English',
    author: 'Translation by Dr. Muhammad Taqi-ud-Din',
    price: 29.99,
    originalPrice: 39.99,
    image: '/placeholder-34zy2.png',
    rating: 4.9,
    reviews: 1250,
    category: 'quran',
    language: 'Arabic/English',
    inStock: true,
    description: 'Complete Quran with accurate English translation and Arabic text'
  },
  {
    id: '2',
    title: 'Sahih Al-Bukhari Complete Set',
    author: 'Imam Al-Bukhari',
    price: 89.99,
    originalPrice: 120.00,
    image: '/sahih-bukhari-books.png',
    rating: 4.8,
    reviews: 890,
    category: 'hadith',
    language: 'Arabic/English',
    inStock: true,
    description: 'The most authentic collection of Prophet Muhammad\'s sayings'
  },
  {
    id: '3',
    title: 'Stories of the Prophets for Children',
    author: 'Ibn Kathir (Adapted)',
    price: 19.99,
    image: '/islamic-children-book-prophets.png',
    rating: 4.7,
    reviews: 650,
    category: 'kids',
    language: 'English',
    inStock: true,
    description: 'Engaging stories of prophets adapted for young readers'
  },
  {
    id: '4',
    title: 'The Sealed Nectar - Biography of Prophet',
    author: 'Safi-ur-Rahman al-Mubarakpuri',
    price: 24.99,
    image: '/placeholder-au4fi.png',
    rating: 4.9,
    reviews: 2100,
    category: 'islamic-studies',
    language: 'English',
    inStock: true,
    description: 'Comprehensive biography of Prophet Muhammad (PBUH)'
  },
  {
    id: '5',
    title: 'Fortress of the Muslim - Duas & Supplications',
    author: 'Sa\'id bin Wahf Al-Qahtani',
    price: 12.99,
    originalPrice: 16.99,
    image: '/fortress-muslim-duas-book.png',
    rating: 4.8,
    reviews: 1800,
    category: 'islamic-studies',
    language: 'Arabic/English',
    inStock: true,
    description: 'Essential duas and supplications for daily life'
  },
  {
    id: '6',
    title: 'Tafsir Ibn Kathir (Abridged)',
    author: 'Ibn Kathir',
    price: 149.99,
    image: '/tafsir-ibn-kathir-commentary.png',
    rating: 4.9,
    reviews: 750,
    category: 'quran',
    language: 'English',
    inStock: true,
    description: 'Classical Quranic commentary by the renowned scholar'
  },
  {
    id: '7',
    title: 'Sahih Muslim Complete Collection',
    author: 'Imam Muslim',
    price: 79.99,
    image: '/placeholder.svg?height=300&width=250',
    rating: 4.8,
    reviews: 680,
    category: 'hadith',
    language: 'Arabic/English',
    inStock: true,
    description: 'Second most authentic hadith collection after Bukhari'
  },
  {
    id: '8',
    title: 'My First Quran Storybook',
    author: 'Saniyasnain Khan',
    price: 15.99,
    image: '/placeholder.svg?height=300&width=250',
    rating: 4.6,
    reviews: 420,
    category: 'kids',
    language: 'English',
    inStock: true,
    description: 'Beautiful illustrated Quran stories for children'
  }
]

interface ProductGridProps {
  filters: {
    category: string
    priceRange: number[]
    language: string
    author: string
    inStock: boolean
  }
  sortBy: string
  viewMode: 'grid' | 'list'
}

export function ProductGrid({ filters, sortBy, viewMode }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    let filtered = allProducts.filter(product => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Language filter
      if (filters.language && !product.language.toLowerCase().includes(filters.language.toLowerCase())) {
        return false
      }

      // Author filter
      if (filters.author && !product.author.toLowerCase().includes(filters.author.toLowerCase())) {
        return false
      }

      // In stock filter
      if (filters.inStock && !product.inStock) {
        return false
      }

      return true
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // In a real app, you'd sort by creation date
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
    }

    setFilteredProducts(filtered)
  }, [filters.category, filters.priceRange[0], filters.priceRange[1], filters.language, filters.author, filters.inStock, sortBy])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = (product: Product) => {
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
        image: product.image,
        author: product.author
      })
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist.`,
      })
    }
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ShoppingCart className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-48 h-48 md:h-auto">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="secondary" className="text-xs mb-2">
                        {product.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        <Link href={`/products/${product.id}`} className="hover:text-green-600 transition-colors">
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-2">{product.author}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                      onClick={() => handleWishlistToggle(product)}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center space-x-1 mb-4">
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
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${product.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {product.originalPrice && (
                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white ${
                  isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                }`}
                onClick={() => handleWishlistToggle(product)}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>

              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                <Link href={`/products/${product.id}`} className="hover:text-green-600 transition-colors">
                  {product.title}
                </Link>
              </h3>

              <p className="text-sm text-gray-600 mb-2">{product.author}</p>

              <div className="flex items-center space-x-1 mb-3">
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
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{product.language}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

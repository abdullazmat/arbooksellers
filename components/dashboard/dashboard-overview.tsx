'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Heart, Package, Star, ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'

const recentOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 89.99,
    items: 3,
    image: '/placeholder-34zy2.png',
    title: 'The Noble Quran - Arabic & English'
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 24.99,
    items: 1,
    image: '/placeholder-au4fi.png',
    title: 'The Sealed Nectar - Biography of Prophet'
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-05',
    status: 'processing',
    total: 149.99,
    items: 2,
    image: '/tafsir-ibn-kathir-commentary.png',
    title: 'Tafsir Ibn Kathir (Abridged)'
  }
]

const recommendations = [
  {
    id: '7',
    title: 'Sahih Muslim Complete Collection',
    author: 'Imam Muslim',
    price: 79.99,
    image: '/placeholder.svg?height=150&width=120',
    rating: 4.8
  },
  {
    id: '8',
    title: 'My First Quran Storybook',
    author: 'Saniyasnain Khan',
    price: 15.99,
    image: '/placeholder.svg?height=150&width=120',
    rating: 4.6
  },
  {
    id: '9',
    title: 'Islamic Jurisprudence According to the Four Sunni Schools',
    author: 'Abd al-Rahman al-Jaziri',
    price: 45.99,
    image: '/placeholder.svg?height=150&width=120',
    rating: 4.7
  }
]

export function DashboardOverview() {
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Package className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your Islamic books collection
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+2 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/wishlist" className="text-sm text-green-600 hover:text-green-700">
                View wishlist →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cart Items</p>
                <p className="text-2xl font-bold text-gray-900">{cartItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/cart" className="text-sm text-green-600 hover:text-green-700">
                View cart →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-2">Based on your purchases</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={order.image || "/placeholder.svg"}
                  alt={order.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.title}
                    </p>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">{order.date}</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${order.total} • {order.items} {order.items === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recommended for You</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              Browse All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                <Link href={`/products/${book.id}`}>
                  <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">${book.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/products">
                <ShoppingBag className="h-6 w-6" />
                <span>Browse Books</span>
              </Link>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/dashboard/orders">
                <Package className="h-6 w-6" />
                <span>Track Orders</span>
              </Link>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/dashboard/profile">
                <Star className="h-6 w-6" />
                <span>Leave Review</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Islamic Quote */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6 text-center">
          <p className="text-2xl font-arabic text-green-700 mb-2">
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="text-green-600 text-sm">
            "And say: My Lord, increase me in knowledge" - Quran 20:114
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Eye, Star, MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const reviews = [
  {
    id: '1',
    product: {
      id: '1',
      title: 'The Noble Quran - Arabic & English',
      image: '/quran-islamic-books.png'
    },
    customer: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      avatar: '/ahmed-hassan-profile.png'
    },
    rating: 5,
    title: 'Excellent Translation',
    comment: 'This is an excellent translation of the Quran. The Arabic text is clear and the English translation is very accurate. Highly recommended for anyone wanting to understand the Quran better.',
    status: 'approved',
    date: '2024-01-15T10:30:00Z',
    helpful: 12,
    reported: false
  },
  {
    id: '2',
    product: {
      id: '2',
      title: 'Sahih Al-Bukhari Complete Set',
      image: '/sahih-bukhari-books.png'
    },
    customer: {
      name: 'Fatima Al-Zahra',
      email: 'fatima@example.com',
      avatar: '/fatima-ali-profile.png'
    },
    rating: 4,
    title: 'Great Collection',
    comment: 'Very comprehensive collection of authentic hadith. The translation is clear and the commentary is helpful. Would have given 5 stars but the binding could be better.',
    status: 'approved',
    date: '2024-01-14T15:45:00Z',
    helpful: 8,
    reported: false
  },
  {
    id: '3',
    product: {
      id: '3',
      title: 'Stories of the Prophets for Children',
      image: '/islamic-children-book-prophets.png'
    },
    customer: {
      name: 'Omar Abdullah',
      email: 'omar@example.com',
      avatar: '/omar-khan-profile.png'
    },
    rating: 5,
    title: 'Perfect for Kids',
    comment: 'My children love this book! The stories are engaging and the illustrations are beautiful. It\'s a great way to teach Islamic history to young ones.',
    status: 'pending',
    date: '2024-01-13T12:20:00Z',
    helpful: 3,
    reported: false
  },
  {
    id: '4',
    product: {
      id: '4',
      title: 'The Sealed Nectar - Biography of Prophet',
      image: '/the-sealed-nectar-book.png'
    },
    customer: {
      name: 'Aisha Rahman',
      email: 'aisha@example.com',
      avatar: '/aisha-rahman-profile.png'
    },
    rating: 2,
    title: 'Disappointing Quality',
    comment: 'The book arrived with damaged pages and the print quality is poor. Not worth the price. Would not recommend.',
    status: 'rejected',
    date: '2024-01-12T09:15:00Z',
    helpful: 1,
    reported: true
  },
  {
    id: '5',
    product: {
      id: '5',
      title: 'Fortress of the Muslim - Duas & Supplications',
      image: '/fortress-muslim-duas-book.png'
    },
    customer: {
      name: 'Ibrahim Khan',
      email: 'ibrahim@example.com',
      avatar: null
    },
    rating: 5,
    title: 'Essential Daily Duas',
    comment: 'This book contains all the essential duas for daily life. The Arabic text is clear and the transliteration is helpful for those learning Arabic.',
    status: 'approved',
    date: '2024-01-11T16:30:00Z',
    helpful: 15,
    reported: false
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
]

const ratingOptions = [
  { value: 'all', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' }
]

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedReview, setSelectedReview] = useState<any>(null)

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating
    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
            <p className="text-gray-600">Manage product reviews and customer feedback</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map(rating => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredReviews.length} reviews</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={review.product.image || "/placeholder.svg"}
                          alt={review.product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{review.product.title}</div>
                          <div className="text-sm text-gray-500">Product ID: {review.product.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={review.customer.avatar || undefined} />
                          <AvatarFallback>{review.customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.customer.name}</div>
                          <div className="text-sm text-gray-500">{review.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600 ml-1">({review.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{review.comment}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {review.helpful} found helpful
                          {review.reported && <span className="text-red-500 ml-2">• Reported</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(review.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(review.status)}
                          <span className="capitalize">{review.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(review.date)}</div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedReview(review)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Details</DialogTitle>
                            <DialogDescription>
                              Complete review information and moderation options
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Product Information */}
                            <div className="flex items-center space-x-4">
                              <img
                                src={review.product.image || "/placeholder.svg"}
                                alt={review.product.title}
                                className="h-16 w-16 rounded object-cover"
                              />
                              <div>
                                <h3 className="text-lg font-semibold">{review.product.title}</h3>
                                <p className="text-gray-600">Product ID: {review.product.id}</p>
                              </div>
                            </div>

                            {/* Customer Information */}
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={review.customer.avatar || undefined} />
                                <AvatarFallback>{review.customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{review.customer.name}</h4>
                                <p className="text-gray-600">{review.customer.email}</p>
                              </div>
                            </div>

                            {/* Review Content */}
                            <div>
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-600">({review.rating} stars)</span>
                                <Badge className={getStatusColor(review.status)}>
                                  {review.status}
                                </Badge>
                              </div>
                              <h5 className="font-semibold mb-2">{review.title}</h5>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <div className="text-sm text-gray-500">
                                Posted on {formatDate(review.date)} • {review.helpful} found helpful
                                {review.reported && <span className="text-red-500 ml-2">• This review has been reported</span>}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Edit Review</Button>
                            {review.status === 'pending' && (
                              <>
                                <Button variant="outline" className="text-green-600">Approve</Button>
                                <Button variant="outline" className="text-red-600">Reject</Button>
                              </>
                            )}
                            {review.status === 'approved' && (
                              <Button variant="outline" className="text-red-600">Reject</Button>
                            )}
                            {review.status === 'rejected' && (
                              <Button variant="outline" className="text-green-600">Approve</Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 
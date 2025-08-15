'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Download, 
  Eye,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { formatPrice } from '@/lib/utils'

interface Order {
  _id: string
  orderNumber: string
  total: number
  orderStatus: string
  createdAt: string
  items: Array<{
    title: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingNumber?: string
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, selectedStatus, currentPage])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/user/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
      setTotalPages(data.pagination.pages)
      setTotalOrders(data.pagination.total)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    setCurrentPage(1) // Reset to first page when status changes
  }

  const formatCurrency = (amount: number) => {
    return formatPrice(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">Track your orders and view order details</p>
        </div>
        <Button asChild>
          <Link href="/products">
            Continue Shopping
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {selectedStatus === 'all' 
                  ? "You haven't placed any orders yet."
                  : `No ${selectedStatus} orders found.`
                }
              </p>
              <Button asChild>
                <Link href="/products">
                  Start Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(order.total)}
                      </p>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.title}
                          className="h-8 w-8 rounded-full border-2 border-white"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.items.map(item => item.title).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </Button>
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Track Package
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Invoice
                    </Button>
                    {order.orderStatus === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Buy Again
                      </Button>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t bg-gray-50 p-6 mt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Items Ordered</h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.title}</h5>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatPrice((order.total * 0.9))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>{formatPrice((order.total * 0.05))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>{formatPrice((order.total * 0.05))}</span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="mt-6">
                            <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                            <div className="text-sm text-gray-600">
                              <p>{order.shippingAddress.street}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>

                          {order.trackingNumber && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-2">Tracking Information</h5>
                              <p className="text-sm text-blue-700">
                                Tracking Number: {order.trackingNumber}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(1)
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis */}
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Page numbers around current page */}
                    {(() => {
                      const pages = []
                      const startPage = Math.max(1, currentPage - 2)
                      const endPage = Math.min(totalPages, currentPage + 2)
                      
                      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                        pages.push(pageNum)
                      }
                      
                      return pages.map((pageNum) => (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(pageNum)
                            }}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    })()}
                    
                    {/* Ellipsis */}
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  Page {currentPage} of {totalPages} • {orders.length} orders per page • Total: {totalOrders} orders
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
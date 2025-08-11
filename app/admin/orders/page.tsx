'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Eye, 
  Truck,
  Package,
  Loader2,
  Calendar,
  User,
  DollarSign
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  items: Array<{
    product: {
      _id: string
      title: string
      images: string[]
    }
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
  paymentMethod: string
  orderStatus: string
  trackingNumber?: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrderStats {
  totalSales: number
  totalOrders: number
  pendingOrders: number
  processingOrders: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState({
    orderStatus: '',
    trackingNumber: '',
    notes: '',
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
      setStats(data.stats)
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

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOrder) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      toast({
        title: 'Success',
        description: 'Order updated successfully',
      })

      setIsUpdateDialogOpen(false)
      setSelectedOrder(null)
      setUpdateData({ orderStatus: '', trackingNumber: '', notes: '' })
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      })
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleUpdateOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setUpdateData({
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || '',
    })
    setIsUpdateDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and track shipments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processingOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders by order number or customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchOrders}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>
              {orders.length} orders found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-gray-600">{order.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{order.items.length} items</span>
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <img
                                key={index}
                                src={item.image}
                                alt={item.title}
                                className="h-6 w-6 rounded-full border-2 border-white"
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                                <span className="text-xs">+{order.items.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-gray-600">{order.items.length} items</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateOrderClick(order)}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && orders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                View complete order information
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Order Information</h3>
                    <p className="text-sm text-gray-600">#{selectedOrder.orderNumber}</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Customer Information</h3>
                    <p className="text-sm">{selectedOrder.user.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
                    {selectedOrder.user.phone && (
                      <p className="text-sm text-gray-600">{selectedOrder.user.phone}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-gray-600">
                            Total: {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="p-3 border rounded bg-gray-50">
                    <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Order Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Update order status and tracking information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Status</label>
                <Select value={updateData.orderStatus} onValueChange={(value) => setUpdateData({ ...updateData, orderStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tracking Number</label>
                <Input
                  value={updateData.trackingNumber}
                  onChange={(e) => setUpdateData({ ...updateData, trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  placeholder="Add any notes about this order"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Order
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
} 
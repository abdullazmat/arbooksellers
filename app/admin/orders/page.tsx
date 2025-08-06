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
import { Search, Eye, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const orders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+1 (555) 123-4567'
    },
    items: [
      { id: '1', title: 'The Noble Quran - Arabic & English', quantity: 1, price: 29.99 },
      { id: '2', title: 'Sahih Al-Bukhari Complete Set', quantity: 1, price: 89.99 }
    ],
    total: 119.98,
    status: 'completed',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Islamic Way',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    orderDate: '2024-01-15T10:30:00Z',
    shippingDate: '2024-01-16T14:20:00Z',
    deliveryDate: '2024-01-18T11:45:00Z',
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Fatima Al-Zahra',
      email: 'fatima@example.com',
      phone: '+1 (555) 987-6543'
    },
    items: [
      { id: '3', title: 'Stories of the Prophets for Children', quantity: 2, price: 19.99 }
    ],
    total: 39.98,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Faith Street',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    orderDate: '2024-01-15T15:45:00Z',
    shippingDate: null,
    deliveryDate: null,
    trackingNumber: null
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Omar Abdullah',
      email: 'omar@example.com',
      phone: '+1 (555) 456-7890'
    },
    items: [
      { id: '4', title: 'The Sealed Nectar - Biography of Prophet', quantity: 1, price: 24.99 },
      { id: '5', title: 'Fortress of the Muslim - Duas & Supplications', quantity: 1, price: 12.99 }
    ],
    total: 37.98,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Peace Avenue',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    orderDate: '2024-01-14T09:15:00Z',
    shippingDate: '2024-01-15T16:30:00Z',
    deliveryDate: null,
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Aisha Rahman',
      email: 'aisha@example.com',
      phone: '+1 (555) 321-6547'
    },
    items: [
      { id: '6', title: 'Tafsir Ibn Kathir (Abridged)', quantity: 1, price: 149.99 }
    ],
    total: 149.99,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '321 Wisdom Road',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      country: 'USA'
    },
    orderDate: '2024-01-13T11:20:00Z',
    shippingDate: null,
    deliveryDate: null,
    trackingNumber: null
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">Manage customer orders and shipping</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
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
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredOrders.length} orders</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.map(item => item.title).join(', ')}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(order.orderDate)}</div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                            <DialogDescription>
                              Complete order information and customer details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Name:</span> {order.customer.name}
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span> {order.customer.email}
                                </div>
                                <div>
                                  <span className="font-medium">Phone:</span> {order.customer.phone}
                                </div>
                                <div>
                                  <span className="font-medium">Payment Status:</span>
                                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="ml-2">
                                    {order.paymentStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                              <div className="text-sm">
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                                {order.shippingAddress.country}
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                      <div className="font-medium">{item.title}</div>
                                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                  </div>
                                ))}
                                <div className="border-t pt-2 flex justify-between items-center font-bold">
                                  <span>Total:</span>
                                  <span>${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Timeline */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Order Timeline</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Order Placed:</span>
                                  <span>{formatDate(order.orderDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipped:</span>
                                  <span>{formatDate(order.shippingDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Delivered:</span>
                                  <span>{formatDate(order.deliveryDate)}</span>
                                </div>
                                {order.trackingNumber && (
                                  <div className="flex justify-between">
                                    <span>Tracking Number:</span>
                                    <span className="font-mono">{order.trackingNumber}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Update Status</Button>
                            <Button>Print Invoice</Button>
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
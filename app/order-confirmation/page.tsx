'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ShoppingBag, Home, Download, Truck, Package, MapPin, Mail, Phone } from 'lucide-react'
import React from 'react'
import { formatPrice } from '@/lib/utils'

interface OrderDetails {
  orderNumber: string
  items: Array<{
    title: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  estimatedDelivery: string
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastOrder')
      if (stored) {
        const order = JSON.parse(stored)
        const details: OrderDetails = {
          orderNumber: order.orderNumber || `ORD-${order._id?.slice(-8)?.toUpperCase() || Math.floor(Math.random()*1e8).toString().padStart(8,'0')}`,
          items: order.items?.map((it: any) => ({
            title: it.title,
            price: it.price,
            quantity: it.quantity,
            image: it.image,
          })) || [],
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : order.paymentMethod,
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          tax: order.tax,
          total: order.total,
          estimatedDelivery: '3-5 business days',
        }
        setOrderDetails(details)
      }
    } catch {}
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!orderDetails) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your order has been successfully placed and is being processed.
            </p>
            <p className="text-gray-500">
              Order #{orderDetails.orderNumber}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Order Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
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
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Shipping Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Delivery Address</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        <p>{orderDetails.shippingAddress.fullName}</p>
                        <p>{orderDetails.shippingAddress.address}</p>
                        <p>
                          {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                        </p>
                        <p>{orderDetails.shippingAddress.country}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Contact Info</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        <p>{orderDetails.shippingAddress.email}</p>
                        <p>{orderDetails.shippingAddress.phone}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Estimated Delivery</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        <p>{orderDetails.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Order #{orderDetails.orderNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice((orderDetails.total * 0.9))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice((orderDetails.total * 0.05))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice((orderDetails.total * 0.05))}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(orderDetails.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>You'll receive an email confirmation shortly</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>We'll notify you when your order ships</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>Track your order in your dashboard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/dashboard/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View My Orders
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our customer support team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">support@islamicbooks.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 
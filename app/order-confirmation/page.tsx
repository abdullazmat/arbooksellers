'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ShoppingBag, Home, Download, Truck, Package, MapPin, Mail, Phone, ShieldCheck, Clock } from 'lucide-react'
import React from 'react'
import { formatPrice } from '@/lib/utils'
import { downloadInvoiceAsPDF } from '@/lib/invoice'
import { useToast } from '@/hooks/use-toast'

interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  const handleDownloadInvoice = () => {
    if (!orderDetails) return;
    
    try {
      const invoiceData = {
        orderNumber: orderDetails.orderNumber,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: orderDetails.items,
        shippingAddress: {
          fullName: orderDetails.shippingAddress.fullName,
          email: orderDetails.shippingAddress.email,
          phone: orderDetails.shippingAddress.phone,
          address: orderDetails.shippingAddress.address,
          city: orderDetails.shippingAddress.city,
          state: orderDetails.shippingAddress.state,
          zipCode: orderDetails.shippingAddress.zipCode,
          country: orderDetails.shippingAddress.country
        },
        paymentMethod: orderDetails.paymentMethod,
        subtotal: orderDetails.subtotal,
        shippingCost: orderDetails.shippingCost,
        total: orderDetails.total
      };

      downloadInvoiceAsPDF(invoiceData);
      
      toast({
        title: "Invoice Generated",
        description: "Invoice has been opened in a new window. You can print or save it.",
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastOrder')
      if (stored) {
        const order = JSON.parse(stored)
        const details: OrderDetails = {
          orderNumber: order.orderNumber || order._id.slice(-6),
          orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          items: order.items.map((item: any) => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingAddress: {
            fullName: order.shippingAddress.fullName || order.shippingAddress.street,
            email: order.shippingAddress.email || 'customer@example.com',
            phone: order.shippingAddress.phone || '',
            address: order.shippingAddress.street || order.shippingAddress.address || '',
            city: order.shippingAddress.city || '',
            state: order.shippingAddress.state || '',
            zipCode: order.shippingAddress.zipCode || '',
            country: order.shippingAddress.country || ''
          },
          paymentMethod: order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : order.paymentMethod || "Cash on Delivery",
          subtotal: order.subtotal || 0,
          shippingCost: order.shippingCost || 0,
          total: order.total,
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
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-xl text-green-100 mb-2 max-w-2xl mx-auto">
              Thank you for your order! Your Islamic books are being prepared with care.
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mt-6">
              <Package className="h-5 w-5" />
              <span className="font-semibold">Order #{orderDetails.orderNumber}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 -mt-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content - Order Details & Shipping */}
            <div className="xl:col-span-2 space-y-8">
              {/* Order Items */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Order Items</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                          <p className="text-gray-600">
                            Unit Price: {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Shipping Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Delivery Address */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Delivery Address</h4>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{orderDetails.shippingAddress.fullName}</p>
                        <p className="text-gray-700">{orderDetails.shippingAddress.address}</p>
                        <p className="text-gray-700">
                          {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                        </p>
                        <p className="text-gray-700">{orderDetails.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Contact & Delivery Info */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Contact & Delivery</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="font-medium text-gray-900">{orderDetails.shippingAddress.email}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <p className="font-medium text-gray-900">{orderDetails.shippingAddress.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatPrice(orderDetails.shippingCost)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(orderDetails.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Method</span>
                      <span className="font-medium">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Payment Pending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span>What's Next?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Email confirmation sent to your inbox</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Order processing and preparation</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Shipping notification when ready</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Track your order in dashboard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg" asChild>
                  <Link href="/dashboard/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View My Orders
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-2 hover:bg-gray-50" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
                  onClick={handleDownloadInvoice}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-16 text-center">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Need Help?
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Our customer support team is here to help with any questions about your order.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">support@islamicbooks.com</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">+92 (300) 123-4567</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 
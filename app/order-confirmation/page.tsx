'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Home, Package, Mail } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear any cart data from localStorage if needed
    // This ensures a fresh start after order completion
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </CardTitle>
            <p className="text-lg text-gray-600">
              Thank you for your order. We've received your request and will begin processing it right away.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                What happens next?
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>We'll send you an email confirmation with your order details</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Our team will review and process your order within 24 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>You'll receive shipping updates via email</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Your order will be delivered within 3-5 business days</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Need help?
              </h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about your order, please don't hesitate to contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> support@islamicbooks.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/orders">
                  <Package className="mr-2 h-4 w-4" />
                  View Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
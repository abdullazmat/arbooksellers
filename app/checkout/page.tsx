'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { CheckCircle, Loader2, Truck, DollarSign, ShieldCheck, ShoppingCart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function CheckoutPage() {
  const { items: cartItems, total: cartTotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
      toast({
        title: 'Your cart is empty!',
        description: 'Please add items to your cart before checking out.',
        variant: 'destructive',
      })
    }
  }, [cartItems, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required.'
    if (!formData.address.trim()) newErrors.address = 'Address is required.'
    if (!formData.city.trim()) newErrors.city = 'City is required.'
    if (!formData.state.trim()) newErrors.state = 'State/Province is required.'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip Code is required.'
    if (!formData.country.trim()) newErrors.country = 'Country is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call for order placement
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real application, you would send formData and cartItems to your backend
      console.log('Order placed:', {
        shippingInfo: formData,
        paymentMethod,
        items: cartItems,
        total: cartTotal,
      })

      clearCart()
      toast({
        title: 'Order Placed Successfully!',
        description: 'Your order has been received and will be processed shortly.',
        variant: 'success',
      })
      router.push('/order-confirmation') // Redirect to a confirmation page
    } catch (error) {
      console.error('Order placement failed:', error)
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const shippingCost = cartTotal >= 50 ? 0 : 5.00 // Free shipping over $50
  const taxRate = 0.08 // Example tax rate
  const taxAmount = cartTotal * taxRate
  const finalTotal = cartTotal + shippingCost + taxAmount

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4 animate-bounce-y" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button className="gradient-primary hover:shadow-islamic transition-all duration-300">
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 gradient-text animate-fade-in-down">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <Card className="lg:col-span-2 glass shadow-modern border border-white/20 animate-fade-in-left stagger-1">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-islamic-green-700">Shipping Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please provide your delivery details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className={errors.fullName ? 'border-red-500' : ''} />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={errors.phone ? 'border-red-500' : ''} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" className={errors.address ? 'border-red-500' : ''} />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="New York" className={errors.city ? 'border-red-500' : ''} />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State/Province <span className="text-red-500">*</span></Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} placeholder="NY" className={errors.state ? 'border-red-500' : ''} />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code <span className="text-red-500">*</span></Label>
                <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="10001" className={errors.zipCode ? 'border-red-500' : ''} />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="United States" className={errors.country ? 'border-red-500' : ''} />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Deliver after 5 PM, leave at front door." rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary & Payment */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Order Summary */}
          <Card className="glass shadow-modern border border-white/20 animate-fade-in-right stagger-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-islamic-green-700">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} width={64} height={64} className="rounded-md object-cover" />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({taxRate * 100}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="glass shadow-modern border border-white/20 animate-fade-in-right stagger-3">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-islamic-green-700">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <Label htmlFor="cash_on_delivery" className="flex items-center gap-3 cursor-pointer p-4 border rounded-lg hover:bg-islamic-green-50 transition-colors has-[:checked]:border-islamic-green-500 has-[:checked]:bg-islamic-green-50">
                  <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" className="peer" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-islamic-green-600" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-sm text-muted-foreground">Pay with cash when your order arrives.</p>
                  </div>
                </Label>
              </RadioGroup>
              <div className="mt-4 p-4 bg-islamic-green-50 rounded-lg text-sm text-islamic-green-800 flex items-center gap-2 animate-fade-in-up stagger-4">
                <ShieldCheck className="h-5 w-5 text-islamic-green-600" />
                <span>Your payment is securely handled upon delivery.</span>
              </div>
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button
            type="submit"
            className="w-full h-14 text-lg rounded-full gradient-primary shadow-islamic hover:shadow-lg transition-all duration-300 animate-fade-in-up stagger-5"
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <Truck className="mr-2 h-5 w-5" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

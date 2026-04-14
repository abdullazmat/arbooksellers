'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart()
  const { toast } = useToast()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string, title: string) => {
    removeItem(id)
    toast({
      title: "Item removed",
      description: `${title} has been removed from your cart.`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  /* ───── Empty state ───── */
  if (itemCount === 0) {
    return (
      <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
        <Header />
        <main className="flex-grow bg-background flex flex-col items-center justify-center px-5 py-24 relative overflow-hidden">
          {/* Soft blurred blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-islamic-green-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="text-center max-w-md mx-auto relative z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-border/50 dark:border-zinc-700 flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-islamic-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
              Looks like you haven&apos;t added anything yet. Browse our collection and find something you love.
            </p>
            <Button
              className="bg-islamic-green-600 hover:bg-islamic-green-700 text-white h-12 sm:h-14 px-8 sm:px-10 rounded-xl font-bold text-sm shadow-lg transition-all"
              asChild
            >
              <Link href="/products">
                Browse Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  /* ───── Cart with items ───── */
  const shipping = total >= 50 ? 0 : 9.99
  const finalTotal = total + shipping

  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <main className="flex-grow bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Page header */}
          <div className="mb-8 sm:mb-10 lg:mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <Badge className="bg-islamic-green-600 text-white border-none px-3 py-1 text-[11px] font-semibold rounded-full shadow mb-2">
                  Shopping Cart
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                  Your Cart
                </h1>
              </div>
              <p className="text-sm sm:text-base font-medium text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* ── Items list ── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="animate-in fade-in duration-500">
                  <div className="flex gap-4 sm:gap-5 bg-white dark:bg-zinc-800/50 border border-border/40 dark:border-zinc-700/50 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-islamic-green-200 dark:hover:border-zinc-600 transition-all duration-300">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.id}`}
                      className="w-20 h-20 sm:w-28 sm:h-28 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 flex items-center justify-center border border-border/20 dark:border-zinc-700/30 shrink-0 overflow-hidden hover:scale-[1.03] transition-transform"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                      {/* Top row: title + delete */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <Link href={`/products/${item.id}`} className="block">
                            <h3 className="text-sm sm:text-base font-bold text-foreground hover:text-islamic-green-600 transition-colors leading-snug line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-islamic-green-500" />
                              <span className="text-xs font-medium text-islamic-green-600">In Stock</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Bottom row: quantity + price */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-700/50 rounded-xl p-0.5 border border-border/30 dark:border-zinc-600/30">
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-600 text-foreground transition-all disabled:opacity-30"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-9 text-center font-bold text-sm tabular-nums text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-600 text-foreground transition-all"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Actions row */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-500/5 rounded-xl h-11 font-semibold text-sm transition-all"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl h-11 font-semibold text-sm border-border/50 dark:border-zinc-700 hover:bg-foreground hover:text-background transition-all"
                  asChild
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>

            {/* ── Order summary sidebar ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                {/* Summary card */}
                <Card className="bg-foreground dark:bg-zinc-800 text-background dark:text-foreground rounded-2xl overflow-hidden shadow-xl border-none dark:border dark:border-zinc-700">
                  <CardContent className="p-5 sm:p-6">
                    <h2 className="text-lg font-extrabold mb-5 tracking-tight">Order Summary</h2>

                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-70">Subtotal</span>
                        <span className="font-bold text-sm">{formatPrice(total)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-70">Shipping</span>
                        {shipping === 0 ? (
                          <Badge className="bg-islamic-green-600 text-white border-none font-semibold text-xs px-2.5 py-0.5 rounded-full">
                            Free
                          </Badge>
                        ) : (
                          <span className="font-bold text-sm">{formatPrice(shipping)}</span>
                        )}
                      </div>

                      {shipping > 0 && (
                        <p className="text-xs opacity-50 leading-relaxed">
                          Free shipping on orders over {formatPrice(50)}
                        </p>
                      )}

                      <div className="pt-4 border-t border-background/15 dark:border-zinc-600">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-extrabold">Total</span>
                          <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                            {formatPrice(finalTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-islamic-green-600 hover:bg-islamic-green-700 text-white h-12 sm:h-14 rounded-xl font-bold text-sm shadow-lg transition-all border-none group"
                      asChild
                    >
                      <Link href="/checkout" className="flex items-center justify-center">
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs opacity-40 font-medium">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Secure checkout</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust badges */}
                <Card className="bg-white dark:bg-zinc-800/50 border border-border/40 dark:border-zinc-700/50 rounded-2xl p-4 sm:p-5">
                  <div className="space-y-4">
                    {[
                      { icon: Truck, label: "Fast Delivery", desc: "1–3 days in Lahore, 3–5 days across Pakistan" },
                      { icon: CreditCard, label: "Safe Payment", desc: "Your payment info stays protected" },
                      { icon: RotateCcw, label: "Easy Returns", desc: "Return within 7 days, no hassle" },
                    ].map((trust, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-9 h-9 bg-islamic-green-50 dark:bg-zinc-700/50 rounded-lg flex items-center justify-center text-islamic-green-600 shrink-0">
                          <trust.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{trust.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{trust.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

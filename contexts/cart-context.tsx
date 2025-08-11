'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })

    toast({
      title: 'Added to Cart',
      description: `${newItem.title} has been added to your cart`,
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    const itemToRemove = items.find(item => item.id === id)
    setItems(prevItems => prevItems.filter(item => item.id !== id))
    
    if (itemToRemove) {
      toast({
        title: 'Removed from Cart',
        description: `${itemToRemove.title} has been removed from your cart`,
      })
    }
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart',
    })
  }

  const getItemQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  // Calculate totals
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

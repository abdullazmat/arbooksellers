'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { useToast } from '@/hooks/use-toast'

interface WishlistItem {
  product: string
  title: string
  price: number
  image: string
  author: string
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  addItem: (productId: string, productData: Omit<WishlistItem, 'product'>) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
  loadWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Load wishlist when user logs in
  useEffect(() => {
    if (user && token) {
      loadWishlist()
    } else {
      setItems([])
    }
  }, [user, token])

  const loadWishlist = async () => {
    if (!user || !token) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.wishlist || [])
      } else {
        console.error('Failed to load wishlist')
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (productId: string, productData: Omit<WishlistItem, 'product'>) => {
    if (!user || !token) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your wishlist',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (response.ok) {
        setItems(data.wishlist)
        toast({
          title: 'Added to Wishlist',
          description: `${productData.title} has been added to your wishlist`,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add item to wishlist',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    if (!user || !token) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setItems(data.wishlist)
        toast({
          title: 'Removed from Wishlist',
          description: 'Item has been removed from your wishlist',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to remove item from wishlist',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearWishlist = async () => {
    if (!user || !token) return

    try {
      setIsLoading(true)
      // Note: You might want to add a clear all endpoint to your API
      // For now, we'll remove items one by one
      const promises = items.map(item => 
        fetch(`/api/wishlist?productId=${item.product}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      )

      await Promise.all(promises)
      setItems([])
      toast({
        title: 'Wishlist Cleared',
        description: 'All items have been removed from your wishlist',
      })
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast({
        title: 'Error',
        description: 'Failed to clear wishlist',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

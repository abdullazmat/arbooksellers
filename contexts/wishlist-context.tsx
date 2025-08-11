'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { useToast } from '@/hooks/use-toast'

interface WishlistItem {
  product: string | { _id: string } | any // Handle both string ID and populated object
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
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Helper function to safely extract product ID
  const getProductId = (item: WishlistItem): string => {
    if (typeof item.product === 'string') {
      return item.product;
    } else if (item.product && typeof item.product === 'object' && '_id' in item.product) {
      return (item.product as any)._id.toString();
    }
    return String(item.product || '');
  }

  // Load wishlist when user logs in
  useEffect(() => {
    console.log('Wishlist effect triggered:', { user: !!user, token: !!token, isLoading, hasLoaded })
    
    if (user && token && !isLoading && !hasLoaded) {
      console.log('Loading wishlist...')
      loadWishlist()
    } else if (!user) {
      console.log('No user, clearing wishlist')
      setItems([])
      setHasLoaded(false)
    }
  }, [user, token, isLoading, hasLoaded])

  const loadWishlist = async () => {
    if (!user || !token) {
      console.log('Cannot load wishlist: user or token not available')
      return
    }

    if (hasLoaded) {
      console.log('Wishlist already loaded, skipping')
      return
    }

    console.log('Making wishlist API call...')
    try {
      setIsLoading(true)
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('Wishlist API response:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('Wishlist data received:', data)
        setItems(data.wishlist || [])
        setHasLoaded(true)
      } else if (response.status === 401) {
        console.log('Unauthorized access to wishlist, clearing items')
        setItems([])
        setHasLoaded(false)
      } else {
        console.error('Failed to load wishlist:', response.status, response.statusText)
        // Don't clear items on other errors, just log the error
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      // Don't clear items on network errors, just log the error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshWishlist = async () => {
    setHasLoaded(false)
    await loadWishlist()
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
        setHasLoaded(true)
        toast({
          title: 'Added to Wishlist',
          description: `${productData.title} has been added to your wishlist`,
        })
      } else if (response.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again to continue',
          variant: 'destructive',
        })
        // Clear items and reset loaded state
        setItems([])
        setHasLoaded(false)
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
        title: 'Network Error',
        description: 'Failed to add item to wishlist. Please try again.',
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
      } else if (response.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again to continue',
          variant: 'destructive',
        })
        // Clear items and reset loaded state
        setItems([])
        setHasLoaded(false)
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
        title: 'Network Error',
        description: 'Failed to remove item from wishlist. Please try again.',
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
        fetch(`/api/wishlist?productId=${getProductId(item)}`, {
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
    return items.some(item => getProductId(item) === productId)
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
        refreshWishlist,
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

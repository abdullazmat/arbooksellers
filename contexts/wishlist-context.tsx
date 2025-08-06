'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

interface WishlistItem {
  id: string
  title: string
  price: number
  image: string
}

interface WishlistState {
  items: WishlistItem[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'CLEAR_WISHLIST' }

const WishlistContext = createContext<{
  state: WishlistState
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  items: WishlistItem[] // Expose items directly
} | null>(null)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.items.find(item => item.id === action.payload.id)) {
        return state // Item already in wishlist
      }
      return { items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(item => item.id !== action.payload) }
    case 'LOAD_WISHLIST':
      return { items: action.payload }
    case 'CLEAR_WISHLIST':
      return { items: [] }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist })
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: WishlistItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        items: state.items, // Expose items directly
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

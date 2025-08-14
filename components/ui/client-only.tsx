"use client"

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 
'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { ClientOnly } from '@/components/ui/client-only'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ClientOnly fallback={<div style={{ visibility: 'hidden' }}>{children}</div>}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ClientOnly>  
    
  )
}

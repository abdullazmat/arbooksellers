import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Stable date formatting utility that won't cause hydration issues
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-US', defaultOptions)
  } catch (error) {
    return 'Invalid Date'
  }
}

// Stable date formatting with time
export function formatDateTime(dateString: string) {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Price formatting utility for Indian/Pakistani format (Rs 12,34,000)
export function formatPrice(amount: number, currency: string = 'Rs') {
  try {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return `${currency} 0`
    }

    // Convert to string and split by decimal point
    const parts = amount.toString().split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1] || '00'

    // Add commas for Indian/Pakistani number system (every 2 digits from right, except first 3)
    let formattedInteger = ''
    const length = integerPart.length
    
    for (let i = 0; i < length; i++) {
      if (i > 0 && (length - i) % 2 === 0 && i !== length - 3) {
        formattedInteger += ','
      }
      formattedInteger += integerPart[i]
    }

    // Format decimal part to always show 2 digits
    const formattedDecimal = decimalPart.padEnd(2, '0').slice(0, 2)

    return `${currency} ${formattedInteger}${formattedDecimal !== '00' ? `.${formattedDecimal}` : ''}`
  } catch (error) {
    console.error('Error formatting price:', error)
    return `${currency} 0`
  }
}

// Price formatting with decimal places option
export function formatPriceWithDecimals(amount: number, currency: string = 'Rs', decimals: number = 2) {
  try {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return `${currency} 0`
    }

    // Convert to string and split by decimal point
    const parts = amount.toString().split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1] || ''

    // Add commas for Indian/Pakistani number system
    let formattedInteger = ''
    const length = integerPart.length
    
    for (let i = 0; i < length; i++) {
      if (i > 0 && (length - i) % 2 === 0 && i !== length - 3) {
        formattedInteger += ','
      }
      formattedInteger += integerPart[i]
    }

    if (decimals === 0) {
      return `${currency} ${formattedInteger}`
    }

    // Format decimal part
    const formattedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals)
    return `${currency} ${formattedInteger}${formattedDecimal !== '0'.repeat(decimals) ? `.${formattedDecimal}` : ''}`
  } catch (error) {
    console.error('Error formatting price:', error)
    return `${currency} 0`
  }
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-8)}-${random}`;
}

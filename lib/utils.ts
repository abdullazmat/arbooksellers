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

    // Convert to integer (remove decimal places for display)
    const integerAmount = Math.floor(amount)
    
    // Use standard number formatting with Indian locale
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    
    return `${currency} ${formatter.format(integerAmount)}`
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

    // Use standard number formatting with Indian locale
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
    
    return `${currency} ${formatter.format(amount)}`
  } catch (error) {
    console.error('Error formatting price:', error)
    return `${currency} 0`
  }
}

// Generate unique order number
export function generateOrderNumber(): string {
  // Generate a 6-digit numeric order number
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const orderNumber = (timestamp % 1000000 + random) % 1000000;
  const paddedOrderNumber = orderNumber.toString().padStart(6, '0');
  
  return paddedOrderNumber;
}

export function clearExpiredAdminTokens() {
  try {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      const tokenPayload = JSON.parse(atob(adminToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        return true; // Token was expired and cleared
      }
    }
    return false; // No expired token found
  } catch (error) {
    // If we can't parse the token, clear it anyway
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return true; // Token was invalid and cleared
  }
}

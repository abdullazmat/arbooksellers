import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import Category from '@/models/Category'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'
  
  // Define static routes in order of priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ]

  try {
    // Attempt to fetch dynamic products for the sitemap
    await dbConnect()
    
    // Fetch products
    const products = await Product.find({}, '_id updatedAt slug').limit(50000).lean()
    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug || product._id.toString()}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      priority: 0.9,
    }))

    // Return combined routes
    // Priority order: Home(1.0) -> Products(0.9) -> Single Products(0.8) -> Static Pages(0.7)
    return [
      staticRoutes[0], // Home
      staticRoutes[1], // Products List
      ...productRoutes, // Individual Products
      ...staticRoutes.slice(2), // About, Contact, Privacy, Terms
    ]
  } catch (error) {
    // If DB fails, return only static routes to keep the site functional
    console.error('Error fetching data for sitemap:', error)
    return staticRoutes
  }
}

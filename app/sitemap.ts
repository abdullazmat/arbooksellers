import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import Category from '@/models/Category'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arbooksellers.com'
  
  // Define static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  try {
    // Attempt to fetch dynamic products for the sitemap
    await dbConnect()
    
    // Fetch categories
    const categories = await Category.find({ isActive: true }, 'slug updatedAt').lean()
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Fetch products
    const products = await Product.find({}, '_id updatedAt slug').limit(50000).lean()
    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug || product._id.toString()}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch (error) {
    // If DB fails, return only static routes to keep the site functional
    console.error('Error fetching data for sitemap:', error)
    return staticRoutes
  }
}

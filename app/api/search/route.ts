import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        products: [],
        total: 0,
        page: 1,
        pages: 1,
        query: ''
      });
    }

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      inStock: true // Only show in-stock products
    };

    // Execute search with pagination
    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .sort({ featured: -1, createdAt: -1 }) // Featured products first, then by creation date
        .skip(skip)
        .limit(limit)
        .select('title author price originalPrice images featured inStock categories')
        .lean(),
      Product.countDocuments(searchQuery)
    ]);

    // Calculate pagination
    const pages = Math.ceil(total / limit);

    // Transform products for search results
    const transformedProducts = products.map(product => ({
      _id: product._id,
      title: product.title,
      author: product.author || 'Unknown',
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images || [],
      featured: product.featured || false,
      inStock: product.inStock,
      categories: product.categories || [],
      discount: product.originalPrice && product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0
    }));

    return NextResponse.json({
      products: transformedProducts,
      total,
      page,
      pages,
      query: query.trim(),
      hasResults: total > 0
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

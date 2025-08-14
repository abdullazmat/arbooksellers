import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import Comment from '@/models/Comment'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { size: { $regex: search, $options: 'i' } },
        { paper: { $regex: search, $options: 'i' } },
        { binding: { $regex: search, $options: 'i' } },
      ]
    }

    if (featured === 'true') {
      query.featured = true
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }

    // Build sort object
    let sortObj: any = {}
    switch (sort) {
      case 'price-low':
        sortObj.price = 1
        break
      case 'price-high':
        sortObj.price = -1
        break
      case 'rating':
        sortObj.rating = -1
        break
      case 'oldest':
        sortObj.createdAt = 1
        break
      default: // newest
        sortObj.createdAt = -1
    }

    // Get products with rating aggregation
    const products = await Product.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'comments',
          let: { productIdStr: { $toString: '$_id' } },
          as: 'comments',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$productIdStr'] },
                    { $eq: ['$isApproved', true] }
                  ]
                }
              }
            }
          ]
        }
      },
      {
        $addFields: {
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $round: [{ $avg: '$comments.rating' }, 1] },
              else: 0
            }
          },
          reviews: { $size: '$comments' }
        }
      },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit }
    ])

    // Get total count
    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error: any) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
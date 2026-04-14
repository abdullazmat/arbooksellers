import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    
    // Determine if we should query by ID or Slug
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const matchQuery = isObjectId 
      ? { _id: new mongoose.Types.ObjectId(id) } 
      : { slug: id.toLowerCase().trim() };

    // Get product with rating aggregation
    const products = await Product.aggregate([
      { $match: matchQuery },
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
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'subcategory',
          foreignField: '_id',
          as: 'subcategory'
        }
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category', 0] },
          subcategory: { $arrayElemAt: ['$subcategory', 0] },
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $round: [{ $avg: '$comments.rating' }, 1] },
              else: 0
            }
          },
          reviews: { $size: '$comments' }
        }
      }
    ]);

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[0];

    return NextResponse.json({
      product,
    });

  } catch (error: any) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
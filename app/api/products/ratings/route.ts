import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productIds = searchParams.get("productIds");
    
    if (!productIds) {
      return NextResponse.json(
        { error: "Product IDs are required" },
        { status: 400 }
      );
    }

    const ids = productIds.split(",").filter(Boolean);
    
    if (ids.length === 0) {
      return NextResponse.json({ ratings: {} });
    }

    // Get ratings data efficiently
    const ratingsData = await Comment.aggregate([
      { 
        $match: { 
          productId: { $in: ids }, 
          isApproved: true 
        } 
      },
      { 
        $group: { 
          _id: '$productId', 
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to map for easy lookup
    const ratingsMap: Record<string, { rating: number; reviews: number }> = {};
    ratingsData.forEach((r: any) => {
      ratingsMap[r._id] = {
        rating: Math.round(r.avgRating * 10) / 10,
        reviews: r.count
      };
    });

    return NextResponse.json({ ratings: ratingsMap });
  } catch (error: any) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

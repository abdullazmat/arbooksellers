import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

function sanitizePublicImages(images: unknown): string[] {
  if (!Array.isArray(images)) return ["/placeholder.jpg"];

  const cleaned = images.filter(
    (img): img is string => typeof img === "string" && !img.startsWith("data:"),
  );

  return cleaned.length > 0 ? cleaned : ["/placeholder.jpg"];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
          from: "comments",
          let: { productIdStr: { $toString: "$_id" } },
          as: "comments",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$productIdStr"] },
                    { $eq: ["$isApproved", true] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subcategory",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
          subcategory: { $arrayElemAt: ["$subcategory", 0] },
          rating: {
            $let: {
              vars: {
                dynamicComments: "$comments",
                customReviews: { $ifNull: ["$reviews", []] },
              },
              in: {
                $let: {
                  vars: {
                    totalRating: { $add: [{ $sum: "$$dynamicComments.rating" }, { $sum: "$$customReviews.rating" }] },
                    totalCount: { $add: [{ $size: "$$dynamicComments" }, { $size: "$$customReviews" }] },
                  },
                  in: {
                    $cond: {
                      if: { $gt: ["$$totalCount", 0] },
                      then: { $round: [{ $divide: ["$$totalRating", "$$totalCount"] }, 1] },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          reviewCount: { 
            $add: [
              { $size: "$comments" }, 
              { $size: { $ifNull: ["$reviews", []] } }
            ] 
          },
          // Keep the original 'reviews' array from the document
          reviews: "$reviews"
        },
      },
    ]);

    if (products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = {
      ...products[0],
      images: sanitizePublicImages(products[0].images),
    };

    return NextResponse.json({
      product,
    });
  } catch (error: any) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

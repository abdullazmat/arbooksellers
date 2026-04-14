import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Comment from "@/models/Comment";
import Category from "@/models/Category";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure DB is actually connected
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 503 }
      );
    }


    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    const skip = (page - 1) * limit;

    // Build query with simplified approach
    const query: any = {};


    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { size: { $regex: search, $options: "i" } },
        { paper: { $regex: search, $options: "i" } },
        { binding: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (category) {
      const categoryInputs = category.split(",");
      const validIds: mongoose.Types.ObjectId[] = [];
      const slugs: string[] = [];
      
      for (const input of categoryInputs) {
        if (mongoose.Types.ObjectId.isValid(input)) {
          validIds.push(new mongoose.Types.ObjectId(input));
        } else {
          slugs.push(input);
        }
      }

      if (slugs.length > 0) {
        try {
          const resolvedCategories = await Category.find({ 
            slug: { $in: slugs.map(s => s.toLowerCase().trim()) } 
          }).select('_id');
          resolvedCategories.forEach(c => validIds.push(c._id));
        } catch (error) {
          console.error('Error resolving category slugs:', error);
        }
      }

      if (validIds.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { category: { $in: validIds } },
            { subcategory: { $in: validIds } }
          ]
        });
      }
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return NextResponse.json(
          { error: "Invalid subcategory ID format" },
          { status: 400 }
        );
      }
      query.subcategory = new mongoose.Types.ObjectId(subcategory);
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object with fallback strategy
    let sortObj: any = {};
    let sortField = 'createdAt';
    let sortDirection = -1;
    
    switch (sort) {
      case "price-low":
        sortField = 'price';
        sortDirection = 1;
        break;
      case "price-high":
        sortField = 'price';
        sortDirection = -1;
        break;
      case "rating":
        // For rating, we'll sort by createdAt as fallback since rating isn't indexed
        sortField = 'createdAt';
        sortDirection = -1;
        break;
      case "oldest":
        sortField = 'createdAt';
        sortDirection = 1;
        break;
      default: // newest
        sortField = 'createdAt';
        sortDirection = -1;
    }
    
    sortObj[sortField] = sortDirection;

    // Optimistic approach - prioritize speed over completeness
    let products: any[] = [];
    
    try {
      // Use aggregation with allowDiskUse to avoid memory limits
      const pipeline = [
        { $match: query },
        { $project: {
          _id: 1,
          title: 1,
          author: 1,
          price: 1,
          originalPrice: 1,
          images: 1,
          inStock: 1,
          stockQuantity: 1,
          featured: 1,
          description: 1,
          size: 1,
          pages: 1,
          paper: 1,
          binding: 1,
          category: 1,
          subcategory: 1,
          slug: 1,
          createdAt: 1
        }},
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit }
      ];

      let basicProducts;
      
      try {
        basicProducts = await Product.aggregate(pipeline).allowDiskUse(true);
      } catch (aggError: any) {
        // Fallback to simple find() if aggregation fails
        basicProducts = await Product.find(query)
          .select('_id title author price originalPrice images inStock stockQuantity featured description size pages paper binding category subcategory slug createdAt')
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .lean();
      }

      if (basicProducts.length === 0) {
        products = [];
      } else {
        // Only fetch categories if we have products and it's not a search query
        let categoryMap = new Map();
        if (!search && basicProducts.some((p: any) => p.category || p.subcategory)) {
          try {
            const categoryIds = [...new Set([
              ...basicProducts.map((p: any) => p.category).filter(Boolean),
              ...basicProducts.map((p: any) => p.subcategory).filter(Boolean)
            ])];
            
            if (categoryIds.length > 0) {
              const categories = await Category.find({ _id: { $in: categoryIds } })
                .select('_id name slug')
                .lean();
              categoryMap = new Map(categories.map((cat: any) => [cat._id.toString(), cat]));
            }
        } catch (catError) {
          // If category fetch fails, continue without categories
        }
        }

        // Process products with minimal enrichment
        products = basicProducts.map((product: any) => {
          const category = product.category ? categoryMap.get(product.category.toString()) : null;
          const subcategory = product.subcategory ? categoryMap.get(product.subcategory.toString()) : null;
          
          return {
            ...product,
            category,
            subcategory,
            rating: 0, // Default rating for speed
            reviews: 0  // Default reviews for speed
          };
        });
      }
    } catch (error: any) {
      // Ultimate fallback - use aggregation with allowDiskUse
      try {
        const fallbackPipeline = [
          { $match: query },
          { $project: {
            _id: 1,
            title: 1,
            author: 1,
            price: 1,
            originalPrice: 1,
            images: 1,
            inStock: 1,
            stockQuantity: 1,
            featured: 1,
            description: 1,
            size: 1,
            pages: 1,
            paper: 1,
            binding: 1,
            slug: 1,
            createdAt: 1
          }},
          { $sort: sortObj },
          { $skip: skip },
          { $limit: limit }
        ];
        
        products = await Product.aggregate(fallbackPipeline).allowDiskUse(true);
        
        // Add default values
        products = products.map((p: any) => ({
          ...p,
          category: null,
          subcategory: null,
          rating: 0,
          reviews: 0
        }));
      } catch (fallbackError: any) {
        // Last resort - get products without sorting, limit to smaller set
        try {
          const emergencyQuery = { ...query };
          // Remove any complex query conditions that might cause issues
          delete emergencyQuery.$or;
          delete emergencyQuery.price;
          
          products = await Product.find(emergencyQuery)
            .select('_id title author price originalPrice images inStock stockQuantity featured description size pages paper binding slug createdAt')
            .limit(Math.min(limit, 10)) // Limit to 10 items max
            .lean();
          
          // Add default values
          products = products.map((p: any) => ({
            ...p,
            category: null,
            subcategory: null,
            rating: 0,
            reviews: 0
          }));
        } catch (emergencyError: any) {
          products = [];
        }
      }
    }

    // Get total count
    const total = await Product.countDocuments(query);

    const response = NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    response.headers.set('ETag', `"${Date.now()}"`);
    
    return response;
  } catch (error: any) {
    // Provide clearer errors to help diagnose issues
    const message = error?.message || "Internal server error";
    const status =
      message.includes("Invalid") || message.includes("format") ? 400 : 500;
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

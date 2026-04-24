import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  description?: string;
  featured: boolean;
  size?: string;
  pages?: number;
  paper?: string;
  binding?: string;
  specifications?: Record<string, any>;
  category?: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  slug: string;
  reviews?: {
    name: string;
    rating: number;
    content: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      trim: true,
    },
    pages: {
      type: Number,
      min: 1,
    },
    paper: {
      type: String,
      trim: true,
    },
    binding: {
      type: String,
      trim: true,
    },
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    focusKeyword: {
      type: String,
      trim: true,
    },
    reviews: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100,
    );
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Create slug from title if not manually provided
productSchema.pre("save", function (next) {
  // If slug is explicitly modified, just sanitize it
  if (this.isModified("slug") && this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return next();
  }

  // Otherwise, if title is modified or it's new, generate from title
  if (this.isModified("title") || this.isNew || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);

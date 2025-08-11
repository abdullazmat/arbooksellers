import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  language: string;
  inStock: boolean;
  stockQuantity: number;
  description: string;
  fullDescription: string;
  specifications: {
    publisher: string;
    pages: number;
    isbn: string;
    dimensions: string;
    weight: string;
    binding: string;
  };
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required'],
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['quran', 'hadith', 'fiqh', 'aqeedah', 'seerah', 'children', 'general'],
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true,
  },
  specifications: {
    publisher: {
      type: String,
      required: [true, 'Publisher is required'],
    },
    pages: {
      type: Number,
      required: [true, 'Number of pages is required'],
      min: [1, 'Pages must be at least 1'],
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
    },
    dimensions: {
      type: String,
      required: [true, 'Dimensions are required'],
    },
    weight: {
      type: String,
      required: [true, 'Weight is required'],
    },
    binding: {
      type: String,
      required: [true, 'Binding type is required'],
    },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
productSchema.index({ title: 1, author: 1, category: 1, featured: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema); 
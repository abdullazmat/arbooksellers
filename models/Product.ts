import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  title: string
  author?: string
  price: number
  originalPrice?: number
  images: string[]
  inStock: boolean
  stockQuantity: number
  description?: string
  featured: boolean
  size?: string
  pages?: number
  paper?: string
  binding?: string
  specifications?: Record<string, any>
  category?: mongoose.Types.ObjectId
  subcategory?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
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
  images: [{
    type: String,
    required: true,
  }],
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
    ref: 'Category',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, {
  timestamps: true,
})

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema) 
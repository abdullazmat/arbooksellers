import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  rating?: number;
  isApproved: boolean;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
commentSchema.index({ productId: 1, isApproved: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", commentSchema);

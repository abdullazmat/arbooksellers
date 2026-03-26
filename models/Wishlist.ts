import mongoose from "mongoose";

export interface IWishlist extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: Array<{
    product: mongoose.Types.ObjectId;
    title: string;
    price: number;
    image: string;
    author: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
// user index is already created by unique: true

export default mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", wishlistSchema);

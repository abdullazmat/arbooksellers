import mongoose, { Schema, Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  lastEmailSent?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    lastEmailSent: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for email lookups
newsletterSchema.index({ subscribed: 1 });
newsletterSchema.index({ createdAt: -1 });

export default mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", newsletterSchema);

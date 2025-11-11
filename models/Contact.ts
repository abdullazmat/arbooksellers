import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ContactDocument extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'resolved'
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<ContactDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new', index: true },
  },
  { timestamps: true }
)

ContactSchema.index({ createdAt: -1 })
ContactSchema.index({ email: 1, createdAt: -1 })

export const Contact: Model<ContactDocument> =
  mongoose.models.Contact || mongoose.model<ContactDocument>('Contact', ContactSchema)



import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: mongoose.Types.ObjectId;
  categories?: mongoose.Types.ObjectId[];
  featuredImage?: string;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema<IBlogPost> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  excerpt: {
    type: String,
    maxlength: [500, "Excerpt cannot be more than 500 characters"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  featuredImage: {
    type: String,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  publishedAt: {
    type: Date,
  },
  metaTitle: {
    type: String,
    maxlength: [100, "Meta title cannot be more than 100 characters"],
  },
  metaDescription: {
    type: String,
    maxlength: [200, "Meta description cannot be more than 200 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
BlogPostSchema.pre<IBlogPost>("save", function (next) {
  this.updatedAt = new Date();
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

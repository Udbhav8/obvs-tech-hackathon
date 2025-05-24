import mongoose, { Document, Schema } from "mongoose";

export interface IRagDocument extends Document {
  title: string;
  filetype: "pdf" | "md" | "html" | "txt";
  content?: string; // For copy/paste or direct text
  fileUrl?: string; // For future file uploads (optional)
  filename?: string;
  uploadedBy?: mongoose.Types.ObjectId;
  uploadedAt: Date;
  summary?: string;
}

const RagDocumentSchema: Schema<IRagDocument> = new mongoose.Schema({
  title: { type: String, required: true },
  filetype: {
    type: String,
    enum: ["pdf", "md", "html", "txt"],
    required: true,
  },
  content: { type: String }, // For copy/paste or direct text
  fileUrl: { type: String }, // For future file uploads (optional)
  filename: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
  summary: { type: String },
});

export default mongoose.models.RagDocument ||
  mongoose.model<IRagDocument>("RagDocument", RagDocumentSchema);

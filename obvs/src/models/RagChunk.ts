import mongoose, { Document, Schema } from "mongoose";

export interface IRagChunk extends Document {
  document: mongoose.Types.ObjectId;
  chunkIndex: number;
  text: string;
  embedding?: number[]; // OpenAI text-embedding-3-small
  createdAt: Date;
}

const RagChunkSchema: Schema<IRagChunk> = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RagDocument",
    required: true,
  },
  chunkIndex: { type: Number, required: true },
  text: { type: String, required: true },
  embedding: { type: [Number] }, // OpenAI text-embedding-3-small
  createdAt: { type: Date, default: Date.now },
});

RagChunkSchema.index({ embedding: "2dsphere" });

export default mongoose.models.RagChunk ||
  mongoose.model<IRagChunk>("RagChunk", RagChunkSchema);

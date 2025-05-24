import mongoose, { Document, Schema, Model } from "mongoose";
import { connectSampleDB } from "../lib/mongodb";

export interface ITheater extends Document {
  theaterId: number;
  location: {
    address?: {
      street1?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    };
    geo: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const TheaterSchema: Schema<ITheater> = new mongoose.Schema(
  {
    theaterId: {
      type: Number,
      required: true,
      unique: true,
    },
    location: {
      address: {
        street1: String,
        city: String,
        state: String,
        zipcode: String,
      },
      geo: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location queries
TheaterSchema.index({ "location.geo": "2dsphere" });

// Export model factory function
export const getTheaterModel = async (): Promise<Model<ITheater>> => {
  const conn = await connectSampleDB();
  if (!conn) throw new Error("Failed to connect to database");
  return (
    conn?.models.Theater || conn?.model<ITheater>("Theater", TheaterSchema)
  );
};

// Default export for main database
export default async function Theater(): Promise<Model<ITheater>> {
  const model = await getTheaterModel();
  return model;
}

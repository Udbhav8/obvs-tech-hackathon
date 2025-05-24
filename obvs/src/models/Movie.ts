import mongoose, { Document, Schema, Model } from "mongoose";
import { connectSampleDB } from "../lib/mongodb";

export interface IMovie extends Document {
  title: string;
  year: number;
  runtime?: number;
  released?: Date;
  poster?: string;
  plot?: string;
  fullplot?: string;
  lastupdated?: string;
  type?: string;
  directors?: string[];
  imdb?: {
    rating?: number;
    votes?: number;
    id?: number;
  };
  cast?: string[];
  countries?: string[];
  genres?: string[];
  tomatoes?: {
    viewer?: {
      rating?: number;
      numReviews?: number;
      meter?: number;
    };
    critic?: {
      rating?: number;
      numReviews?: number;
      meter?: number;
    };
    lastUpdated?: Date;
    rotten?: number;
    production?: string;
    fresh?: number;
  };
  num_mflix_comments?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema<IMovie> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
    },
    runtime: {
      type: Number,
    },
    released: {
      type: Date,
    },
    poster: {
      type: String,
    },
    plot: {
      type: String,
    },
    fullplot: {
      type: String,
    },
    lastupdated: {
      type: String,
    },
    type: {
      type: String,
    },
    directors: [
      {
        type: String,
      },
    ],
    imdb: {
      rating: Number,
      votes: Number,
      id: Number,
    },
    cast: [
      {
        type: String,
      },
    ],
    countries: [
      {
        type: String,
      },
    ],
    genres: [
      {
        type: String,
      },
    ],
    tomatoes: {
      viewer: {
        rating: Number,
        numReviews: Number,
        meter: Number,
      },
      critic: {
        rating: Number,
        numReviews: Number,
        meter: Number,
      },
      lastUpdated: Date,
      rotten: Number,
      production: String,
      fresh: Number,
    },
    num_mflix_comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
MovieSchema.index({
  title: "text",
  plot: "text",
  fullplot: "text",
  cast: "text",
  directors: "text",
  genres: "text",
});

// Export model factory function
export const getMovieModel = async (): Promise<Model<IMovie>> => {
  const conn = await connectSampleDB();
  return conn.models.Movie || conn.model<IMovie>("Movie", MovieSchema);
};

// Default export for main database
export default async function Movie(): Promise<Model<IMovie>> {
  const model = await getMovieModel();
  return model;
}

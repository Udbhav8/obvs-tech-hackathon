import { getMovieModel } from "../models/Movie";
import { getCommentModel } from "../models/Comment";
import { getTheaterModel } from "../models/Theater";
import { IMovie } from "../models/Movie";
import { IComment } from "../models/Comment";
import { ITheater } from "../models/Theater";

// Helper function to get models for sample_mflix database
export const getSampleMflixModels = () => ({
  Movie: getMovieModel(),
  Comment: getCommentModel(),
  Theater: getTheaterModel(),
});

// Movie CRUD operations
export const getSampleMovies = async (
  limit: number = 10,
  skip: number = 0
): Promise<{ movies: IMovie[]; total: number }> => {
  try {
    const Movie = await getMovieModel();
    const movies = await Movie.find().limit(limit).skip(skip);
    const total = await Movie.countDocuments();
    return { movies, total };
  } catch (error) {
    console.error("Error fetching sample movies:", error);
    return { movies: [], total: 0 };
  }
};

export const getSampleMovieById = async (
  id: string
): Promise<IMovie | null> => {
  const Movie = await getMovieModel();
  return await Movie.findById(id);
};

export const createSampleMovie = async (
  movieData: Partial<IMovie>
): Promise<IMovie> => {
  const Movie = await getMovieModel();
  const movie = new Movie(movieData);
  return await movie.save();
};

export const updateSampleMovie = async (
  id: string,
  movieData: Partial<IMovie>
): Promise<IMovie | null> => {
  const Movie = await getMovieModel();
  return await Movie.findByIdAndUpdate(id, movieData, { new: true });
};

export const deleteSampleMovie = async (id: string): Promise<IMovie | null> => {
  const Movie = await getMovieModel();
  return await Movie.findByIdAndDelete(id);
};

// Comment operations
export const getMovieComments = async (
  movieId: string
): Promise<IComment[]> => {
  const Comment = await getCommentModel();
  return await Comment.find({ movie_id: movieId });
};

// Theater operations
export const findNearbyTheaters = async (
  longitude: number,
  latitude: number,
  maxDistance: number = 10000
): Promise<ITheater[]> => {
  const Theater = await getTheaterModel();
  return await Theater.find({
    "location.geo": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

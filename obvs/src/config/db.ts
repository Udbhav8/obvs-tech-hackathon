import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
const SAMPLE_MFLIX_URI = process.env.SAMPLE_MFLIX_URI as string;

// Create connections
const mainConnection: Connection = mongoose.createConnection(MONGODB_URI);
const sampleMflixConnection: Connection =
  mongoose.createConnection(SAMPLE_MFLIX_URI);

// Export connections
export { mainConnection, sampleMflixConnection };

// Helper function to get the appropriate connection based on context
export const getConnection = (useSampleMflix: boolean = false): Connection => {
  return useSampleMflix ? sampleMflixConnection : mainConnection;
};

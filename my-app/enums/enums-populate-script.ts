#!/usr/bin/env tsx

/**
 * Script to populate the database with enum values from TypeScript enums.
 * This ensures that the database has all the required enum values for the application.
 *
 * Usage: npm run enums:populate
 */

// Load environment variables FIRST, before any other imports
import { config } from "dotenv";
config({ path: "./.env.local" });

// Ensure environment variables are properly set before importing modules that depend on them
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

import mongoose from "mongoose";
import Enum, { IEnumValue } from "../models/Enum";
import { USER_ENUM_REGISTRY } from "./user-enums";
import { BOOKING_ENUM_REGISTRY } from "./booking-enums";
import { DONATIONS_ENUM_REGISTRY } from "./donations-enums";

// Custom connection function that uses the environment variable at runtime
async function connectToMongoDB(): Promise<typeof mongoose | null> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined");
    return null;
  }

  try {
    console.log("🔌 Connecting to MongoDB...");
    const connection = await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
    return connection;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    return null;
  }
}

async function populateEnum(
  enumName: string,
  enumObject: Record<string, string>
): Promise<void> {
  try {
    console.log(`\n📝 Processing enum: ${enumName}`);

    // Check if enum already exists
    const existingEnum = await Enum.findOne({ name: enumName });

    // Prepare enum values - use the key as key and value as value
    const enumValues: IEnumValue[] = Object.entries(enumObject).map(
      ([key, value]) => ({
        key: key,
        value: value,
        isActive: true,
      })
    );

    if (existingEnum) {
      console.log(`  ↻ Updating existing enum: ${enumName}`);

      // Update the existing enum
      existingEnum.values = enumValues;
      existingEnum.updatedAt = new Date();
      await existingEnum.save();

      console.log(`  ✅ Updated ${enumName} with ${enumValues.length} values`);
    } else {
      console.log(`  ➕ Creating new enum: ${enumName}`);

      // Create new enum
      const newEnum = new Enum({
        name: enumName,
        description: `Centrally managed ${enumName} enum values`,
        values: enumValues,
        isActive: true,
      });

      await newEnum.save();
      console.log(`  ✅ Created ${enumName} with ${enumValues.length} values`);
    }

    // Log the values for verification
    console.log(
      `  📋 Values: ${enumValues.map((v) => `${v.key}=${v.value}`).join(", ")}`
    );
  } catch (error) {
    console.error(`❌ Error processing enum ${enumName}:`, error);
    throw error;
  }
}

async function populateAllEnums(): Promise<void> {
  console.log("🚀 Starting enum population process...");

  const totalEnums =
    Object.keys(USER_ENUM_REGISTRY).length +
    Object.keys(BOOKING_ENUM_REGISTRY).length +
    Object.keys(DONATIONS_ENUM_REGISTRY).length;

  console.log(`📊 Found ${totalEnums} enums to process`);

  // Populate user enums
  console.log("\n👤 Processing User Enums...");
  for (const [enumName, enumObject] of Object.entries(USER_ENUM_REGISTRY)) {
    await populateEnum(enumName, enumObject as Record<string, string>);
  }

  // Populate booking enums
  console.log("\n📅 Processing Booking Enums...");
  for (const [enumName, enumObject] of Object.entries(BOOKING_ENUM_REGISTRY)) {
    await populateEnum(enumName, enumObject as Record<string, string>);
  }

  // Populate donations enums
  console.log("\n💰 Processing Donations Enums...");
  for (const [enumName, enumObject] of Object.entries(
    DONATIONS_ENUM_REGISTRY
  )) {
    await populateEnum(enumName, enumObject as Record<string, string>);
  }

  console.log("\n✨ Enum population completed successfully!");
}

async function verifyEnums(): Promise<void> {
  console.log("\n🔍 Verifying populated enums...");

  const allEnums = await Enum.find({ isActive: true }).sort({ name: 1 });

  console.log(`\n📈 Summary: ${allEnums.length} active enums in database`);
  console.log("📋 Enum List:");

  for (const enumDoc of allEnums) {
    const activeValues = enumDoc.values.filter(
      (v: IEnumValue) => v.isActive
    ).length;
    console.log(`  • ${enumDoc.name}: ${activeValues} values`);
  }
}

async function clearAllEnums(): Promise<void> {
  console.log("\n🗑️  Clearing all existing enums...");
  const result = await Enum.deleteMany({});
  console.log(`✅ Cleared ${result.deletedCount} enum documents`);
}

async function main(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    const connection = await connectToMongoDB();

    if (!connection) {
      console.error("❌ Failed to connect to MongoDB");
      process.exit(1);
    }

    // Parse command line arguments
    const args = process.argv.slice(2);
    const shouldClear = args.includes("--clear") || args.includes("-c");
    const shouldVerifyOnly = args.includes("--verify") || args.includes("-v");

    if (shouldVerifyOnly) {
      await verifyEnums();
      return;
    }

    if (shouldClear) {
      await clearAllEnums();
    }

    await populateAllEnums();
    await verifyEnums();
  } catch (error) {
    console.error("❌ Population script failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

// Export functions for programmatic use
export { populateEnum, populateAllEnums, verifyEnums, clearAllEnums };

// Run script if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Script execution failed:", error);
    process.exit(1);
  });
}

/* 
Usage Examples:

1. Populate all enums:
   npm run enums:populate

2. Clear existing enums and repopulate:
   npm run enums:populate -- --clear

3. Verify existing enums without changes:
   npm run enums:populate -- --verify

4. Available flags:
   --clear, -c  : Clear all existing enums before populating
   --verify, -v : Only verify existing enums without changes
*/

/**
 * Script to populate the database with enum values from TypeScript enums.
 * This ensures that the database has all the required enum values for the application.
 *
 * Usage: npm run populate-enums (add this script to package.json)
 */

import { connectToDatabase } from "../lib/mongodb";
import Enum, { IEnumValue } from "../models/Enum";
import { USER_ENUM_REGISTRY } from "./user-enums";
import { BOOKING_ENUM_REGISTRY } from "./booking-enums";

async function populateEnums() {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Populate booking enums
    for (const [enumName, enumValues] of Object.entries(
      BOOKING_ENUM_REGISTRY
    )) {
      await populateEnum(enumName, enumValues, "Booking-related enum");
    }

    // Populate user enums
    for (const [enumName, enumValues] of Object.entries(USER_ENUM_REGISTRY)) {
      await populateEnum(enumName, enumValues, "User-related enum");
    }

    console.log("All enums populated successfully!");
  } catch (error) {
    console.error("Error populating enums:", error);
  } finally {
    process.exit(0);
  }
}

async function populateEnum(
  enumName: string,
  enumObject: Record<string, string>,
  description: string
) {
  try {
    // Check if enum already exists
    let enumDoc = await Enum.findOne({ name: enumName });

    if (!enumDoc) {
      // Create new enum document
      enumDoc = new Enum({
        name: enumName,
        description,
        values: [],
      });
    }

    // Convert enum object to array of enum values
    const enumValues = Object.entries(enumObject).map(([key, value]) => ({
      key,
      value,
      isActive: true,
    }));

    // Update enum values
    enumDoc.values = enumValues;
    await enumDoc.save();

    console.log(
      `✓ Populated enum: ${enumName} with ${enumValues.length} values`
    );
  } catch (error) {
    console.error(`✗ Error populating enum ${enumName}:`, error);
  }
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
    await populateEnums();
    await verifyEnums();
  } catch (error) {
    console.error("❌ Population script failed:", error);
    process.exit(1);
  }
}

// Export functions for programmatic use
export { populateEnum, populateEnums, verifyEnums, clearAllEnums };

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
   npm run populate-enums
   or
   ts-node enums/enums-populate-script.ts

2. Clear existing enums and repopulate:
   ts-node enums/enums-populate-script.ts --clear

3. Verify existing enums without changes:
   ts-node enums/enums-populate-script.ts --verify

4. Available flags:
   --clear, -c  : Clear all existing enums before populating
   --verify, -v : Only verify existing enums without changes
*/

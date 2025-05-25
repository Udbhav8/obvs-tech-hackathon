// Centralized enum utility functions for database operations
// This file contains server-side functions and should not be imported in client components

import Enum from "../models/Enum";
import { BOOKING_ENUM_REGISTRY, BookingEnumName } from "./booking-enums";
import { USER_ENUM_REGISTRY, EnumName as UserEnumName } from "./user-enums";
import { DONATIONS_ENUM_REGISTRY, DonationsEnumName } from "./donations-enums";

// Type for booking enum return values
export type BookingEnums = {
  [K in BookingEnumName]: string[];
};

// Type for user enum return values
export type UserEnums = {
  [K in UserEnumName]: string[];
};

// Type for donations enum return values
export type DonationsEnums = {
  [K in DonationsEnumName]: string[];
};

// Function to fetch all booking enums from the database
export async function fetchBookingEnumsFromDatabase(): Promise<BookingEnums> {
  const enumNames = Object.keys(BOOKING_ENUM_REGISTRY) as BookingEnumName[];
  const result = {} as BookingEnums;

  for (const enumName of enumNames) {
    try {
      // Assuming Enum.getEnumMap handles the potential dynamic nature
      // and returns an object mapping enum keys to string values
      const enumMap = await Enum.getEnumMap(enumName);
      result[enumName] = Object.values(enumMap);
    } catch (error) {
      console.warn(
        `Failed to fetch enum ${enumName} from database, falling back to local definition:`,
        error
      );
      // Fallback to local enum definition from the registry
      result[enumName] = Object.values(BOOKING_ENUM_REGISTRY[enumName]);
    }
  }

  return result;
}

// Function to fetch all user enums from the database
export async function fetchUserEnumsFromDatabase(): Promise<UserEnums> {
  const enumNames = Object.keys(USER_ENUM_REGISTRY) as UserEnumName[];
  const result = {} as UserEnums;

  for (const enumName of enumNames) {
    try {
      const enumMap = await Enum.getEnumMap(enumName);
      result[enumName] = Object.values(enumMap);
    } catch (error) {
      console.warn(`Failed to fetch enum ${enumName} from database:`, error);
      // Fallback to local enum definition
      result[enumName] = Object.values(USER_ENUM_REGISTRY[enumName]);
    }
  }

  return result;
}

// Function to fetch all donations enums from the database
export async function fetchDonationsEnumsFromDatabase(): Promise<DonationsEnums> {
  const enumNames = Object.keys(DONATIONS_ENUM_REGISTRY) as DonationsEnumName[];
  const result = {} as DonationsEnums;

  for (const enumName of enumNames) {
    try {
      const enumMap = await Enum.getEnumMap(enumName);
      result[enumName] = Object.values(enumMap);
    } catch (error) {
      console.warn(`Failed to fetch enum ${enumName} from database:`, error);
      // Fallback to local enum definition
      result[enumName] = Object.values(DONATIONS_ENUM_REGISTRY[enumName]);
    }
  }

  return result;
}

// Function to fetch a specific enum from the database
export async function fetchSingleEnum(enumName: string): Promise<string[]> {
  try {
    const enumMap = await Enum.getEnumMap(enumName);
    return Object.values(enumMap);
  } catch (error) {
    console.warn(`Failed to fetch enum ${enumName} from database:`, error);

    // Try to find in booking enums
    if (enumName in BOOKING_ENUM_REGISTRY) {
      return Object.values(BOOKING_ENUM_REGISTRY[enumName as BookingEnumName]);
    }

    // Try to find in user enums
    if (enumName in USER_ENUM_REGISTRY) {
      return Object.values(USER_ENUM_REGISTRY[enumName as UserEnumName]);
    }

    // Try to find in donations enums
    if (enumName in DONATIONS_ENUM_REGISTRY) {
      return Object.values(
        DONATIONS_ENUM_REGISTRY[enumName as DonationsEnumName]
      );
    }

    throw new Error(`Enum ${enumName} not found in any registry`);
  }
}

// Function to get enum values as key-value pairs
export async function fetchEnumMap(
  enumName: string
): Promise<Record<string, string>> {
  try {
    return await Enum.getEnumMap(enumName);
  } catch (error) {
    console.warn(`Failed to fetch enum map ${enumName} from database:`, error);

    // Try to find in booking enums
    if (enumName in BOOKING_ENUM_REGISTRY) {
      const enumObj = BOOKING_ENUM_REGISTRY[enumName as BookingEnumName];
      return Object.fromEntries(
        Object.entries(enumObj).map(([key, value]) => [key, value])
      );
    }

    // Try to find in user enums
    if (enumName in USER_ENUM_REGISTRY) {
      const enumObj = USER_ENUM_REGISTRY[enumName as UserEnumName];
      return Object.fromEntries(
        Object.entries(enumObj).map(([key, value]) => [key, value])
      );
    }

    // Try to find in donations enums
    if (enumName in DONATIONS_ENUM_REGISTRY) {
      const enumObj = DONATIONS_ENUM_REGISTRY[enumName as DonationsEnumName];
      return Object.fromEntries(
        Object.entries(enumObj).map(([key, value]) => [key, value])
      );
    }

    throw new Error(`Enum ${enumName} not found in any registry`);
  }
}

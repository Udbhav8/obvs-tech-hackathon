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


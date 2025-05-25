import mongoose, { Document, Model } from "mongoose";

export interface IEnumValue {
  key: string;
  value: string;
  isActive: boolean;
}

export interface IEnum extends Document {
  name: string;
  description?: string;
  values: IEnumValue[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  addOrUpdateValue(
    key: string,
    value: string,
    isActive?: boolean
  ): Promise<IEnum>;
}

// Interface for static methods
export interface IEnumModel extends Model<IEnum> {
  getEnumValues(enumName: string): Promise<string[]>;
  getEnumMap(enumName: string): Promise<Record<string, string>>;
}

const EnumValueSchema = new mongoose.Schema<IEnumValue>({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const EnumSchema = new mongoose.Schema<IEnum>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    values: [EnumValueSchema],
  },
  {
    timestamps: true,
  }
);

// Static method to get enum values by name
EnumSchema.statics.getEnumValues = async function (
  enumName: string
): Promise<string[]> {
  const enumDoc = await this.findOne({ name: enumName, isActive: true });
  if (!enumDoc) {
    throw new Error(`Enum '${enumName}' not found`);
  }
  return enumDoc.values
    .filter((value: IEnumValue) => value.isActive)
    .map((value: IEnumValue) => value.value);
};

// Static method to get enum key-value pairs
EnumSchema.statics.getEnumMap = async function (
  enumName: string
): Promise<Record<string, string>> {
  const enumDoc = await this.findOne({ name: enumName });
  if (!enumDoc) {
    throw new Error(`Enum '${enumName}' not found`);
  }
  const map: Record<string, string> = {};
  enumDoc.values
    .filter((value: IEnumValue) => value.isActive)
    .forEach((value: IEnumValue) => {
      map[value.key] = value.value;
    });
  return map;
};

// Instance method to add or update enum value
EnumSchema.methods.addOrUpdateValue = function (
  key: string,
  value: string,
  isActive: boolean = true
) {
  const existingIndex = this.values.findIndex((v: IEnumValue) => v.key === key);

  const enumValue: IEnumValue = {
    key,
    value,
    isActive,
  };

  if (existingIndex >= 0) {
    this.values[existingIndex] = enumValue;
  } else {
    this.values.push(enumValue);
  }

  return this.save();
};

// Create indexes before model creation
EnumSchema.index({ name: 1, "values.key": 1 }, { unique: true, sparse: true });
EnumSchema.index(
  { name: 1, "values.value": 1 },
  { unique: true, sparse: true }
);

// Export the model using the pattern to prevent "Cannot overwrite model once compiled" error
const Enum = (mongoose.models.Enum ||
  mongoose.model<IEnum>("Enum", EnumSchema)) as IEnumModel;

export default Enum;

import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      required: true,
      default: "#3B82F6", // Default blue color
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITag>("Tag", TagSchema); 
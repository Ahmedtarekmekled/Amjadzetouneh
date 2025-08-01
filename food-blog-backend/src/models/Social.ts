import mongoose, { Document, Schema } from "mongoose";

export interface ISocial extends Document {
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
}

const socialSchema = new Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model<ISocial>("Social", socialSchema); 
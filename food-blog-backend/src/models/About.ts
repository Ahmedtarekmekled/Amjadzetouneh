import mongoose, { Document, Schema } from "mongoose";

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface ContentLanguage {
  description: string;
  experience: string;
  skills: string[];
  education: Education[];
}

interface Content {
  en: ContentLanguage;
  ar: ContentLanguage;
}

export interface IAbout extends Document {
  content: {
    en: {
      description: string;
      experience: string;
      skills: string[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
    };
    ar: {
      description: string;
      experience: string;
      skills: string[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
    };
  };
  profileImage?: string;
  cvFile?: string;
  showCV: boolean;
}

const educationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
});

const contentLanguageSchema = new Schema({
  description: { type: String, required: true },
  experience: { type: String, required: true },
  skills: [{ type: String }],
  education: [educationSchema],
});

const aboutSchema = new Schema<IAbout>(
  {
    content: {
      en: { type: contentLanguageSchema, required: true },
      ar: { type: contentLanguageSchema, required: true },
    },
    profileImage: { type: String },
    cvFile: { type: String },
    showCV: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAbout>("About", aboutSchema);

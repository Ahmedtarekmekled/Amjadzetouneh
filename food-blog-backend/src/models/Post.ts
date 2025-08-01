import mongoose, { Document, Schema } from "mongoose";

interface PostContent {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface IPost extends Document {
  title?: {
    en: string;
    ar: string;
  };
  excerpt?: {
    en: string;
    ar: string;
  };
  content: {
    en: PostContent;
    ar: PostContent;
  };
  images: string[];
  coverImage?: string;
  categories?: string[];
  status: "draft" | "published";
  publishDate: string;
  author: mongoose.Types.ObjectId;
  slug: string;
  cookTime: number;
  prepTime: number;
  difficulty: "easy" | "medium" | "hard";
  servings?: number;
  calories?: number;
  mealTimes: string[];
  tags: string[];
  views?: number;
}

const postContentSchema = new Schema<PostContent>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  keywords: [{ type: String }],
});

const postSchema = new Schema<IPost>(
  {
    title: {
      en: { type: String },
      ar: { type: String },
    },
    excerpt: {
      en: { type: String },
      ar: { type: String },
    },
    content: {
      en: { type: postContentSchema, required: true },
      ar: { type: postContentSchema, required: true },
    },
    images: [{ type: String }],
    coverImage: { type: String },
    categories: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishDate: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true },
    cookTime: { type: Number, default: 0 },
    prepTime: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    servings: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    mealTimes: [
      {
        type: String,
        enum: [
          "breakfast",
          "brunch",
          "lunch",
          "afternoon_snack",
          "dinner",
          "dessert",
        ],
      },
    ],
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", postSchema);

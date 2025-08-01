export interface BlogPost {
  _id: string;
  title?: {
    en: string;
    ar: string;
  };
  excerpt?: {
    en: string;
    ar: string;
  };
  content: {
    en: {
      title: string;
      content: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
    ar: {
      title: string;
      content: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
  };
  slug: string;
  coverImage?: string;
  categories?: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  category?: string;
  tags: string[];
  publishDate: string;
  images: string[];
  status: "draft" | "published";
  cookTime: number;
  prepTime: number;
  difficulty: "easy" | "medium" | "hard";
  servings?: number;
  calories?: number;
  mealTimes: string[];
}

export type BlogPostFormData = Omit<
  BlogPost,
  "_id" | "author" | "createdAt" | "updatedAt"
>;

export interface BlogPostError {
  field: string;
  message: string;
}

// Category types for better type safety
export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface RecipeDetails {
  prepTime: number;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  servings?: number;
  calories?: number;
}

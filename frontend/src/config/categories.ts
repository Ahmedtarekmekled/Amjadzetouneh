import { Category } from "@/types/blog";

export const FOOD_CATEGORIES: Category[] = [
  {
    id: "breakfast",
    name: "Breakfast",
    icon: "🌅",
    description: "Morning meals and breakfast recipes",
  },
  {
    id: "main-dishes",
    name: "Main Dishes",
    icon: "🍽️",
    description: "Primary meal courses",
  },
  {
    id: "appetizers",
    name: "Appetizers",
    icon: "🥗",
    description: "Starters and small plates",
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: "🍰",
    description: "Sweet treats and desserts",
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: "🥤",
    description: "Drinks and beverages",
  },
  {
    id: "snacks",
    name: "Snacks",
    icon: "🍿",
    description: "Quick snacks and finger foods",
  },
  { id: "soups", name: "Soups", icon: "🍲", description: "Soup recipes" },
  {
    id: "salads",
    name: "Salads",
    icon: "🥬",
    description: "Fresh salads and greens",
  },
  {
    id: "breads",
    name: "Breads",
    icon: "🍞",
    description: "Bread and pastry recipes",
  },
  { id: "pasta", name: "Pasta", icon: "🍝", description: "Pasta dishes" },
  {
    id: "seafood",
    name: "Seafood",
    icon: "🐟",
    description: "Fish and seafood recipes",
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    icon: "🥕",
    description: "Vegetarian dishes",
  },
  { id: "vegan", name: "Vegan", icon: "🌱", description: "Vegan recipes" },
  {
    id: "gluten-free",
    name: "Gluten-Free",
    icon: "🌾",
    description: "Gluten-free options",
  },
  {
    id: "quick-meals",
    name: "Quick Meals",
    icon: "⚡",
    description: "Fast and easy recipes",
  },
  {
    id: "slow-cooker",
    name: "Slow Cooker",
    icon: "⏰",
    description: "Slow cooker recipes",
  },
];

export const ARABIC_CATEGORIES: Category[] = [
  {
    id: "breakfast",
    name: "الإفطار",
    icon: "🌅",
    description: "وجبات الصباح ووصفات الإفطار",
  },
  {
    id: "main-dishes",
    name: "الأطباق الرئيسية",
    icon: "🍽️",
    description: "الأطباق الرئيسية",
  },
  {
    id: "appetizers",
    name: "المقبلات",
    icon: "🥗",
    description: "المقبلات والأطباق الصغيرة",
  },
  {
    id: "desserts",
    name: "الحلويات",
    icon: "🍰",
    description: "الحلويات والحلويات",
  },
  {
    id: "beverages",
    name: "المشروبات",
    icon: "🥤",
    description: "المشروبات والعصائر",
  },
  {
    id: "snacks",
    name: "الوجبات الخفيفة",
    icon: "🍿",
    description: "الوجبات الخفيفة السريعة",
  },
  { id: "soups", name: "الحساء", icon: "🍲", description: "وصفات الحساء" },
  { id: "salads", name: "السلطات", icon: "🥬", description: "السلطات الطازجة" },
  {
    id: "breads",
    name: "الخبز",
    icon: "🍞",
    description: "وصفات الخبز والمعجنات",
  },
  {
    id: "pasta",
    name: "المعكرونة",
    icon: "🍝",
    description: "أطباق المعكرونة",
  },
  {
    id: "seafood",
    name: "المأكولات البحرية",
    icon: "🐟",
    description: "وصفات السمك والمأكولات البحرية",
  },
  {
    id: "vegetarian",
    name: "نباتي",
    icon: "🥕",
    description: "الأطباق النباتية",
  },
  {
    id: "vegan",
    name: "نباتي صرف",
    icon: "🌱",
    description: "الوصفات النباتية الصرفة",
  },
  {
    id: "gluten-free",
    name: "خالي من الغلوتين",
    icon: "🌾",
    description: "الخيارات الخالية من الغلوتين",
  },
  {
    id: "quick-meals",
    name: "وجبات سريعة",
    icon: "⚡",
    description: "وصفات سريعة وسهلة",
  },
  {
    id: "slow-cooker",
    name: "طبخ بطيء",
    icon: "⏰",
    description: "وصفات الطبخ البطيء",
  },
];

export const getCategoriesByLanguage = (language: "en" | "ar"): Category[] => {
  return language === "ar" ? ARABIC_CATEGORIES : FOOD_CATEGORIES;
};

export const findCategoryById = (
  id: string,
  language: "en" | "ar"
): Category | undefined => {
  const categories = getCategoriesByLanguage(language);
  return categories.find((category) => category.id === id);
};

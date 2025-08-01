import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryLinkProps {
  category: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const categoryNames = {
  en: {
    all: "All Categories",
    breakfast: "Breakfast",
    "main-dishes": "Main Dishes",
    appetizers: "Appetizers",
    desserts: "Desserts",
    beverages: "Beverages",
    snacks: "Snacks",
  },
  ar: {
    all: "جميع الفئات",
    breakfast: "الإفطار",
    "main-dishes": "الأطباق الرئيسية",
    appetizers: "المقبلات",
    desserts: "الحلويات",
    beverages: "المشروبات",
    snacks: "الوجبات الخفيفة",
  },
};

export default function CategoryLink({
  category,
  children,
  className = "",
  onClick,
}: CategoryLinkProps) {
  const { language } = useLanguage();

  const href = category === "all" ? "/blog" : `/blog?category=${category}`;

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

// Helper function to get category name
export function getCategoryName(
  category: string,
  language: "en" | "ar" = "en"
) {
  return (
    categoryNames[language][
      category as keyof (typeof categoryNames)[typeof language]
    ] || category
  );
}

// Helper function to get all categories
export function getAllCategories(language: "en" | "ar" = "en") {
  return Object.keys(categoryNames[language]).map((category) => ({
    id: category,
    name: categoryNames[language][
      category as keyof (typeof categoryNames)[typeof language]
    ],
  }));
}

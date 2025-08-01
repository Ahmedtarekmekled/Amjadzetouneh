import { useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategoriesByLanguage } from "@/config/categories";

interface CategorySelectProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export default function CategorySelect({
  selectedCategories = [],
  onChange,
  multiple = true,
  className = "",
}: CategorySelectProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const categories = getCategoriesByLanguage(language);

  const handleCategoryToggle = (categoryId: string) => {
    if (multiple) {
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];
      onChange(newCategories);
    } else {
      onChange([categoryId]);
      setIsOpen(false);
    }
  };

  const getSelectedCategoriesText = () => {
    if (selectedCategories.length === 0) {
      return language === "ar" ? "اختر الفئات" : "Select categories";
    }

    if (selectedCategories.length === 1) {
      const category = categories.find((c) => c.id === selectedCategories[0]);
      return category
        ? `${category.icon} ${category.name}`
        : selectedCategories[0];
    }

    return language === "ar"
      ? `${selectedCategories.length} فئة محددة`
      : `${selectedCategories.length} categories selected`;
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {language === "ar" ? "الفئات" : "Categories"}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <span className="block truncate text-gray-900">
          {getSelectedCategoriesText()}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryToggle(category.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 flex items-center justify-between ${
                selectedCategories.includes(category.id)
                  ? "bg-indigo-50 text-indigo-900"
                  : "text-gray-900"
              }`}
            >
              <span className="flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </span>
              {selectedCategories.includes(category.id) && (
                <CheckIcon className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected categories display */}
      {selectedCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedCategories.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            return (
              <span
                key={categoryId}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                <span>{category?.icon}</span>
                {category?.name || categoryId}
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  <span className="sr-only">Remove</span>×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

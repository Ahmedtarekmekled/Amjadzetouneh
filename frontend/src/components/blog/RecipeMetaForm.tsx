import { useState } from 'react';
import { ClockIcon, BeakerIcon, TagIcon, FireIcon } from '@heroicons/react/24/outline';

interface RecipeMetaFormProps {
  initialData?: {
    cookTime: number;
    prepTime: number;
    difficulty: string;
    mealTimes: string[];
    tags: string[];
  };
  onChange: (data: any) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "hard", label: "Hard", color: "bg-red-100 text-red-800" }
];

const MEAL_TIME_OPTIONS = [
  { value: "breakfast", label: "Breakfast", icon: "🍳" },
  { value: "brunch", label: "Brunch", icon: "🥐" },
  { value: "lunch", label: "Lunch", icon: "🍱" },
  { value: "afternoon_snack", label: "Afternoon Snack", icon: "🥪" },
  { value: "dinner", label: "Dinner", icon: "🍽️" },
  { value: "dessert", label: "Dessert", icon: "🍰" }
];

export default function RecipeMetaForm({ initialData, onChange }: RecipeMetaFormProps) {
  const [formData, setFormData] = useState({
    cookTime: initialData?.cookTime || 0,
    prepTime: initialData?.prepTime || 0,
    difficulty: initialData?.difficulty || 'medium',
    mealTimes: initialData?.mealTimes || [],
    tags: initialData?.tags || []
  });

  const [newTag, setNewTag] = useState('');

  const handleChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      const updatedTags = [...formData.tags, newTag.trim()];
      handleChange('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    handleChange('tags', updatedTags);
  };

  return (
    <div className="space-y-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Time Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preparation Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => handleChange('prepTime', parseInt(e.target.value))}
                className="block w-full pr-12 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0"
                min="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">min</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooking Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={formData.cookTime}
                onChange={(e) => handleChange('cookTime', parseInt(e.target.value))}
                className="block w-full pr-12 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0"
                min="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FireIcon className="w-5 h-5 text-gray-500" />
          Difficulty Level
        </h3>
        <div className="flex gap-4">
          {DIFFICULTY_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange('difficulty', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                formData.difficulty === option.value
                  ? `${option.color} border-transparent`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meal Times Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <BeakerIcon className="w-5 h-5 text-gray-500" />
          Meal Times
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {MEAL_TIME_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${
                formData.mealTimes.includes(option.value)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.mealTimes.includes(option.value)}
                onChange={(e) => {
                  const updatedMealTimes = e.target.checked
                    ? [...formData.mealTimes, option.value]
                    : formData.mealTimes.filter(time => time !== option.value);
                  handleChange('mealTimes', updatedMealTimes);
                }}
                className="sr-only"
              />
              <span className="mr-3 text-xl">{option.icon}</span>
              <span className="text-sm font-medium text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-gray-500" />
          Tags
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
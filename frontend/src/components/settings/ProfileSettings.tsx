import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

export default function ProfileSettings() {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t("settings.profile.title")}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t("settings.profile.description")}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <form className="space-y-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center sm:items-start space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("settings.profile.photo")}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-32 w-32 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg">
                  <Image
                    src={previewImage || "/images/hero-bg.jpg"}
                    alt={t("settings.profile.photo")}
                    fill
                    sizes="(max-width: 768px) 128px, 96px"
                    className="object-cover"
                  />
                </div>
                <label
                  htmlFor="photo-upload"
                  className={`cursor-pointer bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                    language === "ar" ? "mr-0 sm:mr-4" : "ml-0 sm:ml-4"
                  }`}
                >
                  <span>{t("settings.profile.changePhoto")}</span>
                  <input
                    id="photo-upload"
                    name="photo"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("settings.profile.name")}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("settings.profile.bio")}
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? t("common.saving") : t("common.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

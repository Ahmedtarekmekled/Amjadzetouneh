import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GeneralSettings() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('settings.general.title')}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('settings.general.description')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <form className="space-y-8">
            {/* Site Title */}
            <div className="space-y-2">
              <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.general.siteTitle')}
              </label>
              <input
                type="text"
                name="siteTitle"
                id="siteTitle"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Site Description */}
            <div className="space-y-2">
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.general.siteDescription')}
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
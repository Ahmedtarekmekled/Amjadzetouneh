import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Settings } from '@/services/settingsService';

interface ThemeSwitcherProps {
  settings: Settings;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ settings }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || settings.theme.mode
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);

    // Apply theme colors
    const colors = settings.theme.colors[activeTheme];
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    localStorage.setItem('theme', theme);
  }, [theme, settings.theme.colors]);

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1">
        {[
          { value: 'light', icon: SunIcon },
          { value: 'dark', icon: MoonIcon },
          { value: 'system', icon: ComputerDesktopIcon }
        ].map(({ value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
            className={`p-2 rounded-md transition-all duration-200 ${
              theme === value 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-indigo-500'
            }`}
            title={`${value.charAt(0).toUpperCase() + value.slice(1)} mode`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 
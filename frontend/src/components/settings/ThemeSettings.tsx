import React, { useState, useEffect } from "react";
import { Settings } from "@/services/settingsService";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

// Dynamically import the color picker with ssr disabled
const Sketch = dynamic(
  () => import("@uiw/react-color").then((mod) => mod.Sketch),
  {
    ssr: false,
  }
);

interface ThemeSettingsProps {
  settings: Settings | null;
  onSave: (settings: Partial<Settings>) => Promise<void>;
  isSaving?: boolean;
}

const PREDEFINED_COLORS = {
  light: {
    themes: [
      {
        name: "Default",
        primary: "#4F46E5",
        secondary: "#7C3AED",
        background: "#FFFFFF",
        text: "#111827",
      },
      {
        name: "Ocean",
        primary: "#0EA5E9",
        secondary: "#0284C7",
        background: "#F0F9FF",
        text: "#0C4A6E",
      },
      {
        name: "Forest",
        primary: "#059669",
        secondary: "#047857",
        background: "#ECFDF5",
        text: "#064E3B",
      },
      {
        name: "Sunset",
        primary: "#EA580C",
        secondary: "#C2410C",
        background: "#FFF7ED",
        text: "#7C2D12",
      },
      // New theme with gold and olive
      {
        name: "Gold Olive",
        primary: "#D4AF37", // Gold
        secondary: "#708238", // Olive
        background: "#F3F4F6", // Light background
        text: "#2F3A21", // Olive text for contrast
      },
    ],
  },
  dark: {
    themes: [
      {
        name: "Default",
        primary: "#818CF8",
        secondary: "#A78BFA",
        background: "#111827",
        text: "#F9FAFB",
      },
      {
        name: "Ocean",
        primary: "#38BDF8",
        secondary: "#0EA5E9",
        background: "#0C4A6E",
        text: "#E0F2FE",
      },
      {
        name: "Forest",
        primary: "#34D399",
        secondary: "#10B981",
        background: "#064E3B",
        text: "#D1FAE5",
      },
      {
        name: "Sunset",
        primary: "#FB923C",
        secondary: "#F97316",
        background: "#7C2D12",
        text: "#FFEDD5",
      },
      // New theme with gold and olive
      {
        name: "Gold Olive",
        primary: "#D4AF37", // Gold
        secondary: "#708238", // Olive
        background: "#2F3A21", // Dark olive background
        text: "#F3F4F6", // Light text for contrast
      },
    ],
  },
};

const THEME_PRESETS = [
  {
    name: "Default",
    light: {
      primary: "#4F46E5",
      secondary: "#7C3AED",
      background: "#FFFFFF",
      text: "#111827",
    },
    dark: {
      primary: "#818CF8",
      secondary: "#A78BFA",
      background: "#111827",
      text: "#F9FAFB",
    },
  },
  {
    name: "Ocean",
    light: {
      primary: "#0EA5E9",
      secondary: "#0284C7",
      background: "#F0F9FF",
      text: "#0C4A6E",
    },
    dark: {
      primary: "#38BDF8",
      secondary: "#0EA5E9",
      background: "#0C4A6E",
      text: "#E0F2FE",
    },
  },
  // ... other presets ...
  // New preset for Gold Olive
  {
    name: "Gold Olive",
    light: {
      primary: "#D4AF37",
      secondary: "#708238",
      background: "#F3F4F6",
      text: "#2F3A21",
    },
    dark: {
      primary: "#D4AF37",
      secondary: "#708238",
      background: "#2F3A21",
      text: "#F3F4F6",
    },
  },
];

export default function ThemeSettings({
  settings,
  onSave,
  isSaving = false,
}: ThemeSettingsProps) {
  const defaultTheme = {
    mode: "system" as const,
    colors: {
      light: {
        primary: "#4F46E5",
        secondary: "#6366F1",
        background: "#FFFFFF",
        text: "#111827",
      },
      dark: {
        primary: "#6366F1",
        secondary: "#818CF8",
        background: "#111827",
        text: "#FFFFFF",
      },
    },
  };

  // Ensure we have a valid theme object even if settings is null
  const currentTheme = settings?.theme ?? defaultTheme;

  const [isMounted, setIsMounted] = useState(false);
  // Initialize state with currentTheme values and provide default values
  const [mode, setMode] = useState<"light" | "dark" | "system">(
    currentTheme.mode
  );
  const [colors, setColors] = useState<typeof defaultTheme.colors>(
    currentTheme.colors || defaultTheme.colors
  );
  const [activeColorPicker, setActiveColorPicker] = useState<{
    theme: "light" | "dark";
    key: string;
  } | null>(null);

  // Update state when settings change
  useEffect(() => {
    if (settings?.theme) {
      setMode(settings.theme.mode);
      setColors(settings.theme.colors);
    }
  }, [settings]);

  // Handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleColorChange = (
    theme: "light" | "dark",
    key: string,
    color: string
  ) => {
    setColors((prev) => ({
      ...prev,
      [theme]: {
        ...prev[theme],
        [key]: color,
      },
    }));
  };

  const handleSave = () => {
    onSave({
      theme: {
        mode,
        colors,
      },
    });
  };

  const handlePresetSelect = (preset: (typeof THEME_PRESETS)[0]) => {
    setColors({
      light: preset.light,
      dark: preset.dark,
    });
  };

  const ColorPreview = ({
    theme,
    colorKey,
  }: {
    theme: "light" | "dark";
    colorKey: string;
  }) => {
    const color =
      colors[theme][colorKey as keyof (typeof colors)[typeof theme]];
    const isActive =
      activeColorPicker?.theme === theme && activeColorPicker?.key === colorKey;

    return (
      <div className="relative">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {colorKey}
          </label>
          <div className="flex space-x-2">
            {/* Color Input */}
            <div className="flex-1 relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded border"
                style={{ backgroundColor: color }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (newColor.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                    handleColorChange(theme, colorKey, newColor);
                  }
                }}
                onBlur={(e) => {
                  const newColor = e.target.value;
                  if (!newColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                    handleColorChange(theme, colorKey, color);
                  }
                }}
                className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Color Picker Button */}
            <button
              type="button"
              onClick={() => setActiveColorPicker({ theme, key: colorKey })}
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              <ColorWheelIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Predefined Colors */}
          <div className="flex items-center space-x-2 pt-2">
            <span className="text-xs text-gray-500">Presets:</span>
            <div className="flex space-x-1">
              {PREDEFINED_COLORS[theme].themes.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    handleColorChange(
                      theme,
                      colorKey,
                      preset[colorKey as keyof typeof preset]
                    )
                  }
                  className="w-6 h-6 rounded-full border shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: preset[colorKey as keyof typeof preset],
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Color Picker Popover */}
        {isActive && isMounted && (
          <div className="absolute z-10 mt-2">
            <div
              className="fixed inset-0"
              onClick={() => setActiveColorPicker(null)}
            />
            <div className="relative">
              <div className="absolute z-50 shadow-xl rounded-lg overflow-hidden">
                <Sketch
                  style={{ width: "240px" }}
                  color={color}
                  onChange={(color) =>
                    handleColorChange(theme, colorKey, color.hex)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add a guard clause for the ColorPreview component
  if (!colors || !colors.light || !colors.dark) {
    return null; // or some loading state
  }

  return (
    <div className="space-y-8">
      {/* Theme Presets */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Theme Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className="p-4 rounded-lg border-2 hover:border-indigo-500 transition-all group"
            >
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div
                      className="h-6 w-full rounded"
                      style={{ backgroundColor: preset.light.primary }}
                    />
                    <div
                      className="h-6 w-full rounded"
                      style={{ backgroundColor: preset.light.secondary }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div
                      className="h-6 w-full rounded"
                      style={{ backgroundColor: preset.dark.primary }}
                    />
                    <div
                      className="h-6 w-full rounded"
                      style={{ backgroundColor: preset.dark.secondary }}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                  {preset.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Mode Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Default Theme Mode
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "light", icon: SunIcon, label: "Light" },
            { value: "dark", icon: MoonIcon, label: "Dark" },
            { value: "system", icon: ComputerDesktopIcon, label: "System" },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setMode(value as "light" | "dark" | "system")}
              className={`
                relative overflow-hidden group rounded-xl p-4 transition-all duration-300
                ${
                  mode === value
                    ? "bg-indigo-50 border-2 border-indigo-500"
                    : "border-2 border-gray-100 hover:border-indigo-200"
                }
              `}
            >
              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={`w-8 h-8 mb-2 transition-colors duration-300 ${
                    mode === value
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-indigo-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    mode === value
                      ? "text-indigo-600"
                      : "text-gray-600 group-hover:text-indigo-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {mode === value && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palettes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Color Palette
        </h3>

        {/* Light Theme Colors */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <SunIcon className="w-5 h-5 text-gray-400" />
            <h4 className="text-base font-medium text-gray-700">Light Theme</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(colors.light).map((key) => (
              <ColorPreview key={key} theme="light" colorKey={key} />
            ))}
          </div>
        </div>

        {/* Dark Theme Colors */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <MoonIcon className="w-5 h-5 text-gray-400" />
            <h4 className="text-base font-medium text-gray-700">Dark Theme</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(colors.dark).map((key) => (
              <ColorPreview key={key} theme="dark" colorKey={key} />
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-300"
        >
          {isSaving ? "Saving..." : "Save Theme Settings"}
        </button>
      </div>
    </div>
  );
}

// Simple color wheel icon component
const ColorWheelIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V22M12 2C14.5 2 17 7 17 12C17 17 14.5 22 12 22M12 2C9.5 2 7 7 7 12C7 17 9.5 22 12 22"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12H22"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import React, { useState } from "react";
import { Settings, settingsService } from "@/services/settingsService";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Toast from "../ui/Toast";

interface BackupSettingsProps {
  settings: Settings | null;
  onSave: (settings: Partial<Settings>) => Promise<void>;
  isSaving: boolean;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const handleExport = async () => {
    try {
      const data = await settingsService.exportSettings();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `settings-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("success", "Settings exported successfully");
    } catch (error) {
      showToast("error", "Failed to export settings");
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedSettings = JSON.parse(content);
          await settingsService.importSettings(importedSettings);
          showToast("success", "Settings imported successfully");
          // Refresh the page to show new settings
          window.location.reload();
        } catch (error) {
          showToast("error", "Invalid settings file");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      showToast("error", "Failed to import settings");
    }
    // Reset the input
    event.target.value = "";
  };

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all settings to default? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const defaultSettings = await settingsService.resetSettings();
      onSave(defaultSettings);
      showToast("success", "Settings reset to default");
    } catch (error) {
      showToast("error", "Failed to reset settings");
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
  };

  return (
    <div className="space-y-8">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Export Settings */}
        <div className="relative group">
          <div className="h-48 flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
            <ArrowDownTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
            <button
              onClick={handleExport}
              className="text-sm font-medium text-gray-900 hover:text-indigo-500"
            >
              Export Settings
            </button>
            <p className="text-xs text-gray-500 text-center px-4">
              Download a backup of your current settings
            </p>
          </div>
        </div>

        {/* Import Settings */}
        <div className="relative group">
          <div className="h-48 flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
            <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
            <label className="cursor-pointer">
              <span className="text-sm font-medium text-gray-900 hover:text-indigo-500">
                Import Settings
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-gray-500 text-center px-4">
              Restore settings from a backup file
            </p>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="relative group">
          <div className="h-48 flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-500 transition-colors">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 group-hover:text-red-500" />
            <button
              onClick={handleReset}
              className="text-sm font-medium text-gray-900 hover:text-red-500"
            >
              Reset to Default
            </button>
            <p className="text-xs text-gray-500 text-center px-4">
              Reset all settings to their default values
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.873-1.562 3.157-1.562 4.03 0l6.28 11.226c.875 1.562-.217 3.519-2.015 3.519H4.22c-1.798 0-2.89-1.957-2.015-3.519l6.28-11.226zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Importing settings will overwrite all your current settings.
                Make sure to export your current settings as a backup before
                importing new ones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;

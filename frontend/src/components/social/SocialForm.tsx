import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  LinkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { socialService, Social } from "@/services/socialService";
import Toast from "../ui/Toast";

// Predefined social media icons with platform names
const SOCIAL_ICONS = {
  Facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  Twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
  Instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>`,
  LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  YouTube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
};

export default function SocialForm() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [newSocial, setNewSocial] = useState({
    platform: "",
    url: "",
    icon: "",
    isActive: true,
  });
  const [editingSocial, setEditingSocial] = useState<Social | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });
  const [previewIcon, setPreviewIcon] = useState("");
  const [showCustomIcon, setShowCustomIcon] = useState(false);

  useEffect(() => {
    loadSocials();
  }, []);

  useEffect(() => {
    // Preview icon when input changes
    if (newSocial.icon && isValidSVG(newSocial.icon)) {
      setPreviewIcon(newSocial.icon);
    } else {
      setPreviewIcon("");
    }
  }, [newSocial.icon]);

  useEffect(() => {
    if (!showCustomIcon) {
      setNewSocial((prev) => ({ ...prev, platform: "" }));
    }
  }, [showCustomIcon]);

  const isValidSVG = (svg: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      return !doc.querySelector("parsererror");
    } catch {
      return false;
    }
  };

  const loadSocials = async () => {
    try {
      const data = await socialService.getAllSocials();
      setSocials(data);
    } catch (error) {
      showToast("error", "Failed to load social media links");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSVG(newSocial.icon)) {
      showToast("error", "Please enter a valid SVG icon");
      return;
    }
    try {
      if (editingSocial) {
        await socialService.updateSocial(editingSocial._id, newSocial);
        showToast("success", "Social media updated successfully");
      } else {
        await socialService.createSocial(newSocial);
        showToast("success", "Social media added successfully");
      }
      setNewSocial({ platform: "", url: "", icon: "", isActive: true });
      setEditingSocial(null);
      setPreviewIcon("");
      setShowCustomIcon(false);
      loadSocials();
    } catch (error) {
      showToast("error", "Failed to save social media");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social media link?"))
      return;
    try {
      await socialService.deleteSocial(id);
      showToast("success", "Social media deleted successfully");
      loadSocials();
    } catch (error) {
      showToast("error", "Failed to delete social media");
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
  };

  const handleIconSelect = (platform: string, icon: string) => {
    setNewSocial((prev) => ({
      ...prev,
      platform,
      icon,
    }));
    setShowCustomIcon(false);
  };

  return (
    <div className="space-y-8">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingSocial ? "Edit Social Media" : "Add New Social Media"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon Selection */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
              {Object.entries(SOCIAL_ICONS).map(([platform, svg]) => (
                <label key={platform} className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="socialIcon"
                    className="sr-only peer"
                    checked={newSocial.icon === svg}
                    onChange={() => handleIconSelect(platform, svg)}
                  />
                  <div
                    className="flex flex-col items-center p-3 rounded-xl border-2 border-transparent 
                    peer-checked:border-indigo-500 peer-checked:bg-indigo-50 
                    hover:border-indigo-200 transition-all duration-200"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: svg }}
                      className="w-8 h-8 text-gray-600 peer-checked:text-indigo-600 group-hover:text-indigo-500 transition-colors"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                    opacity-0 peer-checked:opacity-100 transition-opacity"
                  >
                    <div className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                      {platform}
                    </div>
                  </div>
                </label>
              ))}
              <label className="relative group cursor-pointer">
                <input
                  type="radio"
                  name="socialIcon"
                  className="sr-only peer"
                  checked={showCustomIcon}
                  onChange={() => setShowCustomIcon(true)}
                />
                <div
                  className="flex flex-col items-center p-3 rounded-xl border-2 border-transparent 
                  peer-checked:border-indigo-500 peer-checked:bg-indigo-50 
                  hover:border-indigo-200 transition-all duration-200"
                >
                  <PlusIcon className="w-8 h-8 text-gray-600 peer-checked:text-indigo-600 group-hover:text-indigo-500" />
                </div>
                <div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                  opacity-0 peer-checked:opacity-100 transition-opacity"
                >
                  <div className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                    Custom
                  </div>
                </div>
              </label>
            </div>

            {/* Custom Icon Inputs - show platform name input when custom icon is selected */}
            {showCustomIcon && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter platform name"
                    value={newSocial.platform}
                    onChange={(e) =>
                      setNewSocial((prev) => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                    className="block w-full rounded-lg border-gray-200 
                      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SVG Icon
                    </label>
                    <textarea
                      placeholder="Paste custom SVG code here"
                      value={newSocial.icon}
                      onChange={(e) =>
                        setNewSocial((prev) => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      className="block w-full rounded-lg border-gray-200 
                        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      rows={4}
                      required
                    />
                  </div>
                  {previewIcon && (
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg min-w-[100px]">
                      <p className="text-xs text-gray-500 mb-2">Preview</p>
                      <div
                        dangerouslySetInnerHTML={{ __html: previewIcon }}
                        className="w-8 h-8"
                      />
                      {newSocial.platform && (
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          {newSocial.platform}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  placeholder="Enter URL (e.g., https://twitter.com/username)"
                  value={newSocial.url}
                  onChange={(e) =>
                    setNewSocial((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="block w-full rounded-lg border-gray-200 pl-10 
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              {editingSocial && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSocial(null);
                    setNewSocial({
                      platform: "",
                      url: "",
                      icon: "",
                      isActive: true,
                    });
                    setPreviewIcon("");
                    setShowCustomIcon(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                    border border-gray-300 rounded-lg hover:bg-gray-50 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                  rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingSocial ? "Update" : "Add"} Social Media
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socials.length === 0 ? (
              <div className="sm:col-span-3 text-center py-6">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No social media links
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new social media link.
                </p>
              </div>
            ) : (
              socials.map((social) => (
                <div
                  key={social._id}
                  className="relative group p-4 border rounded-lg hover:border-indigo-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        dangerouslySetInnerHTML={{ __html: social.icon }}
                        className="w-6 h-6"
                      />
                      <h3 className="font-medium text-gray-900">
                        {social.platform}
                      </h3>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingSocial(social);
                          setNewSocial({
                            platform: social.platform,
                            url: social.url,
                            icon: social.icon,
                            isActive: social.isActive,
                          });
                          setPreviewIcon(social.icon);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(social._id)}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-gray-600 hover:text-indigo-600 break-all block"
                  >
                    {social.url}
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

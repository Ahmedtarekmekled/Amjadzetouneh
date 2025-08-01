import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import RichTextEditor from "../ui/RichTextEditor";
import FileUpload from "../ui/FileUpload";
import {
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  DocumentIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { aboutService } from "@/services/aboutService";
import Toast from "../ui/Toast";
import SkillInput from "../ui/SkillInput";
import ImageCropper from "../ui/ImageCropper";
import axios from "axios";
import { API_URL } from "@/config/constants";

interface AboutFormProps {
  initialData?: AboutFormData;
  onSubmit: (data: AboutFormData) => void;
  isSubmitting: boolean;
}

interface AboutFormData {
  profileImage?: string;
  cvFile?: string;
  showCV: boolean;
  content: {
    en: {
      description: string;
      experience: string;
      skills: string[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
    };
    ar: {
      description: string;
      experience: string;
      skills: string[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
    };
  };
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

export default function AboutForm({
  initialData,
  onSubmit,
  isSubmitting,
}: AboutFormProps) {
  const [formData, setFormData] = useState<AboutFormData>(
    initialData || {
      profileImage: "",
      cvFile: "",
      showCV: true,
      content: {
        en: {
          description: "",
          experience: "",
          skills: [],
          education: [],
        },
        ar: {
          description: "",
          experience: "",
          skills: [],
          education: [],
        },
      },
    }
  );

  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const [cropImage, setCropImage] = useState<string | null>(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await aboutService.getAbout();
        setFormData((prev) => ({
          ...prev,
          content: data.content,
          profileImage: data.profileImage || "",
          cvFile: data.cvFile || "",
          showCV: data.showCV,
        }));
      } catch (error) {
        console.error("Error loading about:", error);
        setToast({
          show: true,
          type: "error",
          message: "Failed to load about content",
        });
      }
    };

    loadAbout();
  }, []);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = async (croppedImage: string) => {
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const uploadResponse = await axios.post(
        `${API_URL}/upload/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      handleImageUpload(uploadResponse.data.url);
      setCropImage(null);
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to upload cropped image",
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: url,
    }));
  };

  const handleCVUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      cvFile: url,
    }));
  };

  const handleDeleteFile = async (type: "image" | "cv") => {
    try {
      await aboutService.deleteFile(type);
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "profileImage" : "cvFile"]: "",
      }));
      setToast({
        show: true,
        type: "success",
        message: `${
          type === "image" ? "Profile image" : "CV"
        } deleted successfully`,
      });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setToast({
        show: true,
        type: "error",
        message: `Failed to delete ${type}`,
      });
    }
  };

  const handleContentChange = (
    lang: "en" | "ar",
    field: "description" | "experience",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [field]: value,
        },
      },
    }));
  };

  const handleSkillAdd = (lang: "en" | "ar", skill: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          skills: [...prev.content[lang].skills, skill],
        },
      },
    }));
  };

  const handleSkillDelete = (lang: "en" | "ar", index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          skills: prev.content[lang].skills.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const handleEducationAdd = (lang: "en" | "ar") => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          education: [
            ...prev.content[lang].education,
            { degree: "", institution: "", year: "" },
          ],
        },
      },
    }));
  };

  const handleEducationChange = (
    lang: "en" | "ar",
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          education: prev.content[lang].education.map((edu, i) =>
            i === index ? { ...edu, [field]: value } : edu
          ),
        },
      },
    }));
  };

  const handleEducationDelete = (lang: "en" | "ar", index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          education: prev.content[lang].education.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const getDownloadUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL.replace("/api", "")}${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setToast({
        show: true,
        type: "success",
        message: "About content updated successfully",
      });
    } catch (error) {
      console.error("Error updating about:", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to update about content",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Image Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Image
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload your professional photo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {formData.profileImage ? (
              <div className="relative group">
                <div
                  className="w-48 h-48 mx-auto overflow-hidden rounded-full cursor-pointer ring-4 ring-white dark:ring-gray-800 shadow-lg"
                  onClick={() =>
                    document.getElementById("profile-image-upload")?.click()
                  }
                >
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center rounded-full">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Click to change
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFile("image")}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div
                  className="w-48 h-48 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-800"
                  onClick={() =>
                    document.getElementById("profile-image-upload")?.click()
                  }
                >
                  <PhotoIcon className="h-12 w-12 text-blue-400 dark:text-blue-500" />
                  <span className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Upload Profile Image
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click to select
                  </p>
                </div>
              </div>
            )}
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* CV Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DocumentIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CV Document
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload your resume or CV
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showCV}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showCV: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show CV publicly
                </span>
              </label>
            </div>

            {formData.cvFile ? (
              <div className="relative group p-4 border border-green-200 dark:border-green-700 rounded-lg bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <DocumentIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <a
                      href={getDownloadUrl(formData.cvFile)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Download CV
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.cvFile.split("/").pop()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile("cv")}
                    className="ml-auto p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <FileUpload
                type="cv"
                onUpload={handleCVUpload}
                onError={(error) =>
                  setToast({
                    show: true,
                    type: "error",
                    message: error,
                  })
                }
              >
                <div className="flex flex-col items-center p-6 border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-500 transition-colors">
                  <DocumentIcon className="h-12 w-12 text-green-400 dark:text-green-500" />
                  <span className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                    Upload CV
                  </span>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    PDF or Word document
                  </p>
                </div>
              </FileUpload>
            )}
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropImage && (
        <ImageCropper
          image={cropImage}
          onCrop={handleCroppedImage}
          onCancel={() => setCropImage(null)}
        />
      )}

      {/* Content Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-gray-50 dark:bg-gray-700 p-1">
            <Tab
              className={({ selected }) =>
                clsx(
                  "flex-1 px-4 py-3 text-sm font-medium rounded-lg focus:outline-none transition-colors",
                  selected
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🇺🇸</span>
                <span>English</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  "flex-1 px-4 py-3 text-sm font-medium rounded-lg focus:outline-none transition-colors",
                  selected
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🇸🇦</span>
                <span>العربية</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels className="p-6">
            {["en", "ar"].map((lang) => (
              <Tab.Panel key={lang} className="space-y-8">
                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === "en" ? "Description" : "الوصف"}
                    </label>
                  </div>
                  <RichTextEditor
                    value={formData.content[lang as "en" | "ar"].description}
                    onChange={(value) =>
                      handleContentChange(
                        lang as "en" | "ar",
                        "description",
                        value
                      )
                    }
                  />
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === "en" ? "Experience" : "الخبرات"}
                    </label>
                  </div>
                  <RichTextEditor
                    value={formData.content[lang as "en" | "ar"].experience}
                    onChange={(value) =>
                      handleContentChange(
                        lang as "en" | "ar",
                        "experience",
                        value
                      )
                    }
                  />
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                      <SparklesIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      {lang === "en" ? "Skills" : "المهارات"}
                    </label>
                  </div>
                  <SkillInput
                    skills={formData.content[lang as "en" | "ar"].skills}
                    onAdd={(skill) =>
                      handleSkillAdd(lang as "en" | "ar", skill)
                    }
                    onDelete={(index) =>
                      handleSkillDelete(lang as "en" | "ar", index)
                    }
                    placeholder={lang === "en" ? "Add a skill" : "أضف مهارة"}
                  />
                </div>

                {/* Education */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <AcademicCapIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {lang === "en" ? "Education" : "التعليم"}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEducationAdd(lang as "en" | "ar")}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      {lang === "en" ? "Add Education" : "إضافة تعليم"}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.content[lang as "en" | "ar"].education.map(
                      (edu, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                        >
                          <div className="flex-1 space-y-4">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(
                                  lang as "en" | "ar",
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              placeholder={
                                lang === "en" ? "Degree" : "الدرجة العلمية"
                              }
                              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                            />
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) =>
                                handleEducationChange(
                                  lang as "en" | "ar",
                                  index,
                                  "institution",
                                  e.target.value
                                )
                              }
                              placeholder={
                                lang === "en"
                                  ? "Institution"
                                  : "المؤسسة التعليمية"
                              }
                              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                            />
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) =>
                                handleEducationChange(
                                  lang as "en" | "ar",
                                  index,
                                  "year",
                                  e.target.value
                                )
                              }
                              placeholder={lang === "en" ? "Year" : "السنة"}
                              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleEducationDelete(lang as "en" | "ar", index)
                            }
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}

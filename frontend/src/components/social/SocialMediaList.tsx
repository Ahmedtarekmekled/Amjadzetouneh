import { useState } from "react";
import { Social } from "@/services/socialService";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import SocialMediaForm from "./SocialMediaForm";
import LoadingSpinner from "../ui/LoadingSpinner";

interface SocialMediaListProps {
  socials: Social[];
  onUpdate: (id: string, data: Partial<Social>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function SocialMediaList({
  socials,
  onUpdate,
  onDelete,
  isLoading,
}: SocialMediaListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {socials.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No social media links added yet.
        </p>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Platform
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  URL
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {socials.map((social) => (
                <tr key={social._id}>
                  {editingId === social._id ? (
                    <td colSpan={4} className="px-3 py-4">
                      <SocialMediaForm
                        initialData={social}
                        onSubmit={async (data) => {
                          await onUpdate(social._id, data);
                          setEditingId(null);
                        }}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={`/icons/${social.icon}.svg`}
                            alt={social.platform}
                            className="h-5 w-5 mr-2"
                          />
                          {social.platform}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {social.url}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            social.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {social.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(social._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button
                            onClick={() => onDelete(social._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

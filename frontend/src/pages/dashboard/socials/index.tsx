import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { socialService, Social } from "@/services/socialService";
import Toast from "@/components/ui/Toast";
import { NextPage } from "next";
import SocialForm from "@/components/social/SocialForm";

const SocialsPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    type: "success" as const,
    message: "",
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Social Media Management
              </h1>
              <SocialForm />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SocialsPage;

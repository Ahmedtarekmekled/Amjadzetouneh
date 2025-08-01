import { useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";

export const useAnalytics = (postId: string) => {
  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        await analyticsService.trackView(postId);
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    // Only track if we have a valid postId
    if (postId) {
      trackView();
    }
  }, [postId]);
};

export default useAnalytics;

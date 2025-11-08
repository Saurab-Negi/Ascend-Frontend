// src/components/PostLoginRedirect.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import type { SubscriptionPlan } from "../../types/subscription";
import Api from "../../services/subscription/subscription";
import Api2 from "../../services/Auth/Auth";

export default function PostLoginRedirect() {
  const navigate = useNavigate();
  const { data: planData, isLoading: isPlansLoading } = useFetch<{
    data: SubscriptionPlan[];
  }>("plans", Api.GetAllSubscriptions());
  const { data: userData, isLoading: isUserLoading } = useFetch(
    "user",
    Api2.GetUser()
  );
  const userInfo = userData?.data?.userInfo;
  const allPlans = planData?.data || [];
  const currentPlan = allPlans.find((plan) => plan.id === userInfo?.planId)?.planType || "Free";
  const isPaidUser = currentPlan && currentPlan !== "Free";

  useEffect(() => {
    if (isUserLoading || isPlansLoading) return;
    navigate(isPaidUser? "/dashboard" : "/subscription");
  }, [isUserLoading, isPlansLoading, isPaidUser, navigate]);

  return (
    <div className="animate-pulse min-h-screen bg-gray-100 p-6">
      <div className="h-10 bg-gray-300 rounded mb-6 w-1/3"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="h-32 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

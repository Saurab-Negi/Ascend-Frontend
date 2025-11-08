import { Navigate, Outlet, useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { SubscriptionPlan } from "../types/subscription";
import Api from "../services/subscription/subscription";
import Api2 from "../services/Auth/Auth";


const ProtectedRoute = () => {
  const location = useLocation();
  const { data: planData, isLoading: isPlansLoading } = useFetch<{ data: SubscriptionPlan[] }>("plans", Api.GetAllSubscriptions());
  const { data: userData, isLoading: isUserLoading } = useFetch("user", Api2.GetUser());

  const isAuthenticated = !!localStorage.getItem("token");

  // Show loading screen until both user and plan data are available
  if (isPlansLoading || isUserLoading) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const IsSoulScore = !!userData?.data?.soulScore && userData.data.soulScore.length > 0;

  if (!IsSoulScore && location.pathname !== "/splesh") {
    return <Navigate to="/splesh" replace />;
  }

  const userInfo = userData?.data?.userInfo;
  const allPlans = planData?.data || [];
  const currentPlan = allPlans.find((plan) => plan.id === userInfo?.planId)?.planType || "Free";

function isExpiredFromTimestamp(timestamp: number) {
  const expiryDate = new Date(timestamp);
  const now = new Date();

  return expiryDate.getTime() < now.getTime();
}

  const createdAt = userInfo?.createdAt;
  const userCreatedDate = new Date(createdAt);
  const now = new Date();
  const dayDiff = (now.getTime() - userCreatedDate.getTime()) / (1000 * 60 * 60 * 24);

  if (dayDiff > 7 && currentPlan === "Free" && location.pathname !== "/subscription") {
    return <Navigate to="/subscription" replace />;
  }
  if(isExpiredFromTimestamp(userData?.data?.userInfo?.planExpiresAt!) && location.pathname !== "/subscription") {
    return <Navigate to="/subscription" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

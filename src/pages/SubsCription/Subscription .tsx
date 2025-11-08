import { FaCrown } from "react-icons/fa6";
import { Card, CardContent } from "../../components/Card/Card";
import useFetch from "../../hooks/useFetch";
import type { SubscriptionPlan } from "../../types/subscription";
import Api from "../../services/subscription/subscription";
import Api2 from "../../services/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import usePost from "../../hooks/usePost";
import CancleSubscription from "../../components/Modal/CancleSubscription";

const nextDarkerMap: Record<string, string> = {
  "bg-indigo-100": "bg-indigo-300",
  "bg-indigo-300": "bg-indigo-500",
  "bg-green-100": "bg-green-300",
  "bg-green-300": "bg-green-500",
  "bg-lime-100": "bg-lime-300",
  "bg-lime-300": "bg-lime-500",
  "bg-yellow-100": "bg-yellow-300",
  "bg-yellow-300": "bg-yellow-500",
  "bg-orange-100": "bg-orange-300",
  "bg-pink-100": "bg-pink-300",
  "bg-pink-300": "bg-pink-500",
};

function getDarkerTailwindClass(baseColor: string): string {
  return nextDarkerMap[baseColor] || baseColor;
}

export default function Subscription() {
  const [loading, setLoading] = useState<string>("");
  const[open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const { data: planData } = useFetch<{ data: SubscriptionPlan[] }>(
    "plans",
    Api.GetAllSubscriptions()
  );
  const { data: userData } = useFetch("user", Api2.GetUser());
  const { post } = usePost();
  const userInfo = userData?.data?.userInfo;

  const allPlans = planData?.data || [];
  const currentPlan =
    allPlans.find((plan) => plan.id === userInfo?.planId)?.planType || "Free";

  const createdAt = userInfo?.createdAt;
  const userCreatedDate = new Date(createdAt);
  const now = new Date();
  const dayDiff =
    (now.getTime() - userCreatedDate.getTime()) / (1000 * 60 * 60 * 24);

  function startJourney() {
    if (!createdAt) return;

    if (currentPlan === "Free" && dayDiff <= 7) {
      navigate("/splesh");
    }else if(isExpiredFromTimestamp(userInfo?.planExpiresAt)){
     setError(
        "Your Plan has expired. Please choose a subscription plan."
      );
    } else if (currentPlan !== "Free") {
      navigate("/splesh");
    } else{
      setError(
        "Your free trial has expired. Please choose a subscription plan."
      );
    }
  }

  async function handlePlan(planId: string) {
    if(isExpiredFromTimestamp(userInfo?.planExpiresAt)){
      setLoading(planId);
   
    const response = await post(Api.subscriptionaymentLink(), {
      planId: planId,
    });
    setLoading("");

    if (response?.data?.data?.url) {
    return  window.location.href = response?.data?.data?.url;
    }
    }
    if(userInfo?.planId === planId) return
    setLoading(planId);
    const response = await post(Api.subscriptionaymentLink(), {
      planId: planId,
    });
    setLoading("");

    if (response?.data?.data?.url) {
      window.location.href = response?.data?.data?.url;
    }
  }

    function isExpiredFromTimestamp(timestamp: number) {
  const expiryDate = new Date(timestamp);
  const today = new Date();

  return expiryDate.getTime() < today.getTime();
}

  const setIsOpen = () => setOpen(false);
  return (
    <>
      {allPlans.length === 0 && currentPlan === "Free" ? (
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 animate-pulse border rounded shadow bg-white mt-10"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 max-w-6xl mx-auto font-poppins mt-[2.5rem] h-full">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-[1.7rem] md:text-[1.9rem] lg:text-[2.1rem] font-bold flex justify-center items-center gap-2">
              <FaCrown className="text-[#004236]" size={24} /> Subscription
              Plans
            </h2>
            <p className="text-[1.1rem] text-black mt-2">
              Choose the perfect plan for your spiritual transformation journey
              with Ascend's comprehensive wellness platform featuring coaching,
              soundscapes, and AI analysis
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-purple-100 inline-flex flex-col items-center text-center rounded-lg py-4 px-6 mb-5 w-fit mx-auto">
              <p className="font-semibold">Your Current Plan</p>
              <p className="font-medium text-sm">
                {currentPlan}{" "}
                {currentPlan === "Free"
                  ? `${Math.max(0, Math.floor(7 - dayDiff))} days left`
                  : ""}
              </p>
              <span className="text-[1rem] text-gray-500">Status : <span className={
  currentPlan === "Free" ? `${7 - dayDiff<0 ? "text-red-500" : "text-green-500"}` : isExpiredFromTimestamp(userInfo?.planExpiresAt) ? "text-red-500" : "text-green-500"
  
}
>
                {currentPlan === "Free"
                  ? `${7 - dayDiff<0 ? " Expired" : "Active"} `
                  : isExpiredFromTimestamp(userInfo?.planExpiresAt) ? "Expired" : "Active"}</span>
                  </span>
            </div>
          </div>
          

          <div className="flex flex-wrap justify-center gap-6">
            {allPlans.map((plan, idx) => (
              <Card
                key={idx}
                className={`${
                  plan.planColor
                } py-4 px-2 h-full sm:min-w-[350px] min-w-[290px] transform transition-transform duration-800 ease-in-out hover:scale-105 ${
                  userInfo?.planId === plan.id
                    ? "border-2 border-[#004236]"
                    : ""
                }`}
              >
                <CardContent className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 font-poppins rounded-full flex justify-center items-center bg-gray-100">
                    <img
                      src={plan.planIcon}
                      alt={plan.planType}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="font-medium text-[1.2rem]">{plan.planType}</h3>
                  <p className="text-xl font-bold">${plan.planPrice}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {plan?.services.map((feature, i) => (
                      <li key={i}>✓ {feature.name}</li>
                    ))}
                  </ul>
                  <div className="flex justify-between gap-2">
                     <button
                    className={`${getDarkerTailwindClass(
                      plan.planColor
                    )} mt-2 py-1 px-3 rounded font-regular text-[1.1rem] font-sans text-white`}
                    onClick={() => handlePlan(plan.id)}
                  >
                    {loading === plan.id ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : userInfo?.planId === plan.id ?
                    `${ isExpiredFromTimestamp(userInfo?.planExpiresAt) ? "Choose Plan" : "Current Plan"}`
                      : (
                      "Choose Plan"
                    )}
                  </button>
                  {userInfo?.planId === plan.id && !isExpiredFromTimestamp(userInfo?.planExpiresAt) && userInfo?.isSubActive &&<button
                    className={`${getDarkerTailwindClass(
                      plan.planColor
                    )} mt-2 py-1 px-3 rounded font-regular text-[1.1rem] font-sans text-white`}
                    onClick={() => setOpen(true)}
                  >
                    Cancel Plan
                  </button>}
                  </div>
                 
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center font-inter mt-8 text-black text-[1.1rem] font-poppins">
             <p className="text-[1.4rem] font-semibold">
    30-Day Money Back Guarantee
  </p>
  <p className="mt-1  font-normal text-[#1A1A1A]">
    Transform your spiritual journey risk free. Cancel anytime, with full refund
  </p>
          </div>
         <p className="text-center text-red-500 text-sm my-2">{error}</p>
          <div className="flex justify-center mt-4">
            <button
              className="bg-[#004236] text-white py-1 px-3 rounded font-semibold "
              onClick={() => startJourney()}
            >
              Start Journey
            </button>
          </div>
        </div>
      )}
      {<CancleSubscription isOpen={open} setIsOpen={setIsOpen}/>}
    </>
  );
}

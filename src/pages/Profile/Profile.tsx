import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import Api from "../../services/Auth/Auth";
import Api2 from "../../services/subscription/subscription";
import type { SubscriptionPlan } from "../../types/subscription";
import formatToShortMonth from "../../utils/DateFormatter";
import ProfileEdit from "../../components/Modal/ProfileEdit";

function Profile() {
  const [Open, setOpen] = useState(false);

  const { data } = useFetch("user", Api.GetUser());
  const { data: planData } = useFetch<{ data: SubscriptionPlan[] }>(
    "plans",
    Api2.GetAllSubscriptions()
  );
  const planeName =
    planData?.data?.find((plan) => plan.id === data?.data?.userInfo?.planId)
      ?.planType || "Free";

  const setIsOpen = () => setOpen(false);

  return (
    <div className="min-h-[calc(100vh-7.5rem)] bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Profile Card */}
      <div className=" p-8 w-full max-w-md">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-1 border-[#004236]">
            {data?.data?.userInfo?.profileImg ? (
              <img
                src={data?.data?.userInfo?.profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-[#004236]">
                <span className="text-2xl font-bold text-white  w-12 h-12 flex items-center justify-center">
                  {data?.data?.userInfo?.firstName[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name & Email */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">{`${data?.data?.userInfo?.firstName} ${data?.data?.userInfo?.lastName}`}</h2>
          <p className="text-gray-500">{data?.data?.userInfo?.email}</p>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Plan</span>
            <span className="font-semibold text-[#004236]">{planeName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Level</span>
            <span className="font-semibold text-[#004236]">
              {data?.data?.userInfo?.level}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Joined</span>
            <span className="font-semibold">
              {formatToShortMonth(data?.data?.userInfo?.createdAt)}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Streak</span>
            <span className="font-semibold">
              {data?.data?.userInfo?.streak}
            </span>
          </div>
          <div className="flex justify-between  border-b pb-2">
            <span className="text-gray-600">Name</span>
            <span className="font-semibold">{`${data?.data?.userInfo?.firstName} ${data?.data?.userInfo?.lastName}`}</span>
          </div>
          <div className="flex justify-between  border-b pb-2">
            <span className="text-gray-600">Email</span>
            <span className="font-basic sm:font-semibold">
              {data?.data?.userInfo?.email}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <button
          className="mt-6 w-full bg-[#004236] hover:bg-[#004236] text-white py-2 px-4 rounded-lg transition"
          onClick={() => setOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      {
        <ProfileEdit
          isOpen={Open}
          setIsOpen={setIsOpen}
          userName={data?.data?.userInfo?.userName}
          Firstname={data?.data?.userInfo?.firstName}
          Lastname={data?.data?.userInfo?.lastName}
          profileImg={data?.data?.userInfo?.profileImg}
        />
      }
    </div>
  );
}

export default Profile;

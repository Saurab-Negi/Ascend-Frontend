import React, { useEffect, useState } from "react";
import type { modal } from "../../types/modal";
import { IoMdClose } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import usePatch from "../../hooks/usePatch";
import Api from "../../services/Auth/Auth";
import { useQueryClient } from "@tanstack/react-query";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";

function ProfileEdit({
  isOpen,
  setIsOpen,
  userName,
  Firstname,
  Lastname,
  profileImg,
}: modal) {
  const [formData, setFormData] = useState({
    Lastname: "",
    Firstname: " ",
    userName: "",
    profileImg: "",
  });

  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profile, setProfile] = useState<File | null>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [s3url, setS3url] = useState("");

  const { patch } = usePatch();
  const { post } = usePost();
  const { put } = usePut();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Lastname: Lastname ?? prev.Lastname,
      Firstname: Firstname ?? prev.Firstname,
      userName: userName ?? prev.userName,
      profileImg: profileImg ?? prev.profileImg,
    }));
  }, [Lastname, Firstname, userName, profileImg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSaveChnages() {
    if (oldPassword !== "" && newPassword !== "" && confirmPassword !== "") {
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        alert("User not authenticated.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert("Password changed successfully.");
        setIsOpen(false);
        clearStates();
      } catch (error: any) {
        console.error(error);
        setError("Error changing password.");
      }
    }
    try {
      if (profile) {
        await put(s3url, profile, profile?.type, true);
      }
      await patch(Api.EditUser(), {
        firstName: formData.Firstname,
        lastName: formData.Lastname,
        userName: formData.userName,
        profileImg: formData.profileImg,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsOpen(false);
      clearStates();
    } catch (error) {
      setError("Error saving changes. please try again.");
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfile(file);
    const url = URL.createObjectURL(file);
    setProfileUrl(url);
    const payload: { fileName: string; bucketName: string } = {
      fileName: file?.name,
      bucketName: "ascend-dev-st-key-logo",
    };
    const data = await post(Api.GenratePSUrl(), payload);
    setS3url(data?.data?.data?.presignedUrl?.split("?")[0]);
    setFormData((prev) => ({
      ...prev,
      profileImg: data?.data?.data?.presignedUrl?.split("?")[0],
    }));
  }

  //    const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (newPassword !== confirmPassword) {
  //       setError("New password and confirm password do not match.");
  //       return;
  //     }

  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (!user || !user.email) {
  //       alert("User not authenticated.");
  //       return;
  //     }

  //     const credential = EmailAuthProvider.credential(user.email, oldPassword);

  //     try {
  //       await reauthenticateWithCredential(user, credential);
  //       await updatePassword(user, newPassword);
  //       alert("Password changed successfully.");
  //       setIsOpen(false);
  //       clearStates()
  //     } catch (error: any) {
  //       console.error(error);
  //       setError( "Error changing password.");
  //     }
  //   };

  function clearStates() {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
    setError("");
    setProfile(null);
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl relative  ">
        {/* header */}
        <div className=" text-2xl p-4 text-gray-600 font-bold flex justify-between items-center">
          <button onClick={() => setIsOpen(false)}>
            <IoMdClose size={25} />
          </button>
        </div>
        <div className="flex flex-col items-center bg-gray-50 p-6">
          {/* Avatar */}
          <div className="border-4 border-[#004236] w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            <img
              src={profileUrl || formData.profileImg}
              className="h-10 w-10"
            />
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="bg-transparent mt-4 border-none outline-none text-sm text-gray-700 file:cursor-pointer file:bg-[#004236] file:text-white file:px-3 file:py-1 file:rounded-lg file:border-0 file:hover:bg-blue-600"
          />

          {/* Editable Fields */}
          <div className="mt-6 w-full max-w-sm space-y-4">
            {/* FirstName */}
            <div className="flex justify-between items-center border-b pb-2">
              <label className="text-gray-500">First Name</label>
              <input
                type="text"
                name="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                className="text-black font-medium text-right outline-none bg-transparent"
              />
            </div>
            {/* LastName */}
            <div className="flex justify-between items-center border-b pb-2">
              <label className="text-gray-500">Last Name</label>
              <input
                type="text"
                name="Lastname"
                value={formData.Lastname}
                onChange={handleChange}
                className="text-black font-medium text-right outline-none bg-transparent"
              />
            </div>
            {/* UserName */}
            <div className="flex justify-between items-center border-b pb-2">
              <label className="text-gray-500">User Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="text-black font-medium text-right outline-none bg-transparent"
              />
            </div>
            {show && (
              <div className="space-y-4">
                {/* Old Password */}
                <div className="flex justify-between items-center border-b pb-2">
                  <label className="text-gray-500"> Old Password</label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      placeholder="Enter old password"
                      className="w-full  px-3 py-2 pr-10 outline-none bg-transparent"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    >
                      {showOld ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                {/* New Password */}
                <div className="flex justify-between items-center border-b pb-2">
                  <label className="text-gray-500"> New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full  px-3 py-2 pr-10 outline-none bg-transparent"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    >
                      {showNew ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="flex justify-between items-center border-b pb-2">
                  <label className="text-gray-500"> Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full  px-3 py-2 pr-10 outline-none bg-transparent"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </div>
            )}
          </div>
          {/* Password Change */}
          <p
            className="text-blue-600 cursor-pointer underline mt-2"
            onClick={() => setShow(!show)}
          >
            Change Password
          </p>
          {/* Save Button */}
          <button
            className="mt-6 bg-[#004236] text-white px-6 py-2 rounded-md hover:bg-[#004236]"
            onClick={handleSaveChnages}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;

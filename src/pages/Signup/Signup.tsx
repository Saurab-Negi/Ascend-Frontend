import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
// import { updateProfile } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../../lib/Firebase";
import { useNavigate } from "react-router-dom";
import Api from "../../services/Auth/Auth";
import usePost from "../../hooks/usePost";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { post } = usePost();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      if (!userCredential.user) {
        throw new Error("User creation failed");
      }
      const user = userCredential.user;
       await sendEmailVerification(user);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        id: userCredential.user.uid,
        userName: form.email.split("@")[0],
      };
      // const token = await userCredential.user.getIdToken();
    const {data , error} =  await post(Api.CreateUser(), payload);

      if (error) {
        throw new Error(error);
      }
      if (data) {
       navigate("/verify-email");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const SignupWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      // const token = await userCredential.user.getIdToken();
      const displayName = userCredential.user.displayName || "";
      const email = userCredential.user.email || "";
      const [firstName, lastName] = displayName.split(" ");

      const payload = {
        firstName: firstName || "",
        lastName: lastName || "",
        email: email,
        id: userCredential.user.uid,
        userName: email.split("@")[0],
      };
      
      const {data , error} =  await post(Api.CreateUser(), payload);
  
      if (error) {
        throw new Error(error);
      }
      if (data) {
      navigate("/login");
      }
      
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const SignupWithApple = async () => {
    try {
      const userCredential = await signInWithPopup(auth, appleProvider);
      // const token = await userCredential.user.getIdToken();
      const displayName = userCredential.user.displayName || "";
      const email = userCredential.user.email || "";
      const [firstName, lastName] = displayName.split(" ");

      const payload = {
        firstName: firstName || "",
        lastName: lastName || "",
        email: email,
        id: userCredential.user.uid,
        userName: email.split("@")[0],
      };
      
      const {data , error} =  await post(Api.CreateUser(), payload);

      if (error) {
        throw new Error(error);
      }
      if (data) {
       navigate("/login");
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center  min-h-[calc(100vh-7.5rem)]">
      <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Enter your mail"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your password"
              className="mt-1 w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004236]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => handleChange(e)}
              required
              placeholder="Confirm your password"
              className="mt-1 w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004236]"
            />
            <button
              type="button"
              onClick={() => setshowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 text-white bg-[#004236] rounded-md hover:bg-[#004236] transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-[#004236] hover:underline">
            Log in
          </a>
        </p>

        <div className="flex items-center justify-between">
          <div className="border-t w-full"></div>
          <span className="px-2 text-sm text-gray-400">Or</span>
          <div className="border-t w-full"></div>
        </div>

        <button
          className="flex items-center justify-center gap-2 w-full py-2 border rounded-md hover:bg-gray-100 transition"
          onClick={SignupWithGoogle}
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <button
          className="flex items-center justify-center gap-2 w-full py-2 border rounded-md hover:bg-gray-100 transition"
          onClick={SignupWithApple}
        >
          <FaApple size={20} />
          <span>Sign up with Apple</span>
        </button>
      </div>
    </div>
  );
}

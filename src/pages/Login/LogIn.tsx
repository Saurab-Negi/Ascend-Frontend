import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../../lib/Firebase";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Api from "../../services/Auth/Auth";
import usePost from "../../hooks/usePost";

export default function LogIn() {
  const [userlogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { post } = usePost();

  const loginWithEmail = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userlogin.email,
        userlogin.password
      );
       const user = userCredential.user;
       if (!user.emailVerified) {
      // await auth.signOut();
      navigate("/verify-email");
      setError("Please verify your email before logging in.");
      return;
    }
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
       setLoading(false);
      navigate("/postRedirection");
    } catch (err) {
      setLoading(false);
      setError((err as Error).message);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      const isNewUser = (userCredential as any)._tokenResponse?.isNewUser;
      if (isNewUser) {
       
        const payload = {
          firstName: userCredential.user.displayName?.split(" ")[0] || "",
          lastName: userCredential.user.displayName?.split(" ")[1] || "",
          email: userCredential.user.email || "",
          id: userCredential.user.uid,
          userName: userCredential.user.email?.split("@")[0] || "",
        };
        await post(Api.CreateUser(), payload);
      }
      setLoading(false);
      navigate("/postRedirection");
    } catch (err) {
      setLoading(false);
      alert((err as Error).message);
    }
  };

  const loginWithApple = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, appleProvider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      const isNewUser = (userCredential as any)._tokenResponse?.isNewUser;
      if (isNewUser) {
        const payload = {
          firstName: userCredential.user.displayName?.split(" ")[0] || "",
          lastName: userCredential.user.displayName?.split(" ")[1] || "",
          email: userCredential.user.email || "",
          id: userCredential.user.uid,
          userName: userCredential.user.email?.split("@")[0] || "",
        };
        await post(Api.CreateUser(), payload);
      }
      setLoading(false);
      navigate("/postRedirection");
    } catch (err) {
      setLoading(false);
      alert((err as Error).message);
    }
  };
  const UserOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLogin({
      ...userlogin,
      [name]: value,
    });
  };

  return (
    <section className="flex items-center justify-center  min-h-[calc(100vh-7.5rem)]">
      <div className="w-80 mx-auto border border-gray-200 mt-10 p-6 bg-white rounded-xl shadow-xl space-y-4 text-sm font-medium text-gray-700">
        <h2 className="text-2xl font-bold text-center">Login to your Account</h2>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userlogin.email}
            onChange={(e) => UserOnChange(e)}
            placeholder="Enter your mail"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004236]"
          />
        </div>
        <div>
          <label>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userlogin.password}
              onChange={(e) => UserOnChange(e)}
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
        </div>

        {/* Remember Me and Forgot */}
        <div className="flex items-center justify-between text-xs mt-1">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-[#004236]" />
            <span>Remember Me</span>
          </label>
          <a href="/forgetpassword" className="text-[#004236] hover:underline">
            Forget Password
          </a>
        </div>
        <div className="text-red-600">{error}</div>
        {/* Sign In Button */}
        <Button
          className="w-full bg-[#004236] hover:bg-[#2D7467] text-white p-2 rounded-md transition"
          onClick={loginWithEmail}
          name="Sign In"
          
        />

        <div className="text-center text-gray-400 text-xs">Or</div>

        <p className="text-center text-sm mt-2">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#004236] hover:underline">
            sign up
          </a>
        </p>

        {/* Google Button */}
        <Button
          className="flex items-center justify-center gap-2 border w-full p-2 rounded-md hover:bg-gray-50"
          onClick={loginWithGoogle}
          name="Sign in by Google"
          children={<FcGoogle className="text-lg" />}
        ></Button>

        {/* Apple Button */}
        <Button
          className="flex items-center justify-center gap-2 border w-full p-2 rounded-md hover:bg-gray-50"
          onClick={loginWithApple}
          name="Sign in by Apple"
          children={<FaApple className="text-lg" />}
        />
      </div>
      {loading && (
    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#004236] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}
    </section>
  );
}

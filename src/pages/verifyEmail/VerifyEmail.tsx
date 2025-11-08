import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../../lib/Firebase";
import { useNavigate } from "react-router-dom";
// import Api from "../../services/Auth/Auth";
// import usePost from "../../hooks/usePost";

export default function VerifyEmail() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  // const { post } = usePost();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const checkVerification = async () => {

    if (!user) return;

    setLoading(true);
    await user.reload(); 
    if (user.emailVerified) {
      // const [firstName, lastName] = user.displayName
      //   ? user.displayName.split(" ")
      //   : ["", ""];

      // const payload = {
      //   firstName,
      //   lastName,
      //   email: user.email || "",
      //   id: user.uid,
      //   userName: user.email?.split("@")[0] || "",
      // };

      // await post(Api.CreateUser(), payload);
      navigate("/login");
    } else {
      alert("Email not verified yet. Please check your inbox.");
    }

    setLoading(false);
  };

  const resendEmail = async () => {
    if (!user) return;

    try {
      await sendEmailVerification(user);
      alert("Verification email resent.");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
      <p className="text-gray-600 mb-6 text-center">
        A verification email has been sent to <b>{user?.email}</b>. Please click the link in your inbox.
      </p>

      <button
        onClick={checkVerification}
        className="bg-[#004236] text-white px-4 py-2 rounded-md hover:bg-[#004236]"
        disabled={loading}
      >
        {loading ? "Checking..." : "I have verified my email"}
      </button>

      <button
        onClick={resendEmail}
        className="mt-4 text-sm text-[#004236] underline hover:text-[#8EA690]"
      >
        Resend Verification Email
      </button>
    </div>
  );
}

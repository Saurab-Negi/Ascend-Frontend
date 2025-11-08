import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/Firebase";
import Button from "../../components/Button/Button"
import { useNavigate } from "react-router-dom";


function ForgetPassword() {
     const [user, setUser] = useState({email: "", });
     const [error, setError] = useState("");
         const UserOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        })
    };
    const navigate = useNavigate();

    const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent. Please check your inbox.");
    navigate("/login");
  } catch (err) {
    setError((err as Error).message);
  }
};
  return (
     <section className="flex items-center justify-center min-h-screen ">
            <div className="w-80 mx-auto border border-gray-200 mt-10 p-6 bg-white rounded-xl shadow-xl space-y-4 text-sm font-medium text-gray-700">
               <h2 className="text-2xl text-center font-semibold text-gray-600">Reset Password</h2>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) => UserOnChange(e)}
                        placeholder="Enter your mail"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004236]"
                    />
                </div>
                <p className="text-lg text-red-500">{error}</p>

                {/* Sign In Button */}
                <Button className="w-full bg-[#004236] hover:bg-[#004236] text-white p-2 rounded-md transition"
                 onClick={() => {resetPassword(user.email)}}  name="Reset Password"/>
                   
            </div>
        </section>
  )
}

export default ForgetPassword
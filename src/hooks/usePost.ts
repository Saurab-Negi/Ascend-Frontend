import { useState } from "react";
import axios from "axios";
import { auth } from "../lib/Firebase";

function usePost<T = any, B = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (url: string, body: B) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const token = await user.getIdToken();
    try {
      const response = await axios.post<T>(url, body, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      setData(response.data);
      return { data: response.data, error: null };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Post request failed";
      setError(errMsg);
      return { data: null, error: errMsg }; // return error directly
    } finally {
      setLoading(false);
    }
  };

  return { post, data, loading, error };
}

export default usePost;

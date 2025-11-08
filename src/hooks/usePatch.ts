import { useState } from "react";
import axios from "axios";
import { auth } from "../lib/Firebase";

function usePatch<T = any, B = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const patch = async (url: string, body: B) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const token = await user.getIdToken();
    try {
      const response = await axios.patch<T>(url, body, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Patch request failed"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { patch, data, loading, error };
}

export default usePatch;
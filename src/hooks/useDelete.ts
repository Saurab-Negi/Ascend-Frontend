import { useState } from "react";
import axios from "axios";
import { auth } from "../lib/Firebase";

function useDelete<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRequest = async (url: string) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const token = await user.getIdToken();
    try {
      const response = await axios.delete<T>(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Delete request failed"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRequest, data, loading, error };
}

export default useDelete;
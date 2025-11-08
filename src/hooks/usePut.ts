import { useState } from "react";
import axios from "axios";
import { auth } from "../lib/Firebase";

function usePut<T = any, B = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const put = async (url: string, body: B, contentType?: string, skip: boolean=false) => {
    setLoading(true);
    setError(null);
    let head;
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const token = await user.getIdToken();
    skip ? head = { "Content-Type" :contentType,
      "Content-Disposition": "inline",
    }
     : 
     head = {
          "Content-Type": contentType || "application/octet-stream",
          "Content-Disposition": "inline",
          ...(token && { Authorization: `Bearer ${token}` }),
        }

      
    try {
      const response = await axios.put<T>(url, body, {
        headers: head,
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message || err.message || "Put request failed"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { put, data, loading, error };
}

export default usePut;

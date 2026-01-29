import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function useResetAuthToken() {
  const { setToken } = useAuth();
  useEffect(() => {
    setToken(null);
    document.cookie =
      "waiting-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=queue.web10.site";
    return () => {};
  }, [setToken]);
}

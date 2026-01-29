import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function useExitPage() {
  const { setToken } = useAuth();
  useEffect(() => {
    return () => {
      setToken(null);
      document.cookie =
        "waiting-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=queue.web10.site";
    };
  }, [setToken]);
}

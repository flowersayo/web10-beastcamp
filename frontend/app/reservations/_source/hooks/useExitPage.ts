import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useExitPage() {
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setToken(null);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [setToken, router.events]);
}

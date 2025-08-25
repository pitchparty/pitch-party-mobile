import { useRouter, SplashScreen } from "expo-router";
import { ReactNode, useEffect, useState } from "react";

import { useAuthStore } from "./store";

SplashScreen.preventAutoHideAsync();

export default function AuthMiddleware({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const {user, loading} = useAuthStore();
  const role = user?.role || "guest";
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    new Promise((resolve) => {
      setIsReady(true);
      resolve(true);
    })
  }, [])
  

  useEffect(() => {
    if (!isReady || loading) return;
    const initializeAuth = async () => {
      if (user) {
        if (role === "admin")  router.replace("/(admin)/admin-home");
        else if (role === "manager")  router.replace("/(manager)/manager-dashboard");
        else if (role === "user")  router.replace("/(user)/user-home");
      } else {
        router.replace("/(auth)/onboarding");
      }
      
      setIsReady(true);
      await SplashScreen.hideAsync();
    };

    // Run initialization
    initializeAuth();
  }, [ user, role, router, isReady, loading]); // Dependencies ensure re-run on relevant changes

  // Render nothing until ready
  if (!isReady || loading) return null;

  return children;
}
"use client";
import { useAuthState } from "@/src/features/auth/state/auth-state";
import { useLayoutEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken, initializeAuth } = useAuthState();
  // useLayoutEffect(() => {
  //   async function init() {
  //     await initializeAuth();
  //   }
  //   init();
  // }, [initializeAuth]);
  // if (!user || !accessToken) {
  //   return null;
  // }
  return children;
}

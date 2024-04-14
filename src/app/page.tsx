"use client";

import { useRouter } from "next/navigation";
import LoginPage from "./(auth)/login/page";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("TOKEN")) {
      router.push("/home");
    }
  }, []);

  return <LoginPage />;
}

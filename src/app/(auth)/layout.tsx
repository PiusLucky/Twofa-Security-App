"use client";

import React, { useEffect } from "react";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("TOKEN")) {
      router.push("/home");
    }
  }, []);

  return (
    <div>
      <LoadingIndicator />
      <Toaster />
      {children}
    </div>
  );
}

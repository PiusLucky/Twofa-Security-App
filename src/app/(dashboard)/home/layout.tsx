"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("TOKEN")) {
      router.push("/login");
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

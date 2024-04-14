"use client";

import DashboardContentSection from "@/components/sections/DashboardContentSection";
import { useRouter } from "next/navigation";
import React from "react";

function Dashboard() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };
  return (
    <div className="mx-4 md:mx-16 mt-4 pb-16 ">
      <div className="flex justify-end">
        <div
          className="inline-flex justify-end mt-[1.49rem] text-red-400 hover:cursor-pointer"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              stroke="#FF8A65"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="1.5"
              d="M17.44 14.62L20 12.06 17.44 9.5M9.76 12.06h10.17M11.76 20c-4.42 0-8-3-8-8s3.58-8 8-8"
            ></path>
          </svg>
        </div>
      </div>

      <DashboardContentSection />
    </div>
  );
}

export default Dashboard;

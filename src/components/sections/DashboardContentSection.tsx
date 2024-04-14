"use client";

import React, { useEffect, useState } from "react";
import {
  IRecoveryCode,
  IRecoveryCodeResponse,
  IUserProfileResponse,
  IUserProfileResponseData,
} from "@/types";
import { Skeleton } from "../ui/skeleton";
import makeApiCallService from "@/service/apiService";
import { RecoveryCodeModal } from "../modals/RecoveryCodeModal";
import { TwofaRemovalModal } from "../modals/TwoFaRemovalModal";
import { TwofaSetupModal } from "../modals/TwoFaSetupModal";

function DashboardContentSection() {
  const [loadingDashboardContent, setLoadingDashboardContent] = useState(true);
  const [recoveryCodes, setRecoverycodes] = useState<IRecoveryCode[]>([]);
  const [user, setUser] = useState<IUserProfileResponseData>();
  const [twofa, setTwofa] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const userMetric = [
    {
      iconPath: "/images/user_alt_icon.png",
      title: "All Recovery codes",
      count: recoveryCodes?.length,
    },
    {
      iconPath: "/images/stylish_check_icon.png",
      title: "Valid Codes",
      count: recoveryCodes?.filter((code) => code.active === false)?.length,
    },
    {
      iconPath: "/images/stylish_check_icon.png",
      title: "Used Codes",
      count: recoveryCodes?.filter((code) => code.active === true)?.length,
    },
  ];

  const handleRefresh = () => {
    setRefreshKey(Math.random());
  };

  useEffect(() => {
    async function fetch() {
      try {
        const userProfile = await makeApiCallService<IUserProfileResponse>(
          "/api/profile",
          {
            method: "GET",
          }
        );
        setUser(userProfile?.response.data);

        const userTwofa: any = await makeApiCallService("/api/twofa", {
          method: "GET",
        });
        setTwofa(userTwofa?.response?.data);
        const userRecoveryCodes = await makeApiCallService<
          IRecoveryCodeResponse
        >("/api/recovery-codes", {
          method: "GET",
        });

        setRecoverycodes(userRecoveryCodes?.response?.data as IRecoveryCode[]);
        setLoadingDashboardContent(false);
      } catch (err) {
        setLoadingDashboardContent(false);
      }
    }

    fetch();
  }, [refreshKey]);

  return (
    <section>
      <div>
        <div className="text-2xl mt-8 md:text-[3rem] flex gap-4 items-center">
          <span className="text-[#6D7580]">Hi </span>
          {loadingDashboardContent ? (
            <Skeleton className="w-[10rem] h-[2rem]" />
          ) : (
            <span className="text-[#2B3A4B]">{user?.full_name},</span>
          )}
        </div>
        <div className="text-[#858C94] mt-4 md:text-[1.5rem] flex gap-4">
          It&apos;s nice to see you back.
        </div>
      </div>
      <div
        className="flex flex-col md:flex-row justify-between gap-16 mt-[3.69rem] mb-[4.44rem]"
        key={refreshKey}
      >
        {userMetric.map((metric, index) => (
          <div
            className="dashboard-card-shadow flex gap-[1.64rem] p-[1.25rem] flex-grow"
            key={index}
          >
            <div>
              <img src={metric.iconPath} alt="metric icon" />
            </div>

            <div className="flex flex-col gap-[0.46rem]">
              <div className="text-[#A3AED0] text-[1rem]">
                {loadingDashboardContent ? (
                  <Skeleton className="w-[5rem] h-[2rem]" />
                ) : (
                  <span>{metric.title}</span>
                )}
              </div>
              <div className="text-[#1B2559] text-[2.25rem]">
                {loadingDashboardContent ? (
                  <Skeleton className="w-[5rem] h-[2rem]" />
                ) : (
                  <span>{metric.count}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-[18px]">
        <div>
          {twofa?.status ? (
            <TwofaRemovalModal rerenderPrivacyComp={handleRefresh} />
          ) : (
            <TwofaSetupModal rerenderPrivacyComp={handleRefresh} />
          )}
        </div>

        <RecoveryCodeModal rerenderParent={handleRefresh} />
      </div>
    </section>
  );
}

export default DashboardContentSection;

import React from "react";
import SuccessBadge from "@/components/common/SuccessBadge";
import WarningBadge from "@/components/common/WarningBadge";

function RecoveryCode({
  recoveryCodes,
  ignoreBadge = false,
}: {
  recoveryCodes: any;
  ignoreBadge?: boolean;
}) {
  return (
    <section className="flex justify-around w-full flex-col  md:flex-row mt-8 border border-[#1f232826] rounded-lg shadow-sm p-4">
      <div>
        <div>
          {recoveryCodes?.slice(0, 8)?.map((code: any) => (
            <div className="font-bold text-[#1f2328] mb-2 flex" key={code.id}>
              {!ignoreBadge && (
                <div>
                  {!code.active ? (
                    <SuccessBadge text="Active" />
                  ) : (
                    <WarningBadge text="Used" />
                  )}
                </div>
              )}
              <span className="ml-2">{code.code}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>
          {recoveryCodes?.slice(-8)?.map((code: any) => (
            <div className="font-bold text-[#1f2328] mb-2 flex" key={code.id}>
              {!ignoreBadge && (
                <div>
                  {!code.active ? (
                    <SuccessBadge text="Active" />
                  ) : (
                    <WarningBadge text="Used" />
                  )}
                </div>
              )}
              <span className="ml-2">{code.code}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecoveryCode;

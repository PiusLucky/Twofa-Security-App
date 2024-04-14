import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MainButton from "@/components/common/MainButton";
import { useCallback, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ellipsify } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import makeApiCallService from "@/service/apiService";
import QRCode from "react-qr-code";

export function TwofaSetupModal({
  rerenderPrivacyComp,
}: {
  rerenderPrivacyComp: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [copy, setCopy] = useState(false);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [activateLoading, setActivateLoading] = useState(false);
  const [twofa, setTwofa] = useState<any>(null);

  const toggleOpenModal = () => {
    setOpen(!open);
  };

  const triggerCopy = () => {
    setCopy(true);
  };

  const handleAdd2fa = async () => {
    await generate2faSecret();
    toggleOpenModal();
  };

  const generate2faSecret = async () => {
    const two2fa: any = await makeApiCallService("/api/twofa", {
      method: "POST",
    });
    setTwofa(two2fa?.response?.data);
  };

  const handleInitialCall = useCallback(async () => {
    const two2faStatus: any = await makeApiCallService("/api/twofa", {
      method: "GET",
    });

    if (two2faStatus?.response?.data?.status) {
      return;
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const verify2faToken = async () => {
    setActivateLoading(true);
    try {
      await makeApiCallService("/api/twofa", {
        method: "PUT",
        body: {
          token: otp,
        },
      });

      setActivateLoading(false);
      rerenderPrivacyComp();
    } catch (err) {
      setActivateLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [otp]);

  useEffect(() => {
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  }, [copy]);

  useEffect(() => {
    async function fetchData() {
      await handleInitialCall();
    }

    fetchData();
  }, [handleInitialCall]);

  return (
    <Dialog open={open} onOpenChange={() => toggleOpenModal()}>
      <DialogTrigger asChild>
        <p
          className="text-[#54BD95] font-bold cursor-pointer"
          onClick={handleAdd2fa}
        >
          Setup 2FA
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60rem] max-h-[500px] md:max-h-full overflow-y-auto pt-8">
        <div className="flex flex-col items-center mt-4">
          <section>
            <div className="font-bold flex justify-center">
              Two factor Authentication Setup
            </div>
            <div className="text-[#758494] text-center mt-[1rem]">
              Scan the barcode using your two-factor authentication app on your
              mobile device and input the verification code.{" "}
            </div>
            <div className="text-[#758494] text-center mt-[1rem]">
              If you are unable to use a barcode, please copy the Setup Key
              instead.
            </div>
          </section>
          <section className="flex justify-between w-full mt-[2rem] flex-col md:flex-row gap-8">
            <div>
              <div>
                <CopyToClipboard text={twofa?.secretKey || ""}>
                  <p className="font-bold text-[14px] mb-[0.62rem]">
                    Copy the SetUp Key
                  </p>
                </CopyToClipboard>

                <div className="border border-[#DDDDDD] p-4 relative rounded-[0.5rem] md:w-[25rem] hidden md:block">
                  <div className="text-[0.875rem] ">
                    {twofa?.secretKey ? ellipsify(twofa?.secretKey, 30) : ""}
                  </div>

                  <div className="absolute top-3 right-3">
                    <CopyToClipboard text={twofa?.secretKey || ""}>
                      <div>
                        <MainButton
                          text={!copy ? "Copy" : "Copied!"}
                          classes="w-[3.4375rem] !h-[1.75rem] text-[0.625rem] rounded-[0.5rem] bg-white border border-primary text-primary hover:bg-white shadow-none"
                          action={() => triggerCopy()}
                        />
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
                <div className="block md:hidden">
                  <CopyToClipboard text={twofa?.secretKey || ""}>
                    <div>
                      <MainButton
                        text={!copy ? "Copy Secret key" : "Copied!"}
                        classes="w-[7rem] !h-[1.75rem] text-[0.625rem] rounded-[0.5rem] bg-white border border-primary text-primary hover:bg-white shadow-none"
                        action={() => triggerCopy()}
                      />
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="mt-4 mb-8">
                <p className="font-bold text-[14px] mb-[0.62rem]">
                  Enter the six digit verification code
                </p>
                <div>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<div className="pl-[0.69rem]"></div>}
                    renderInput={(props: any) => (
                      <input
                        {...props}
                        className="border-[1.75px] border-[#E4E7EC] focus:!outline-primary  !w-[3rem] !h-[3rem] md:!w-[4rem] md:!h-[4rem] text-black rounded-sm md:rounded-[1rem] font-bold md:text-[1.5rem]"
                      />
                    )}
                    shouldAutoFocus
                  />
                </div>
              </div>
              <div>
                <MainButton
                  text="Activate"
                  action={verify2faToken}
                  isLoading={activateLoading}
                  dataLoadingText="Setting 2FA..."
                  disabled={disableButton}
                />
              </div>
            </div>
            <div className="flex items-center flex-col select-none">
              <div>
                {loading ? (
                  <Skeleton className="w-[180px] h-[180px] mb-2" />
                ) : (
                  <QRCode
                    value={
                      `otpauth://totp/TwofaSecurityApp?secret=${twofa?.secretKey}` ||
                      "Loading"
                    }
                    className="w-[200px] h-[200px]"
                  />
                )}
              </div>
              <p className="font-bold">Scan QR code</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

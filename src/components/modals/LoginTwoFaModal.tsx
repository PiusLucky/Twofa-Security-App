import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MainButton from "@/components/common/MainButton";
import makeApiCallService from "@/service/apiService";
import OTPInput from "react-otp-input";
import { ILoginUserResponse } from "@/types";
import { useRouter } from "next/navigation";

interface IProps {
  email: string;
  password: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function LoginTwoFaModal({ email, password, open, setOpen }: IProps) {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [activateLoading, setActivateLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const toggleOpenModal = () => {
    setOpen(!open);
  };

  const verify2faToken = async () => {
    setActivateLoading(true);
    try {
      const verified = await makeApiCallService("/api/twofa-by-email", {
        method: "PUT",
        body: {
          token: otp,
          email: email,
        },
      });

      if (verified) {
        const response = await makeApiCallService<ILoginUserResponse>(
          "/api/login",
          {
            method: "POST",
            body: {
              email,
              password,
            },
          }
        );

        if (response?.response?.meta?.success) {
          localStorage.setItem("TOKEN", response?.response?.data?.token);
          router.push("/home");
        }
      }

      setActivateLoading(false);
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

  return (
    <Dialog open={open} onOpenChange={() => toggleOpenModal()}>
      <DialogContent className="sm:max-w-[60rem] max-h-[500px] md:max-h-full overflow-y-auto pt-8">
        <div className="flex flex-col items-center mt-4">
          <section>
            <div className="font-bold flex justify-center text-center">
              Two factor Authentication
            </div>
            <div className="text-[#758494] text-left mt-[1rem]">
              <p className="">
                Two-factor authentication enhances the security of your
                account by necessitating more than just a password for access.
              </p>

              <div className="mt-2">
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
                    dataLoadingText="Verifying 2FA..."
                    disabled={disableButton}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

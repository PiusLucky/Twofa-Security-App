import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MainButton from "@/components/common/MainButton";
import makeApiCallService from "@/service/apiService";

export function TwofaRemovalModal({
  rerenderPrivacyComp,
}: {
  rerenderPrivacyComp: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);

  const toggleOpenModal = () => {
    setOpen(!open);
  };

  const remove2fa = async () => {
    setActivateLoading(true);
    try {
      await makeApiCallService("/api/twofa", {
        method: "DELETE",
      });

      setActivateLoading(false);
      toggleOpenModal();
      rerenderPrivacyComp();
    } catch (err) {
      setActivateLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => toggleOpenModal()}>
      <DialogTrigger asChild>
        <p
          className="text-[#F47373] font-bold cursor-pointer"
          onClick={toggleOpenModal}
        >
          Remove 2FA
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60rem] max-h-[500px] md:max-h-full overflow-y-auto pt-8">
        <div className="flex flex-col items-center mt-4">
          <section>
            <div className="font-bold flex justify-center text-center">
              Two factor Authentication Removal
            </div>
            <div className="text-[#758494] text-left mt-[1rem]">
              <p className="">
                Two-factor authentication enhances the security of your account
                by necessitating more than just a password for access.
              </p>

              <p className="mt-2">
                Twofa Security App :) strongly advises maintaining two-factor
                authentication enabled for your account. If you need to modify
                your settings or generate new recovery codes, you can accomplish
                this within the dashboard section
              </p>
            </div>
          </section>
          <section className="flex justify-center items-center w-full mt-[2rem] flex-col gap-8">
            <div>
              <MainButton
                text="Remove"
                action={remove2fa}
                isLoading={activateLoading}
                dataLoadingText="Removing 2FA..."
              />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MainButton from "@/components/common/MainButton";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Copy, Download, Printer } from "lucide-react";
import { Separator } from "../ui/separator";
import PrintRecoveryCode from "@/components/common/PrintComponent";
import CopyToClipboard from "react-copy-to-clipboard";
import RecoveryCode from "../common/RecoveryCode";
import makeApiCallService from "@/service/apiService";

export function RecoveryCodeModal({
  rerenderParent,
}: {
  rerenderParent: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [open, setOpen] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<any>(null);

  const toggleOpenModal = () => {
    setOpen(!open);
  };

  const triggerCopy = () => {
    setCopy(true);
  };

  const generateNewRecoveryCodes = async () => {
    setLoading(true);
    await makeApiCallService("/api/recovery-codes", {
      method: "POST",
    });
    await handleInitialCall();
    rerenderParent();
  };

  const handleInitialCall = useCallback(async () => {
    const recoveryCodes: any = await makeApiCallService("/api/recovery-codes", {
      method: "GET",
    });
    setLoading(false);
    setRecoveryCodes(recoveryCodes?.response?.data);
  }, []);

  const handleDownload = () => {
    setDownloadLoading(true);
    const formattedCodes = recoveryCodes?.map((code: any) => code.code);
    downloadArrayAsTxtFile(formattedCodes as string[]);
    setDownloadLoading(false);
  };

  const downloadArrayAsTxtFile = (dataArray: string[]) => {
    const element = document.createElement("a");
    const file = new Blob([dataArray.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "2fa-security-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
        <MainButton
          text="Recovery Codes"
          classes="rounded-full w-[204px]"
          action={toggleOpenModal}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60rem] max-h-[500px] md:max-h-full overflow-y-auto pt-8">
        <div className="flex flex-col items-center mt-4">
          <section>
            <div className="font-bold flex justify-center">Recovery Codes</div>
            <div className="text-[#758494] text-center mt-[1rem]">
              <Alert className="text-orange-500">
                <AlertCircle className="h-4 w-4 " color="rgb(249 115 22)" />
                <AlertDescription>
                  It&apos;s essential to safeguard your recovery codes. These
                  codes serve as your final option for account access in the
                  event of password loss and second-factor issues. If these
                  codes are misplaced, it will result in permanent account
                  access loss.
                </AlertDescription>
              </Alert>
            </div>
          </section>
          <RecoveryCode recoveryCodes={recoveryCodes} />
          {recoveryCodes?.length ? (
            <section className="flex justify-aroundmt-8 flex-col gap-4 md:gap-8  md:flex-row mt-4">
              <div>
                <MainButton
                  text="Download"
                  iconComponent={<Download className="w-4 h-4" />}
                  classes="bg-[#f6f8fa] text-[#24292f] hover:text-white w-[115px] !h-[32px] rounded-[6px] border border-[#1f232826] hover:border-none shadow-none"
                  action={handleDownload}
                  isLoading={downloadLoading}
                  dataLoadingText="Wait..."
                />
              </div>
              <div>
                <PrintRecoveryCode
                  contentToPrint={
                    <RecoveryCode recoveryCodes={recoveryCodes} ignoreBadge />
                  }
                  triggerButtonComponent={
                    <MainButton
                      text="Print"
                      iconComponent={<Printer className="w-4 h-4" />}
                      classes="bg-[#f6f8fa] text-[#24292f] hover:text-white w-[115px] !h-[32px] rounded-[6px] border border-[#1f232826] hover:border-none shadow-none"
                    />
                  }
                />
              </div>
              <div>
                <CopyToClipboard
                  text={
                    recoveryCodes?.map((code: any) => code.code).join("\n") ||
                    ""
                  }
                >
                  <div>
                    <MainButton
                      text={!copy ? "Copy" : "Copied!"}
                      iconComponent={<Copy className="w-4 h-4" />}
                      classes="bg-[#f6f8fa] text-[#24292f] hover:text-white w-[115px] !h-[32px] rounded-[6px] border border-[#1f232826] hover:border-none shadow-none"
                      action={() => triggerCopy()}
                    />
                  </div>
                </CopyToClipboard>
              </div>
            </section>
          ) : (
            ""
          )}

          {!recoveryCodes?.length ? (
            <div className="mt-4"></div>
          ) : (
            <Separator className="mt-8 mb-8" />
          )}

          <section>
            <div className="font-bold">Generate new recovery codes</div>
            <div className="text-[#656d76] text-[.9rem]">
              When generating fresh recovery codes, it&apos;s crucial to
              promptly download or print them. Your previous codes will become
              invalid and no longer functional.
            </div>
            <div className="mt-8 mb-8">
              <MainButton
                text="Generate new codes"
                dataLoadingText="Generating codes..."
                classes="!h-[3rem]"
                action={generateNewRecoveryCodes}
                isLoading={loading}
              />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

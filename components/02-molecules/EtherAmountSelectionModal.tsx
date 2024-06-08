/* eslint-disable react-hooks/exhaustive-deps */
import { SwapModalLayout } from "@/components/01-atoms";
import { SwapContext } from "@/lib/client/contexts";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useWalletBalance } from "@/lib/client/hooks/useWalletBalance";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import { useNetwork } from "wagmi";

interface EtherAmountSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

export const EtherAmountSelectionModal = ({
  open,
  onClose,
}: EtherAmountSelectionModalProps) => {
  const [etherAmount, setEtherAmount] = useState<bigint>(0n);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { setEtherValue, setEtherRecipient } = useContext(SwapContext);
  const { chain } = useNetwork();

  const { balance } = useWalletBalance({
    walletAddress: authenticatedUserAddress,
  });
  const match = balance?.match(/^(\d+\.\d{1,3})|\d+/);
  const displayBalance = match ? match[0] : balance;

  const handleEtherAddition = () => {
    if (authenticatedUserAddress) {
      if (!chain) {
        toast.error("No chain found");
        return;
      }
      if (
        displayBalance !== null &&
        etherAmount <= parseEther(displayBalance)
      ) {
        setEtherRecipient(1n); // If the recipient is* between 1<>255 then the recipient will be the owner of the Swap.
        setEtherValue(etherAmount);
      }
    }
  };

  return (
    <SwapModalLayout
      toggleCloseButton={{
        open: open,
        onClose: onClose,
      }}
      text={{ title: "Add Ether Amount" }}
      body={
        <>
          <div className="flex w-full">
            <div className="relative w-full">
              <input
                type="number"
                name="amount"
                placeholder="0.00"
                onChange={(e) => {
                  try {
                    const etherValueAmount = e.target.value;
                    setEtherAmount(parseEther(etherValueAmount));
                  } catch {
                    toast.error("Invalid Ether amount provided");
                    setEtherValue(0n);
                  }
                }}
                className="w-full rounded-lg rounded-r-none p-3 text-left bg-[#e0e0e0] dark:bg-[#282B29] border-[#353836] border-r-0 focus:outline-none"
              />
            </div>
            <label className="w-fit rounded-lg rounded-l-none  bg-[#CCCCCC] dark:bg-[#353836] border-[#353836] text-sm text-[#707572] dark:text-[#A3A9A5] p-3 pt-3.5">
              {displayBalance || "0"}
              {chain?.nativeCurrency.symbol}
            </label>
          </div>
          <button
            onClick={handleEtherAddition}
            className="w-full bg-[#DDF23D] p-2 text-center text-black rounded-lg"
          >
            Add to offer
          </button>
        </>
      }
    />
  );
};

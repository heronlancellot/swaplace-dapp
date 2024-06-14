/* eslint-disable react-hooks/exhaustive-deps */
import { ForWhom } from "../03-organisms";
import { SwapModalLayout } from "@/components/01-atoms";
import { SwapContext } from "@/lib/client/contexts";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useWalletBalance } from "@/lib/client/hooks/useWalletBalance";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { useNetwork } from "wagmi";
import cc from "classcat";

interface EtherAmountSelectionModalProps {
  open: boolean;
  onClose: () => void;
  variant: ForWhom;
}

export const EtherAmountSelectionModal = ({
  open,
  onClose,
  variant,
}: EtherAmountSelectionModalProps) => {
  const [etherAmount, setEtherAmount] = useState<bigint>(0n); // The amount of Ether to be setted on setAuthenticatedUserEtherValue.
  const [isMaxEtherSelected, setIsMaxEtherSelected] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("0.00"); // User input value
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { setEtherValue, setEtherRecipient, validatedAddressToSwap } =
    useContext(SwapContext);
  const { chain } = useNetwork();

  const userAddress =
    variant === ForWhom.Yours
      ? authenticatedUserAddress
      : validatedAddressToSwap;

  const { balance } = useWalletBalance({
    walletAddress: userAddress,
  });
  const match = balance?.match(/^(\d+\.\d{1,3})|\d+/);
  const userAddressBalance = match ? match[0] : balance;

  const handleEtherAddition = () => {
    if (authenticatedUserAddress) {
      if (!chain) {
        toast.error("No chain found");
        return;
      }
      if (userAddressBalance !== null) {
        if (isMaxEtherSelected) {
          setEtherRecipient(1); // If the recipient is* between 1<>255 then the recipient will be the owner of the Swap.
          setEtherValue(parseEther(userAddressBalance));
          toast.success(
            `${userAddressBalance} ${chain?.nativeCurrency.symbol} has been added`,
          );
          onClose();
        } else if (
          !isMaxEtherSelected &&
          parseEther(inputValue) <= parseEther(userAddressBalance)
        ) {
          setEtherRecipient(1); // If the recipient is* between 1<>255 then the recipient will be the owner of the Swap.
          setEtherValue(etherAmount);
          toast.success(
            `${formatEther(etherAmount)} ${
              chain?.nativeCurrency.symbol
            } has been added`,
          );
          onClose();
        } else {
          toast.error("The amount is higher than the balance");
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (isMaxEtherSelected) {
        setEtherAmount(parseEther(userAddressBalance as string));
      }
      const etherValueAmount = e.target.value;
      setInputValue(etherValueAmount);
      setEtherAmount(parseEther(etherValueAmount));
    } catch {
      toast.error("Invalid Ether amount provided");
      setEtherValue(0n);
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
          <div className="w-full flex justify-between text-sm text-[#707572] dark:text-[#A3A9A5]">
            <p>Balance:</p>
            <p>{userAddressBalance}</p>
          </div>
          <div className="flex w-full">
            <div className="relative w-full">
              <input
                readOnly={isMaxEtherSelected}
                type="number"
                name="amount"
                placeholder={
                  isMaxEtherSelected ? (userAddressBalance as string) : "0.00"
                }
                value={
                  isMaxEtherSelected
                    ? (userAddressBalance as string)
                    : inputValue
                }
                onChange={handleInputChange}
                className={cc([
                  isMaxEtherSelected && "cursor-not-allowed",
                  "w-full rounded-lg rounded-r-none p-3 text-left bg-[#e0e0e0] dark:bg-[#282B29] border-[#353836] border-r-0 focus:outline-none",
                ])}
              />
            </div>
            <button
              className={cc([
                "w-fit rounded-lg rounded-l-none  bg-[#CCCCCC] dark:bg-[#353836] border-[#353836] text-sm text-[#707572] dark:text-[#A3A9A5] p-3 pt-3.5",
                isMaxEtherSelected && "dark:bg-[#DDF23D] dark:text-black",
              ])}
              onClick={() => setIsMaxEtherSelected(!isMaxEtherSelected)}
            >
              Max
            </button>
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

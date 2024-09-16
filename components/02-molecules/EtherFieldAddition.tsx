import { EtherAmountSelectionModal } from "@/components/02-molecules";
import { EditionIcon, PlusIconSmall } from "@/components/01-atoms/";
import { SwapContext } from "@/lib/client/contexts";
import { ForWhom } from "@/components/03-organisms";
import { isInRange } from "@/lib/client/utils";
import { useState, useContext, useEffect } from "react";
import { formatEther } from "viem";
import { useNetwork } from "wagmi";

export const EtherFieldAddition = ({ variant }: { variant: ForWhom }) => {
  const [open, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { etherValue, etherRecipient } = useContext(SwapContext);
  const { chain } = useNetwork();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
        {variant === ForWhom.Yours &&
        (etherRecipient === 0 || etherRecipient === 256) ? (
          <>
            <p className="flex items-center p-small-variant-black-3 dark:p-small-variant-light-2 contrast-50">
              {formatEther(etherValue)}
            </p>
            {/* Only render the chain symbol after the component has mounted */}
            <p className="flex items-center p-small-variant-black-3 dark:p-small-variant-light-2 contrast-50">
              {isMounted && chain ? chain.nativeCurrency.symbol : ""}
            </p>
          </>
        ) : variant === ForWhom.Their && isInRange(etherRecipient, 1, 256) ? (
          <>
            <p className="flex items-center p-small-variant-black-3 dark:p-small-variant-light-2 contrast-50">
              {formatEther(etherValue)}
            </p>
            {/* Only render the chain symbol after the component has mounted */}
            <p className="flex items-center p-small-variant-black-3 dark:p-small-variant-light-2 contrast-50">
              {isMounted && chain ? chain.nativeCurrency.symbol : ""}
            </p>
          </>
        ) : null}
      </div>
      {etherValue === 0n || isInRange(etherRecipient, 0, 256) ? (
        <>
          <button
            className="w-6 h-6 rounded-full dark:bg-[#FFFFFF1A] bg-lightSilver flex justify-center items-center"
            onClick={() => {
              setIsOpen(!open);
            }}
          >
            <PlusIconSmall className="text-sageGray dark:textlightSilver" />
          </button>
          <EtherAmountSelectionModal
            open={open}
            onClose={() => {
              setIsOpen(false);
            }}
            variant={variant}
          />
        </>
      ) : variant === ForWhom.Yours &&
        (etherRecipient === 0 || etherRecipient === 256) ? (
        <>
          <button
            className="w-6 h-6 rounded-full bg-[#FFFFFF1A] flex justify-center items-center"
            onClick={() => {
              setIsOpen(!open);
            }}
          >
            <EditionIcon />
          </button>
          <EtherAmountSelectionModal
            open={open}
            onClose={() => {
              setIsOpen(false);
            }}
            variant={variant}
          />
        </>
      ) : variant === ForWhom.Their && isInRange(etherRecipient, 1, 256) ? (
        <>
          <button
            className="w-6 h-6 rounded-full bg-[#FFFFFF1A] flex justify-center items-center"
            onClick={() => {
              setIsOpen(!open);
            }}
          >
            <EditionIcon />
          </button>
          <EtherAmountSelectionModal
            open={open}
            onClose={() => {
              setIsOpen(false);
            }}
            variant={variant}
          />
        </>
      ) : null}
    </div>
  );
};

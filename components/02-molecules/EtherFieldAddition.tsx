import { EtherAmountSelectionModal } from "@/components/02-molecules";
import { EditionIcon, PlusIconSmall } from "@/components/01-atoms/";
import { SwapContext } from "@/lib/client/contexts";
import { ForWhom } from "@/components/03-organisms";
import { useState, useContext } from "react";
import { formatEther } from "viem";
import { useNetwork } from "wagmi";

export const EtherFieldAddition = ({ variant }: { variant: ForWhom }) => {
  const [open, setIsOpen] = useState(false);
  const { etherValue } = useContext(SwapContext);
  const { chain } = useNetwork();

  console.log("variant", variant);

  return (
    <div className="flex gap-2">
      <p className=" flex items-center p-small-variant-black-3 dark:p-small-variant-light-2">
        {formatEther(etherValue)} {chain?.nativeCurrency.symbol}
      </p>

      {etherValue === 0n ? (
        <>
          <button
            className="w-6 h-6 rounded-full bg-[#FFFFFF1A] flex justify-center items-center"
            onClick={() => {
              setIsOpen(!open);
            }}
          >
            <PlusIconSmall />
          </button>
          <EtherAmountSelectionModal
            open={open}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </>
      ) : (
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
          />
        </>
      )}
    </div>
  );
};

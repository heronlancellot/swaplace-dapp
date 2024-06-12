import { EtherAmountSelectionModal } from "@/components/02-molecules";
import { EditionIcon, PlusIconSmall } from "@/components/01-atoms/";
import { SwapContext } from "@/lib/client/contexts";
import { ForWhom } from "@/components/03-organisms";
import { useState, useContext, useEffect } from "react";
import { formatEther } from "viem";
import { useNetwork } from "wagmi";

export const EtherFieldAddition = ({ variant }: { variant: ForWhom }) => {
  const [open, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { authenticatedUserEtherValue, searchedUserEtherValue } =
    useContext(SwapContext);
  const { chain } = useNetwork();

  // Use authenticatedUserEtherValue if variant is 'YOURS', otherwise use searchedUserEtherValue
  const etherValue =
    variant === ForWhom.Yours
      ? authenticatedUserEtherValue
      : searchedUserEtherValue;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex gap-2">
      <p className="flex items-center p-small-variant-black-3 dark:p-small-variant-light-2">
        {formatEther(etherValue)}
      </p>
      {/* Only render the chain symbol after the component has mounted */}
      <p>{isMounted && chain ? chain.nativeCurrency.symbol : ""}</p>

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
            variant={variant}
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
            variant={variant}
          />
        </>
      )}
    </div>
  );
};

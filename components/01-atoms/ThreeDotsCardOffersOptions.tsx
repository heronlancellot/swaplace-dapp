import {
  PonderFilter,
  ShareIcon,
  ThreeDotsIcon,
  XMarkIcon,
} from "@/components/01-atoms";
import { PopulatedSwapOfferCard } from "@/lib/client/offers-utils";
import { SwapUserConfiguration, cancelSwap } from "@/lib/service/cancelSwap";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useState } from "react";
import cc from "classcat";
import { type WalletClient, useNetwork, useWalletClient } from "wagmi";

export const ThreeDotsCardOffersOptions = ({
  swap,
}: {
  swap: PopulatedSwapOfferCard;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { authenticatedUserAddress } = useAuthenticatedUser();

  let chainId: number;
  let userWalletClient: WalletClient;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCancelSwap = (swap: PopulatedSwapOfferCard) => {
    if (typeof chain?.id != "undefined" && walletClient != undefined) {
      chainId = chain?.id;
      userWalletClient = walletClient;
    } else {
      throw new Error("Chain ID is undefined");
    }

    const configurations: SwapUserConfiguration = {
      walletClient: userWalletClient,
      chain: chainId,
    };

    cancelSwap(swap.id, configurations);
  };

  return (
    <div className="flex relative">
      <div
        className="dark:hover:bg-[#353836] hover:bg-[#e0e0e0] w-[24px] h-[24px] flex justify-center items-center p-1 rounded-[100px] "
        onClick={toggleDropdown}
        role="button"
      >
        <ThreeDotsIcon
          className={cc([
            "dark:hover:text-[#F6F6F1] dark:text-[#A3A9A5] ",
            { isOpen: "dark:text-[#F6F6F1] text-[#A3A9A5]" },
          ])}
        />
      </div>
      {isOpen && (
        <div className="origin-top-right z-50 absolute right-0 top-1 mt-6 border border-[#353836] rounded-lg shadow-lg dark:bg-[#282B29] bg-[#ffffff] ring-1 ring-black ring-opacity-5 focus:outline-none shadow-three-dots">
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3 w-full px-4 py-2 text-sm dark:p-small-dark-variant-grey rounded-lg  dark:hover:bg-[#353836] hover:bg-[#e4e4e4] hover:text-gray-900"
              role="menuitem"
            >
              <ShareIcon /> Share
            </button>
            {authenticatedUserAddress?.equals(swap.askerTokens.address) &&
              swap.status !== PonderFilter.CANCELED && (
                <button
                  type="button"
                  className=" flex items-center gap-3 w-full px-4 py-2 text-sm dark:p-small-dark-variant-grey rounded-lg dark:hover:bg-[#353836] hover:bg-[#e4e4e4] hover:text-gray-900"
                  role="menuitem"
                  onClick={() => handleCancelSwap(swap)}
                >
                  <XMarkIcon />
                  Cancel
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

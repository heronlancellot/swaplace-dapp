import {
  PaperPlane,
  SwapExpireTime,
  SwapIcon,
  SwapIconVariant,
  Tooltip,
} from "@/components/01-atoms";
import {
  ConfirmSwapModal,
  OfferSummary,
  SwapModalAction,
} from "@/components/02-molecules";
import { ForWhom } from "@/components/03-organisms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { SwapContext } from "@/lib/client/contexts";
import { getBlockchainTimestamp } from "@/lib/client/blockchain-utils";
import { useContext, useEffect, useState } from "react";
import cc from "classcat";
import { toast } from "react-hot-toast";
import { useNetwork } from "wagmi";

export const SwapStation = () => {
  const [isValidSwap, setIsValidSwap] = useState<boolean>(false);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { chain } = useNetwork();

  let chainId: number;

  if (typeof chain?.id != "undefined" && chain?.id) {
    chainId = chain?.id;
  }

  const {
    authenticatedUserTokensList,
    searchedUserTokensList,
    validatedAddressToSwap,
    inputAddress,
    timeDate,
  } = useContext(SwapContext);

  useEffect(() => {
    setIsValidSwap(
      !!authenticatedUserTokensList.length &&
        !!searchedUserTokensList.length &&
        !!validatedAddressToSwap &&
        timeDate > 0,
    );
  }, [
    authenticatedUserTokensList,
    searchedUserTokensList,
    validatedAddressToSwap,
    timeDate,
  ]);

  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const validateSwapSending = async () => {
    const timestamp = await getBlockchainTimestamp(chainId);

    if (!isValidSwap) {
      if (!authenticatedUserAddress) {
        toast.error("Please connect your wallet to begin");
        return;
      }

      /// Check if the searched address is valid. If doesn't have input. You must search a address.
      //  As well if isn't valid, select a valid address to swap tokens
      if (!validatedAddressToSwap) {
        if (!inputAddress) {
          toast.error("Search for an address to create a Swap offer");
        } else {
          toast.error("You must select a valid address to Swap tokens");
        }
        return;
      }

      if (
        !authenticatedUserTokensList.length &&
        !searchedUserTokensList.length
      ) {
        toast.error("You must select the tokens you want to Swap");
        return;
      }

      if (!authenticatedUserTokensList.length) {
        toast.error(
          "You must select at least one token from your inventory to create a Swap",
        );
        return;
      }

      if (!searchedUserTokensList.length) {
        toast.error(
          "You must select at least one token from the targeted swap address",
        );
        return;
      }

      if (timeDate < timestamp) {
        toast.error("Select a valid date to your swap.");
        return;
      }
    } else {
      setOpenConfirmationModal(true);
    }
  };

  return (
    <div className="w-full p-5 bg-offWhite dark:bg-midnightGreen border rounded-2xl dark:border-darkGray border-softGray dark:shadow-swap-station shadow-swap-station-light ">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between max-h-[36px]">
          <h3 className="dark:title-h3-normal-dark title-h3-normal mb-7 contrast-50">
            Swap Station
          </h3>
          <SwapExpireTime />
        </div>
        <div className="flex flex-col gap-2 relative">
          <OfferSummary variant={ForWhom.Yours} />
          <OfferSummary variant={ForWhom.Their} />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border dark:border-darkGray borderlightSilver dark:bg-midnightGreen bg-offWhite rounded-[100px] w-[36px] h-[36px] items-center flex justify-center">
            <SwapIcon
              variant={SwapIconVariant.VERTICAL}
              props={{
                className: "text-sageGray text-[#969696]",
              }}
            />
          </div>
        </div>
        <Tooltip
          position="top"
          content={!isValidSwap ? "Select items to swap" : null}
        >
          <div
            role="button"
            onClick={validateSwapSending}
            className={cc([
              "w-full",
              {
                "cursor-not-allowed": !isValidSwap,
              },
            ])}
          >
            <button
              disabled={!isValidSwap}
              className={cc([
                "pointer-events-none rounded-xl w-full disabled:bg-[#F0EEEE] dark:disabled:bg-darkGreen dark:hover:bg-[#4b514d] bg-yellowGreen hover:bg-limeYellow disabled:border-gray-200  dark:disabled:border-darkGray  disabled:border py-3 px-5 items-center flex justify-center gap-2 font-semibold text-[16px] leading-[20.4px] disabled:text-sageGray disabled:dark:text-mediumGray text-blackGreen dark:shadow-button-swap-station-offer",
              ])}
            >
              <PaperPlane
                className={cc([
                  "w-6",
                  isValidSwap
                    ? "text-blackGreen"
                    : "dark:text-mediumGray text-sageGray",
                ])}
              />
              Swap
            </button>
          </div>
        </Tooltip>
      </div>

      <ConfirmSwapModal
        open={openConfirmationModal}
        swapModalAction={SwapModalAction.CREATE_SWAP}
        onClose={() => setOpenConfirmationModal(false)}
      />
    </div>
  );
};

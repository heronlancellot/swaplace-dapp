import {
  DoneIcon,
  OfferTag,
  OffersContext,
  PonderFilter,
  ThreeDotsCardOffersOptions,
} from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { ConfirmSwapModal, SwapModalAction } from "@/components/02-molecules";
import { PopulatedSwapOfferCard } from "@/lib/client/offers-utils";
import React, { useContext, useState } from "react";

export const TokenOfferDetails = ({
  swap,
}: {
  swap: PopulatedSwapOfferCard;
}) => {
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { acceptSwapOffer } = useContext(OffersContext);

  const acceptOffer = () => {
    acceptSwapOffer(swap);
    setOpenConfirmationModal(true);
  };

  const needsExpiryDate =
    swap.status.toUpperCase() !== PonderFilter.ACCEPTED.toUpperCase() &&
    swap.status.toUpperCase() !== PonderFilter.CANCELED.toUpperCase();

  let formattedSwapExpiryDate = null;
  if (needsExpiryDate) {
    const swapExpiryDate = new Date(Number(swap.expiryDate) * 1000);

    let isDateValid = true;

    // Check if the date is valid
    if (isNaN(swapExpiryDate.getTime())) {
      isDateValid = false;
    }

    const day = swapExpiryDate.getDate(); // Day of the month
    const month = swapExpiryDate.toLocaleString("default", { month: "short" }); // Month abbreviation
    const year = swapExpiryDate.getFullYear(); // Year

    // Format the date string
    formattedSwapExpiryDate = isDateValid ? `${day} ${month} ${year}` : null;
  }

  return (
    <div className="flex w-full justify-between items-center py-2 px-3">
      <div>
        <ul className="flex p-small dark:!text-[#A3A9A5] items-center gap-2">
          <OfferTag status={swap.status} />
          {needsExpiryDate && (
            <li className="flex items-center gap-2">
              <div className=" w-1 h-1 bg-neutral-600 rounded-full shadow-inner" />
              Expires on {formattedSwapExpiryDate}
            </li>
          )}
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-neutral-600 rounded-full shadow-inner" />
            Created by {swap.askerTokens.address?.getEllipsedAddress()}
          </li>
        </ul>
      </div>
      <div className="flex gap-2 justify-center items-center ">
        {authenticatedUserAddress?.equals(swap.bidderTokens.address) &&
          swap.status !== PonderFilter.ACCEPTED && (
            <div>
              <button
                onClick={acceptOffer}
                className="disabled:pointer-events-none rounded-lg w-full h-[28px] shadow-tag bg-[#d8f035] py-1 px-3 items-center flex justify-center gap-2"
              >
                <DoneIcon className="text-[#181A19]" />
                <p className="p-medium-bold-variant-black">Accept</p>
              </button>
            </div>
          )}

        <ThreeDotsCardOffersOptions swap={swap} />
      </div>

      <ConfirmSwapModal
        open={openConfirmationModal}
        swapModalAction={SwapModalAction.ACCEPT_SWAP}
        onClose={() => {
          setOpenConfirmationModal(false);
        }}
      />
    </div>
  );
};

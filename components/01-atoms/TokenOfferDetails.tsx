import { ConfirmSwapModal, SwapModalAction } from "../02-molecules";
import {
  DoneIcon,
  OffersContext,
  PopulatedSwapOfferInterface,
  ThreeDotsCardOffersOptions,
} from "@/components/01-atoms";

import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";

import React, { useContext, useEffect, useState } from "react";

interface TokenOfferDetailsInterface {
  swap: PopulatedSwapOfferInterface;
}

export const TokenOfferDetails = ({ swap }: TokenOfferDetailsInterface) => {
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { acceptSwapOffer, swapOfferToAccept: contextSwap } =
    useContext(OffersContext);

  const acceptOffer = () => {
    acceptSwapOffer(swap);
  };

  useEffect(() => {
    if (contextSwap) setOpenConfirmationModal(true);
  }, [contextSwap]);

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
  const formattedSwapExpiryDate = isDateValid
    ? `${day} ${month}, ${year}`
    : null;

  // TODO: Include status, owner and expiryDate
  return (
    <div className="flex w-full justify-between items-center py-2 px-3">
      <div>
        <ul className="flex p-small dark:!text-[#A3A9A5] items-center gap-2">
          {/* {displayStatus && <OfferTag status={displayStatus} />} */}
          <li className="flex items-center gap-2">
            <div className=" w-1 h-1 bg-neutral-600 rounded-full shadow-inner" />
            Expires on {formattedSwapExpiryDate}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-neutral-600 rounded-full shadow-inner" />
            Created by {swap.ask.address?.getEllipsedAddress()}
          </li>
        </ul>
      </div>
      <div className="flex gap-2 justify-center items-center ">
        {authenticatedUserAddress?.equals(swap.bid.address) && (
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

        <ThreeDotsCardOffersOptions />
      </div>

      {authenticatedUserAddress && (
        <ConfirmSwapModal
          open={openConfirmationModal}
          swapModalAction={SwapModalAction.ACCEPT_SWAP}
          onClose={() => setOpenConfirmationModal(false)}
        />
      )}
    </div>
  );
};

import { SwapOfferInterface } from "../03-organisms/SwapOffers";
import { ConfirmAcceptSwapModal } from "../02-molecules/ConfirmAcceptSwapModal";
import {
  DoneIcon,
  OfferTag,
  ThreeDotsCardOffersOptions,
} from "@/components/01-atoms";

import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";

import React, { useState } from "react";

interface TokenOfferDetailsInterface {
  swap: SwapOfferInterface;
}

export const TokenOfferDetails = ({ swap }: TokenOfferDetailsInterface) => {
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();

  const displayStatus = status;

  // TODO: Include status, owner and expiryDate
  return (
    <div className="flex w-full justify-between items-center py-2 px-3">
      <div>
        <ul className="flex p-small dark:!text-[#A3A9A5] items-center gap-2">
          {displayStatus && <OfferTag status={displayStatus} />}
          <li className="flex items-center gap-2">
            <div className=" w-1 h-1 bg-neutral-600 rounded-full shadow-inner" />
            Expires on {swap.expiryDate}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-neutral-600 rounded-full shadow-inner" />
            Created by {swap.ask.address?.getEllipsedAddress()}
          </li>
        </ul>
      </div>
      <div className="flex gap-2 justify-center items-center ">
        {authenticatedUserAddress?.address !== swap.ask.address?.address && (
          <div>
            <button
              onClick={() => {
                setOpenConfirmationModal(true);
              }}
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
        <ConfirmAcceptSwapModal
          swapId={swap.id}
          receiver={authenticatedUserAddress?.address}
          open={openConfirmationModal}
          onClose={() => setOpenConfirmationModal(false)}
        />
      )}
    </div>
  );
};

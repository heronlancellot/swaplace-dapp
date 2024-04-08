import { SwapContext, ProgressBar, OffersContext } from "@/components/01-atoms";
import { SwapModalAction } from "@/components/02-molecules";
import { Token } from "@/lib/shared/types";
import { useContext, useEffect, useState } from "react";

interface ProgressStatusProps {
  swapModalAction: SwapModalAction;
}

export const ProgressStatus = ({ swapModalAction }: ProgressStatusProps) => {
  const {
    approvedTokensCount: createOfferTokensApproved,
    authenticatedUserTokensList,
  } = useContext(SwapContext);
  const { approvedTokensCount: acceptOfferTokensApproved, swapOfferToAccept } =
    useContext(OffersContext);

  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [approvedTokensCount, setApprovedTokensCount] = useState(0);
  useEffect(() => {
    switch (swapModalAction) {
      case SwapModalAction.CREATE_SWAP:
        setTokensList(authenticatedUserTokensList);
        setApprovedTokensCount(createOfferTokensApproved);
        break;
      case SwapModalAction.ACCEPT_SWAP:
        if (!swapOfferToAccept) return;
        setTokensList(swapOfferToAccept.bid.tokens);
        setApprovedTokensCount(acceptOfferTokensApproved);
        break;
    }
  }, [
    swapModalAction,
    authenticatedUserTokensList,
    swapOfferToAccept,
    createOfferTokensApproved,
    acceptOfferTokensApproved,
  ]);

  return (
    <div className="w-max flex flex-grow gap-2 justify-center items-center">
      <p className="flex w-fit mr-auto md:mr-4">
        {/* TODO: align this logic so this condition is not needed */}
        {approvedTokensCount > tokensList.length
          ? tokensList.length
          : approvedTokensCount}
        {" / " + tokensList.length}
      </p>
      <div className="hidden md:block w-[80%] max-w-[200px] mr-auto">
        <ProgressBar
          currentStep={approvedTokensCount}
          numberOfItems={tokensList.length}
        />
      </div>
    </div>
  );
};

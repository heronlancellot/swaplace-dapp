/* eslint-disable react-hooks/exhaustive-deps */
import { OffersContext, SwapContext } from "@/components/01-atoms";
import { SwapModalAction } from "@/components/02-molecules";
import { ApproveTokenCard } from "@/components/03-organisms";
import { Token } from "@/lib/shared/types";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useContext, useEffect, useState } from "react";

interface ApproveTokenCardsProps {
  swapModalAction: SwapModalAction;
}

export const ApproveTokenCards = ({
  swapModalAction,
}: ApproveTokenCardsProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();

  // SwapModalAction.CREATE_SWAP
  const {
    authenticatedUserTokensList,
    approvedTokensCount: createOfferTokensApproved,
    setApprovedTokensCount: updateCreateSwapApprovedTokensCount,
  } = useContext(SwapContext);

  useEffect(() => {
    updateCreateSwapApprovedTokensCount(0);
  }, [authenticatedUserTokensList]);

  // SwapModalAction.ACCEPT_SWAP
  const {
    setApprovedTokensCount: updateAcceptSwapApprovedTokensCount,
    approvedTokensCount: acceptOfferTokensApproved,
    swapOfferToAccept,
  } = useContext(OffersContext);

  const [approvedTokensList, setApprovedTokensList] = useState<Token[]>([]);

  // Handle token approval for both scenarios above
  const handleTokenApproval = (token: Token) => {
    let approvedTokensCount = 0;

    if (!approvedTokensList.includes(token)) {
      switch (swapModalAction) {
        case SwapModalAction.CREATE_SWAP:
          approvedTokensCount = createOfferTokensApproved + 1;
          updateCreateSwapApprovedTokensCount(approvedTokensCount);
          break;
        case SwapModalAction.ACCEPT_SWAP:
          approvedTokensCount = acceptOfferTokensApproved + 1;
          updateAcceptSwapApprovedTokensCount(approvedTokensCount);
          break;
        default:
          break;
      }

      setApprovedTokensList([...approvedTokensList, token]);
    }
  };

  const [tokensToApprove, setTokensToApprove] = useState<Token[]>([]);
  useEffect(() => {
    switch (swapModalAction) {
      case SwapModalAction.CREATE_SWAP:
        setTokensToApprove(authenticatedUserTokensList);
        break;
      case SwapModalAction.ACCEPT_SWAP:
        if (!swapOfferToAccept) setTokensToApprove([]);
        else setTokensToApprove(swapOfferToAccept.ask.tokens);
        break;
      default:
        break;
    }
  }, [authenticatedUserTokensList, swapOfferToAccept]);

  if (!authenticatedUserAddress?.address) {
    return null;
  }

  return (
    <div className="flex justify-center items-center relative">
      <div className="grid grid-cols-1 w-[100%] gap-3 relative overflow-y-auto max-h-[370px] no-scrollbar">
        {tokensToApprove.map((token, index) => (
          <ApproveTokenCard
            setTokenWasApprovedForSwap={handleTokenApproval}
            key={index}
            token={token}
          />
        ))}
      </div>
    </div>
  );
};

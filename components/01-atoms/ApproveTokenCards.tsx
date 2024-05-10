/* eslint-disable react-hooks/exhaustive-deps */
import { ApproveTokenCardSkeleton } from "./ApproveTokenCardSkeleton";
import { SwapModalAction } from "@/components/02-molecules";
import { ApproveTokenCard } from "@/components/03-organisms";
import { Token } from "@/lib/shared/types";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { isTokenSwapApproved } from "@/lib/service/verifyTokensSwapApproval";
import { OffersContext, SwapContext } from "@/lib/client/contexts";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";

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

  const { chain } = useNetwork();
  const [previoslytApprovedList, setPrevioslytApprovedList] = useState<
    boolean[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        else setTokensToApprove(swapOfferToAccept.askerTokens.tokens);
        break;
      default:
        break;
    }
  }, [authenticatedUserTokensList, swapOfferToAccept]);

  // checks if the token is already approved
  const checkForTokenApproval = async (token: Token) => {
    let chainId: number | undefined = undefined;

    if (typeof chain?.id != "undefined") {
      chainId = chain?.id;
    }

    if (!chainId) {
      throw new Error("User is not connected to any network");
    }

    const approved = await isTokenSwapApproved({
      token,
      chainId,
      authedUserAddress: authenticatedUserAddress,
    });

    return approved;
  };

  // checks which tokens are already approved
  const getTokensApprovedCount = async () => {
    setIsLoading(true);
    const promises = tokensToApprove.map((token) =>
      checkForTokenApproval(token),
    );
    const approvals = await Promise.all(promises);

    const newApprovedList: boolean[] = [];
    let count = 0;

    approvals.forEach((isApproved) => {
      if (isApproved) {
        count++;
        newApprovedList.push(true);
      } else {
        newApprovedList.push(false);
      }
    });

    setPrevioslytApprovedList(newApprovedList);

    switch (swapModalAction) {
      case SwapModalAction.CREATE_SWAP:
        updateCreateSwapApprovedTokensCount(count);
        break;
      case SwapModalAction.ACCEPT_SWAP:
        updateAcceptSwapApprovedTokensCount(count);
        break;
      default:
        break;
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getTokensApprovedCount();
  }, [tokensToApprove]);

  if (!authenticatedUserAddress?.address) {
    return null;
  }

  return (
    <div className="flex justify-center items-center relative">
      <div className="grid grid-cols-1 w-[100%] gap-3 relative overflow-y-auto max-h-[370px] no-scrollbar">
        {tokensToApprove.map((token, index) =>
          isLoading ? (
            <ApproveTokenCardSkeleton key={token.id} />
          ) : (
            <ApproveTokenCard
              isPrevioslyApproved={previoslytApprovedList[index]}
              setTokenWasApprovedForSwap={handleTokenApproval}
              key={
                token.id
                  ? token.id + previoslytApprovedList[index]
                  : token.contract
              }
              token={token}
            />
          ),
        )}
      </div>
    </div>
  );
};

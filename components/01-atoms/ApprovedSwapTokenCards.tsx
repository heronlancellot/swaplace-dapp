/* eslint-disable react-hooks/exhaustive-deps */
import { ApproveTokenCardSkeleton } from "./ApproveTokenCardSkeleton";
import { ApproveTokenCard } from "@/components/03-organisms";
import { SwapContext } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { Token } from "@/lib/shared/types";
import { isTokenSwapApproved } from "@/lib/service/verifyTokensSwapApproval";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";

interface ApprovedSwapTokenCardsProps {
  tokensList: Token[];
}

export const ApprovedSwapTokenCards = ({
  tokensList,
}: ApprovedSwapTokenCardsProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const [tokensApprovedForSwap, setTokensApprovedForSwap] = useState<Token[]>(
    [],
  );
  const { chain } = useNetwork();

  const { setApprovedTokensCount } = useContext(SwapContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previouslyApprovedList, setPreviouslyApprovedList] = useState<
    boolean[]
  >([]);

  useEffect(() => {
    setApprovedTokensCount(0);
  }, [tokensList]);

  const addNewTokenToApprovedList = (token: Token) => {
    if (!tokensApprovedForSwap.includes(token)) {
      const approvedTokensCount = tokensApprovedForSwap.length + 1;
      setTokensApprovedForSwap([...tokensApprovedForSwap, token]);
      setApprovedTokensCount(approvedTokensCount);
    }
  };

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

  const getAlreadyApprovedTokens = async () => {
    setIsLoading(true);
    const promises = tokensList.map((token) => checkForTokenApproval(token));
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

    setPreviouslyApprovedList(newApprovedList);
    setApprovedTokensCount(count);
    setIsLoading(false);
  };

  useEffect(() => {
    getAlreadyApprovedTokens();
  }, [tokensList]);

  if (!authenticatedUserAddress?.address) {
    return null;
  }

  return (
    <div className="flex justify-center items-center relative">
      <div className="grid grid-cols-1 w-[100%] gap-3 relative overflow-y-auto max-h-[370px] no-scrollbar">
        {tokensList.map((token, index) =>
          isLoading ? (
            <ApproveTokenCardSkeleton key={token.id} />
          ) : (
            <ApproveTokenCard
              isPrevioslyApproved={previouslyApprovedList[index]}
              setTokenWasApprovedForSwap={addNewTokenToApprovedList}
              key={
                token.id ? token.id + previouslyApprovedList[index] : token.name
              }
              token={token}
            />
          ),
        )}
      </div>
    </div>
  );
};

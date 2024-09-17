/* eslint-disable react-hooks/exhaustive-deps */
import { BlockExplorerExternalLinkButton } from "@/components/01-atoms";
import {
  TokenCard,
  TokenCardActionType,
  TokenCardStyleType,
} from "@/components/02-molecules";
import {
  getTokenAmountOrId,
  toastBlockchainTxError,
} from "@/lib/client/blockchain-utils";
import { approveSwap } from "@/lib/service/approveSwap";
import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "@/lib/client/constants";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { isTokenSwapApproved } from "@/lib/service/verifyTokensSwapApproval";
import { IApproveTokenSwap } from "@/lib/client/swap-utils";
import { getTokenContractAddress, getTokenName } from "@/lib/client/ui-utils";
import { Token } from "@/lib/shared/types";
import toast from "react-hot-toast";
import { type TransactionReceipt } from "viem";
import { type WalletClient, useNetwork, useWalletClient } from "wagmi";
import cc from "classcat";
import { useCallback, useEffect, useState } from "react";

interface ApproveTokenCardProps {
  token: Token;
  setTokenWasApprovedForSwap: (token: Token) => void;
  isPrevioslyApproved?: boolean;
}

enum TokenApprovalStatus {
  CLICK_TO_APPROVE = "CLICK_TO_APPROVE",
  APPROVE_IN_YOUR_WALLET = "APPROVE_IN_YOUR_WALLET",
  WAITING_BLOCKCHAIN_CONFIRMATION = "WAITING_BLOCKCHAIN_CONFIRMATION",
  APPROVED = "APPROVED",
}

export const ApproveTokenCard = ({
  token,
  setTokenWasApprovedForSwap,
  isPrevioslyApproved = false,
}: ApproveTokenCardProps) => {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();

  const [isApproved, setIsApproved] = useState(isPrevioslyApproved);
  const [tokenApprovalStatus, setTokenApprovalStatus] = useState(
    isPrevioslyApproved
      ? TokenApprovalStatus.APPROVED
      : TokenApprovalStatus.CLICK_TO_APPROVE,
  );

  const { authenticatedUserAddress } = useAuthenticatedUser();

  const checkForTokenApproval = async (token: Token) => {
    let chainId: number | undefined = undefined;

    if (typeof chain?.id != "undefined") {
      chainId = chain?.id;
    }

    if (!chainId) {
      toast.error("Wallet not connected to any chain");
      return;
    }

    const approved = await isTokenSwapApproved({
      token,
      chainId,
      authedUserAddress: authenticatedUserAddress,
    });

    setIsApproved(approved);

    return approved;
  };

  useEffect(() => {
    const chainId = chain?.id;
    if (!chainId) {
      console.error("User is not connected to any network");
      return;
    }
  }, [chain?.id]);

  const askForTokenApproval = async (
    token: Token,
  ): Promise<TransactionReceipt | undefined> => {
    let chainId: number | undefined = undefined;

    if (typeof chain?.id != "undefined") {
      chainId = chain?.id;
    }

    if (!chainId || !walletClient) {
      throw new Error("User's wallet is not connected");
    }

    if (!token.contract)
      throw new Error(`Token contract is not defined for: ${token}`);

    const swapData: IApproveTokenSwap = {
      walletClient: walletClient as WalletClient,
      spender: SWAPLACE_SMART_CONTRACT_ADDRESS[chainId] as `0x${string}`,
      tokenContractAddress: token.contract as `0x${string}`,
      amountOrId: getTokenAmountOrId(token),
      chainId,
      token,
      onWalletConfirmation: () =>
        setTokenApprovalStatus(
          TokenApprovalStatus.WAITING_BLOCKCHAIN_CONFIRMATION,
        ),
    };

    try {
      const transactionReceipt = await approveSwap(swapData);

      if (transactionReceipt.success) {
        toast.success(`${getTokenName(token)} has been approved!`);
        setIsApproved(true);
        setTokenApprovalStatus(TokenApprovalStatus.APPROVED);
        setTokenWasApprovedForSwap(token);
        setTokenApprovalStatus(TokenApprovalStatus.APPROVED);
        setIsApproved(true);

        // Below alias is always valid since whenever a tx is successful, a receipt is returned
        return transactionReceipt.receipt as TransactionReceipt;
      } else {
        setTokenApprovalStatus(TokenApprovalStatus.CLICK_TO_APPROVE);
        toastBlockchainTxError(transactionReceipt.errorMessage || "");
      }
    } catch (error) {
      // TODO: map error scenarios and create corresponding error triggers
      setTokenApprovalStatus(TokenApprovalStatus.CLICK_TO_APPROVE);
      toastBlockchainTxError(String(error));
      console.error(error);
    }
  };

  const handleTokenApproval = useCallback(async () => {
    const approved = await checkForTokenApproval(token);
    if (approved) {
      toast.success(`${getTokenName(token)} was already approved for swapping`);
    } else {
      setTokenApprovalStatus(TokenApprovalStatus.APPROVE_IN_YOUR_WALLET);
      await askForTokenApproval(token);
    }
  }, [token, checkForTokenApproval, askForTokenApproval]);

  if (!authenticatedUserAddress) return null;

  return (
    <div
      className={cc([
        "flex px-4 py-2 items-center gap-4",
        isApproved
          ? "bg-yellowGreen p-medium dark:p-medium rounded-xl disabled cursor-auto pointer-events-none"
          : "dark:bg-forestGray bg-lightGray p-medium dark:p-medium-dark dark:hover:p-medium dark:hover:text-midnightGreen dark:hover:bg-yellowGreen hover:bg-yellowGreen transition rounded-xl border border-darkGray",
      ])}
      onClick={() => {
        handleTokenApproval();
      }}
      role="button"
    >
      <div className="flex gap-4 w-[75%] items-center">
        <div>
          <TokenCard
            displayERC20TokensAmount={true}
            withSelectionValidation={false}
            onClickAction={TokenCardActionType.APPROVE_TOKEN_SWAP}
            ownerAddress={authenticatedUserAddress}
            styleType={TokenCardStyleType.SMALL}
            tokenData={token}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex">
            <p>{getTokenName(token)}</p>
          </div>
          <div className="flex p-semibold-dark">
            {tokenApprovalStatus === TokenApprovalStatus.CLICK_TO_APPROVE ? (
              <p className="bg-mediumGray dark:bg-smokeGray p-1.5 w-fit rounded-[4px] min-h-6 items-center flex">
                CLICK TO APPROVE
              </p>
            ) : tokenApprovalStatus ===
              TokenApprovalStatus.APPROVE_IN_YOUR_WALLET ? (
              <p className="bg-mediumGray dark:bg-smokeGray p-1.5 w-fit rounded-[4px] min-h-6 items-center flex">
                APPROVE TRANSACTION
              </p>
            ) : tokenApprovalStatus ===
              TokenApprovalStatus.WAITING_BLOCKCHAIN_CONFIRMATION ? (
              <p className="bg-mediumGray dark:bg-smokeGray p-1.5 w-fit rounded-[4px] min-h-6 items-center flex">
                WAIT FOR CONFIRMATION
              </p>
            ) : tokenApprovalStatus === TokenApprovalStatus.APPROVED ? (
              <div className="bg-mediumGray dark:bg-smokeGray p-1.5 w-fit bg-opacity-30 rounded-[4px] min-h-6 items-center flex">
                <p className="text-white">APPROVED</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        role="button"
        className="flex pointer-events-auto items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <BlockExplorerExternalLinkButton
          address={getTokenContractAddress(token)}
        />
      </div>
    </div>
  );
};

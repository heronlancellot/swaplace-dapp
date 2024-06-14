/* eslint-disable react-hooks/exhaustive-deps */
import { OfferExpiryConfirmSwapStation } from "../01-atoms/OfferExpiryConfirmSwapStation";
import { verifyTokenOwnership } from "@/lib/service/verifyTokenOwnershipAndParseTokenData";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  SwapModalLayout,
  SwapModalButton,
  ButtonVariant,
  OfferExpiryConfirmSwap,
  ApproveTokenCards,
} from "@/components/01-atoms";
import { ProgressStatus } from "@/components/02-molecules";
import { SwapUserConfiguration, createSwap } from "@/lib/service/createSwap";
import {
  ButtonClickPossibilities,
  encodeConfig,
  toastBlockchainTxError,
} from "@/lib/client/blockchain-utils";
import { CreateTokenOffer } from "@/components/03-organisms";
import { fromTokensToAssets, getSwapConfig } from "@/lib/client/swap-utils";
import { SwapModalSteps } from "@/lib/client/ui-utils";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { acceptSwap } from "@/lib/service/acceptSwap";
import { SwapContext, OffersContext } from "@/lib/client/contexts";
import { type WalletClient, useNetwork, useWalletClient } from "wagmi";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { hexToNumber } from "viem";

interface ConfirmSwapApprovalModalProps {
  open: boolean;
  swapModalAction: SwapModalAction;
  onClose: () => void;
}

export const ConfirmSwapModal = ({
  swapModalAction = SwapModalAction.ACCEPT_SWAP,
  open,
  onClose,
}: ConfirmSwapApprovalModalProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const {
    timeDate,
    authenticatedUserTokensList,
    searchedUserTokensList,
    approvedTokensCount: createSwapApprovedTokensCount,
    validatedAddressToSwap,
    currentSwapModalStep,
    // TODO : Remove authenticated & Searched to use etherValue
    // searchedUserEtherValue,
    etherRecipient,
    etherValue,
    updateSwapStep,
    clearSwapData,
  } = useContext(SwapContext);

  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { theme } = useTheme();

  const [approvedTokensCount, setApprovedTokensCount] = useState<number>(0);
  const [tokensList, setTokensList] = useState<Token[]>([]);

  const {
    swapOfferToAccept,
    approvedTokensCount: acceptSwapApprovedTokensCount,
  } = useContext(OffersContext);

  useEffect(() => {
    switch (swapModalAction) {
      case SwapModalAction.CREATE_SWAP:
        setApprovedTokensCount(createSwapApprovedTokensCount);
        setTokensList(authenticatedUserTokensList);
        break;
      case SwapModalAction.ACCEPT_SWAP:
        if (!swapOfferToAccept) return;
        setApprovedTokensCount(acceptSwapApprovedTokensCount);
        setTokensList(swapOfferToAccept.askerTokens.tokens);
        break;
    }
  }, [
    swapModalAction,
    authenticatedUserTokensList,
    swapOfferToAccept,
    createSwapApprovedTokensCount,
    acceptSwapApprovedTokensCount,
  ]);

  useEffect(() => {
    if (
      currentSwapModalStep === SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION &&
      open
    ) {
      handleSwap();
    }
  }, [currentSwapModalStep]);

  useEffect(() => {
    if (!open) {
      updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
    }
  }, [open]);

  useEffect(() => {
    updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
  }, [authenticatedUserTokensList]);

  if (
    !authenticatedUserAddress?.address ||
    (swapModalAction === SwapModalAction.CREATE_SWAP &&
      (!searchedUserTokensList || !authenticatedUserTokensList) &&
      open)
  ) {
    onClose();
    return null;
  }

  let chainId: number | undefined = undefined;
  let userWalletClient: WalletClient;

  const handleSwap = async () => {
    if (typeof chain?.id != "undefined" && walletClient != undefined) {
      chainId = chain.id;
      userWalletClient = walletClient;
    } else {
      throw new Error("Chain ID is undefined");
    }

    const configurations: SwapUserConfiguration = {
      walletClient: userWalletClient,
      chain: chainId,
    };

    try {
      if (!approvedTokensCount) {
        toast.error("You must approve the Tokens to Swap");
        updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
      }

      if (authenticatedUserAddress) {
        let transactionReceipt;
        switch (swapModalAction) {
          case SwapModalAction.ACCEPT_SWAP:
            if (swapOfferToAccept === null) throw Error("Swap offer is null");
            if (chainId === undefined) throw Error("Chain ID is undefined");
            const verificationPromisesBidderTokens =
              swapOfferToAccept?.bidderTokens.tokens.map(
                async (token: Token) =>
                  await verifyTokenOwnership({
                    user: {
                      address: swapOfferToAccept.bidderTokens.address,
                      chainId: chainId as number,
                    },
                    token: {
                      contractAddress: token.contract as `0x${string}`,
                      tokenId: String(token.id),
                      tokenType: token.tokenType,
                    },
                  }),
              );

            const verificationResultsBidderTokens = await Promise.all(
              verificationPromisesBidderTokens,
            );
            if (verificationResultsBidderTokens.includes(false)) {
              updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
              toast.error(
                `The address ${swapOfferToAccept.bidderTokens.address.getEllipsedAddress()} does not have this token anymore`,
              );
              return;
            }

            const verificationPromisesAskerTokens =
              swapOfferToAccept?.askerTokens.tokens.map(
                async (token: Token) =>
                  await verifyTokenOwnership({
                    user: {
                      address: swapOfferToAccept.askerTokens.address,
                      chainId: chainId as number,
                    },
                    token: {
                      contractAddress: token.contract as `0x${string}`,
                      tokenId: String(token.id),
                      tokenType: token.tokenType,
                    },
                  }),
              );

            const verificationResultsAskerTokens = await Promise.all(
              verificationPromisesAskerTokens,
            );
            if (verificationResultsAskerTokens.includes(false)) {
              toast.error(
                `The address ${swapOfferToAccept.askerTokens.address.getEllipsedAddress()} does not have this token anymore`,
              );
              return;
            }
            // ACCEPT SWAP
            const msgValueAcceptSwap =
              etherRecipient > 0 ? etherValue : BigInt(0);

            transactionReceipt = await acceptSwap(
              swapOfferToAccept.id,
              authenticatedUserAddress,
              configurations,
              msgValueAcceptSwap,
            );
            break;
          case SwapModalAction.CREATE_SWAP:
            if (!validatedAddressToSwap)
              throw new Error("No Swap offer receiver is defined");

            const authenticatedUserAssets = await fromTokensToAssets(
              authenticatedUserTokensList,
            );

            const searchedUserAssets = await fromTokensToAssets(
              searchedUserTokensList,
            );

            const encodeConfigData = await encodeConfig({
              allowed: validatedAddressToSwap.address,
              expiry: timeDate,
              etherRecipient: etherRecipient, // 0 -> allowed gets the eth  // 1 ~ 255 -> the allowed send the eth, the owner receives
              etherValue: etherValue / BigInt(1e12),
            });

            const swapConfig = await getSwapConfig(
              new EthereumAddress(userWalletClient.account.address),
              encodeConfigData,
              timeDate,
              authenticatedUserAssets,
              searchedUserAssets,
              chainId,
            );

            // Create swap
            const msgValueCreateSwap =
              etherRecipient == 0 ? etherValue : BigInt(0);

            transactionReceipt = await createSwap(
              swapConfig,
              configurations,
              msgValueCreateSwap,
            );
            break;
        }

        if (transactionReceipt != undefined) {
          const swapId = hexToNumber(
            transactionReceipt.logs[0].topics[1] as `0x${string}`,
          );
          toast.success(`Successfully created swap [#${swapId}] offer!`);
          updateSwapStep(ButtonClickPossibilities.NEXT_STEP);
        } else {
          toastBlockchainTxError("Create swap failed");
          updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
        }
      }
    } catch (error) {
      toastBlockchainTxError(String(error));
      updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
      console.error(error);
    }
  };

  const validateTokensAreApproved = () => {
    if (approvedTokensCount === tokensList.length) {
      updateSwapStep(ButtonClickPossibilities.NEXT_STEP);
    } else {
      toast.error("You must approve the Tokens to Swap");
    }
  };

  const ConfirmSwapModalStep: Partial<Record<SwapModalSteps, JSX.Element>> = {
    [SwapModalSteps.APPROVE_TOKENS]: (
      <SwapModalLayout
        toggleCloseButton={{ open: open, onClose: onClose }}
        text={ModalTextContent[swapModalAction][SwapModalSteps.APPROVE_TOKENS]}
        body={<ApproveTokenCards swapModalAction={swapModalAction} />}
        footer={
          <div className="flex w-full justify-between items-center">
            <ProgressStatus swapModalAction={swapModalAction} />
            <SwapModalButton
              label={"Continue"}
              onClick={validateTokensAreApproved}
              aditionalStyle={theme === "light" ? "text-black" : "text-yellow"}
            />
          </div>
        }
      />
    ),
    [SwapModalSteps.ACCEPT_SWAP]: (
      <SwapModalLayout
        toggleCloseButton={{ open: open, onClose: onClose }}
        text={ModalTextContent[swapModalAction][SwapModalSteps.ACCEPT_SWAP]}
        body={
          <div className="flex flex-col gap-2 flex-grow">
            {swapModalAction === SwapModalAction.CREATE_SWAP ? (
              <OfferExpiryConfirmSwapStation />
            ) : (
              <OfferExpiryConfirmSwap />
            )}
            <CreateTokenOffer swapModalAction={swapModalAction} />
          </div>
        }
        footer={
          <div className="flex w-full justify-end gap-3">
            <SwapModalButton
              label={"Back"}
              variant={ButtonVariant.ALTERNATIVE}
              onClick={() => {
                updateSwapStep(ButtonClickPossibilities.PREVIOUS_STEP);
              }}
            />

            <SwapModalButton
              label={"Continue"}
              disabled={!approvedTokensCount}
              variant={ButtonVariant.SECONDARY}
              onClick={() => {
                updateSwapStep(ButtonClickPossibilities.NEXT_STEP);
              }}
            />
          </div>
        }
      />
    ),
    [SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION]: (
      <SwapModalLayout
        toggleCloseButton={{ open: open, onClose: onClose }}
        text={
          ModalTextContent[swapModalAction][
            SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION
          ]
        }
        body={
          <div className="flex flex-col gap-2 flex-grow">
            {swapModalAction === SwapModalAction.CREATE_SWAP ? (
              <OfferExpiryConfirmSwapStation />
            ) : (
              <OfferExpiryConfirmSwap />
            )}
            <CreateTokenOffer swapModalAction={swapModalAction} />
          </div>
        }
        footer={
          <div className="flex w-full justify-end gap-3">
            <SwapModalButton
              label={"Waiting blockchain interaction..."}
              variant={ButtonVariant.SECONDARY}
              disabled={true}
              isLoading={true}
            />
          </div>
        }
      />
    ),
    [SwapModalSteps.SUCCESSFUL_SWAP]: (
      <SwapModalLayout
        toggleCloseButton={{ open: open, onClose: onClose }}
        text={ModalTextContent[swapModalAction][SwapModalSteps.SUCCESSFUL_SWAP]}
        body={
          <div className="flex flex-col gap-2 flex-grow">
            {swapModalAction === SwapModalAction.CREATE_SWAP ? (
              <OfferExpiryConfirmSwapStation />
            ) : (
              <OfferExpiryConfirmSwap />
            )}{" "}
            <CreateTokenOffer swapModalAction={swapModalAction} />
          </div>
        }
        footer={
          <div className="flex w-full justify-end gap-3">
            <SwapModalButton
              label={"Close"}
              variant={ButtonVariant.SECONDARY}
              onClick={() => {
                clearSwapData();
                onClose();
              }}
            />
          </div>
        }
      />
    ),
  };

  return ConfirmSwapModalStep[currentSwapModalStep] || <></>;
};

export enum SwapModalAction {
  ACCEPT_SWAP,
  CREATE_SWAP,
}

type ModalTextContentInterface = {
  title: string;
  description: string;
};

const ModalTextContent: Record<
  SwapModalAction,
  Record<SwapModalSteps, ModalTextContentInterface>
> = {
  [SwapModalAction.CREATE_SWAP]: {
    [SwapModalSteps.APPROVE_TOKENS]: {
      title: "Swap offer confirmation",
      description:
        "Before sending your offer, please approve the assets you want to trade by clicking on them.",
    },
    [SwapModalSteps.ACCEPT_SWAP]: {
      title: "Swap offer confirmation",
      description: "Please review your final proposal.",
    },
    [SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION]: {
      title: "Swap offer confirmation",
      description:
        "Please accept the proposal request in your Web3 wallet and wait for the transaction to be registered.",
    },
    [SwapModalSteps.SUCCESSFUL_SWAP]: {
      title: "Swap offer confirmed!",
      description: "Congrats, your swap offer was submitted.",
    },
  },
  [SwapModalAction.ACCEPT_SWAP]: {
    [SwapModalSteps.APPROVE_TOKENS]: {
      title: "Swap confirmation",
      description:
        "Before approving this offer, please approve the assets you will trade by clicking on them.",
    },
    [SwapModalSteps.ACCEPT_SWAP]: {
      title: "Swap confirmation",
      description: "Please review the offer you are accepting.",
    },
    [SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION]: {
      title: "Swap offer confirmation",
      description:
        "Please accept the proposal request in your Web3 wallet and wait for the transaction to be registered.",
    },
    [SwapModalSteps.SUCCESSFUL_SWAP]: {
      title: "Swap confirmed!",
      description: "Congrats, the swap offer was accepted!",
    },
  },
};

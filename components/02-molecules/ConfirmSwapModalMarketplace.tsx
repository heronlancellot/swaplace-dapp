/* eslint-disable react-hooks/exhaustive-deps */
import { ProgressStatusMarketplace } from "./ProgressStatusMarketplace";
import { ApproveTokenCardsMarketplace } from "../01-atoms/ApproveTokenCardsMarketplace";
import { CreateTokenOfferMarketplace } from "../03-organisms/CreateTokenOfferMarketplace";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  SwapModalLayout,
  SwapModalButton,
  ButtonVariant,
  OfferExpiryConfirmSwap,
  OfferExpiryConfirmSwapVariant,
} from "@/components/01-atoms";
import { SwapUserConfiguration, createSwap } from "@/lib/service/createSwap";
import {
  ButtonClickPossibilities,
  encodeConfig,
  toastBlockchainTxError,
} from "@/lib/client/blockchain-utils";
import { fromTokensToAssets, getSwapConfig } from "@/lib/client/swap-utils";
import { SwapModalSteps } from "@/lib/client/ui-utils";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { acceptSwap } from "@/lib/service/acceptSwap";
import { SwapContext } from "@/lib/client/contexts";
import { OffersContextMarketplace } from "@/lib/client/contexts/OffersContextMarketplace";
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

export const ConfirmSwapModalMarketplace = ({
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
    etherValue,
    etherRecipient,
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
  } = useContext(OffersContextMarketplace);

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

            transactionReceipt = await acceptSwap(
              swapOfferToAccept.id,
              authenticatedUserAddress,
              configurations,
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
              etherRecipient: etherRecipient,
              etherValue: etherValue,
            });

            const swapConfig = await getSwapConfig(
              new EthereumAddress(userWalletClient.account.address),
              encodeConfigData,
              timeDate,
              authenticatedUserAssets,
              searchedUserAssets,
              chainId,
            );

            transactionReceipt = await createSwap(swapConfig, configurations);
            break;
        }

        if (transactionReceipt != undefined) {
          const swapId = hexToNumber(
            transactionReceipt.logs[0].topics[1] as `0x${string}`,
          );
          const toastTextAction =
            swapModalAction === SwapModalAction.ACCEPT_SWAP
              ? "accepted"
              : "created";
          toast.success(
            `Successfully ${toastTextAction} swap offer [#${swapId}] !`,
          );
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
        body={
          <ApproveTokenCardsMarketplace swapModalAction={swapModalAction} />
        }
        footer={
          <div className="flex w-full justify-between items-center">
            <ProgressStatusMarketplace swapModalAction={swapModalAction} />
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
            <OfferExpiryConfirmSwap
              variant={OfferExpiryConfirmSwapVariant.MARKETPLACE}
            />
            <CreateTokenOfferMarketplace swapModalAction={swapModalAction} />
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
            <OfferExpiryConfirmSwap
              variant={OfferExpiryConfirmSwapVariant.MARKETPLACE}
            />
            <CreateTokenOfferMarketplace swapModalAction={swapModalAction} />
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
            <OfferExpiryConfirmSwap
              variant={OfferExpiryConfirmSwapVariant.MARKETPLACE}
            />
            <CreateTokenOfferMarketplace swapModalAction={swapModalAction} />
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

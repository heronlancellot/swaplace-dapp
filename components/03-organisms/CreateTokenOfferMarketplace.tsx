import { CardOffersMarketplace } from "../02-molecules/CardOffersMarketplace";
import { SwapModalAction } from "@/components/02-molecules";
import { SwapIcon, SwapIconVariant } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { PopulatedSwapOfferCard } from "@/lib/client/offers-utils";
import { SwapContext } from "@/lib/client/contexts";
import { OffersContextMarketplace } from "@/lib/client/contexts/OffersContextMarketplace";
import { SwapNativeEther } from "@/lib/client/swap-utils";
import cc from "classcat";
import { useContext } from "react";

export enum CreateTokenOfferVariant {
  HORIZONTAL,
  VERTICAL,
  VerticalVariantSwapNativeEther,
}

interface CreateTokenOfferProps {
  swapModalAction: SwapModalAction;
  variant?: CreateTokenOfferVariant;
}

interface CreateTokenOfferConfig {
  body: React.ReactNode;
}

export const CreateTokenOfferMarketplace = ({
  swapModalAction,
  variant = CreateTokenOfferVariant.VERTICAL,
}: CreateTokenOfferProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { validatedAddressToSwap } = useContext(SwapContext);
  const { swapOfferToAccept } = useContext(OffersContextMarketplace);

  /**
   * The horizonalVariant from TokenOffers get the data from Ponder
   * This variant will handle the offers to the authenticatedUserAddress
   *
   * @returns
   */

  if (
    swapModalAction === SwapModalAction.CREATE_SWAP &&
    (!authenticatedUserAddress || !validatedAddressToSwap)
  ) {
    return null;
  } else if (
    swapModalAction === SwapModalAction.ACCEPT_SWAP &&
    !swapOfferToAccept
  ) {
    return null;
  }

  let nativeEtherSwap: SwapNativeEther;

  if (swapOfferToAccept) {
    nativeEtherSwap = {
      recipient: swapOfferToAccept.recipient,
      value: swapOfferToAccept.value,
    };
  }

  const HorizontalVariant = () => {
    return (
      <div className="flex flex-col border border-darkGray dark:shadow-add-manually-card dark:bg-darkGreen rounded-lg ">
        <div className="flex flex-row border-b dark:border-darkGray relative">
          <div className={cc(["border-r dark:border-darkGray"])}>
            <CardOffersMarketplace
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? authenticatedUserAddress
                  : (swapOfferToAccept as PopulatedSwapOfferCard).askerTokens
                      .address
              }
            />
          </div>
          <div>
            <CardOffersMarketplace
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? validatedAddressToSwap
                  : (swapOfferToAccept as PopulatedSwapOfferCard).bidderTokens
                      .address
              }
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-mediumGray bg-midnightGreen rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
            <SwapIcon />
          </div>
        </div>
        <div className="flex-col"></div>
      </div>
    );
  };

  const VerticalVariant = () => {
    return (
      <div className="flex flex-col rounded-lg flex-grow">
        <div className="flex flex-col relative gap-2 flex-grow">
          <div className="p-4 relative flex flex-grow border border-darkGray rounded-lg dark:bg-darkGreen">
            <CardOffersMarketplace
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? authenticatedUserAddress
                  : (swapOfferToAccept as PopulatedSwapOfferCard).askerTokens
                      .address
              }
              variant={CreateTokenOfferVariant.VERTICAL}
            />
          </div>

          <div className="w-full relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border dark:border-darkGray border-mediumGray bg-offWhite dark:bg-midnightGreen rounded-full w-9 h-9 flex items-center justify-center">
              <SwapIcon variant={SwapIconVariant.VERTICAL} />
            </div>
          </div>

          <div className="p-4 flex flex-grow border border-darkGray rounded-lg dark:bg-darkGreen">
            <CardOffersMarketplace
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? validatedAddressToSwap
                  : (swapOfferToAccept as PopulatedSwapOfferCard).bidderTokens
                      .address
              }
              variant={CreateTokenOfferVariant.VERTICAL}
            />
          </div>
        </div>
      </div>
    );
  };

  const VerticalVariantSwapNativeEther = () => {
    return (
      <div className="flex flex-col rounded-lg flex-grow">
        <div className="flex flex-col relative gap-2 flex-grow">
          <div className="p-4 relative flex flex-grow border border-darkGray rounded-lg dark:bg-darkGreen">
            <CardOffersMarketplace
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? authenticatedUserAddress
                  : (swapOfferToAccept as PopulatedSwapOfferCard).askerTokens
                      .address
              }
              variant={CreateTokenOfferVariant.VerticalVariantSwapNativeEther}
              nativeEther={nativeEtherSwap}
            />
          </div>

          <div className="w-full relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border dark:border-darkGray border-mediumGray bg-offWhite dark:bg-midnightGreen rounded-full w-9 h-9 flex items-center justify-center">
              <SwapIcon variant={SwapIconVariant.VERTICAL} />
            </div>
          </div>

          <div className="p-4 flex flex-grow border border-darkGray rounded-lg dark:bg-darkGreen">
            <CardOffersMarketplace
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? validatedAddressToSwap
                  : (swapOfferToAccept as PopulatedSwapOfferCard).bidderTokens
                      .address
              }
              variant={CreateTokenOfferVariant.VerticalVariantSwapNativeEther}
              nativeEther={nativeEtherSwap}
            />
          </div>
        </div>
      </div>
    );
  };

  const CreateTokenOfferPropsConfig: Record<
    CreateTokenOfferVariant,
    CreateTokenOfferConfig
  > = {
    [CreateTokenOfferVariant.HORIZONTAL]: {
      body: <HorizontalVariant />,
    },
    [CreateTokenOfferVariant.VERTICAL]: {
      body: <VerticalVariant />,
    },
    [CreateTokenOfferVariant.VerticalVariantSwapNativeEther]: {
      body: <VerticalVariantSwapNativeEther />,
    },
  };

  return <>{CreateTokenOfferPropsConfig[variant].body}</>;
};

import { CardOffers, SwapModalAction } from "@/components/02-molecules";
import {
  SwapIcon,
  SwapContext,
  SwapIconVariant,
  OffersContext,
  PopulatedSwapOfferInterface,
} from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import cc from "classcat";
import { useContext } from "react";

export enum CreateTokenOfferVariant {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

interface CreateTokenOfferProps {
  swapModalAction: SwapModalAction;
  variant?: CreateTokenOfferVariant;
}

interface CreateTokenOfferConfig {
  body: React.ReactNode;
}

export const CreateTokenOffer = ({
  swapModalAction,
  variant = CreateTokenOfferVariant.VERTICAL,
}: CreateTokenOfferProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { validatedAddressToSwap } = useContext(SwapContext);
  const { swapOfferToAccept } = useContext(OffersContext);

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

  const HorizontalVariant = () => {
    return (
      <div className="flex flex-col border border-[#353836] dark:shadow-add-manually-card dark:bg-[#282B29] rounded-lg ">
        <div className="flex flex-row border-b dark:border-[#353836] relative">
          <div className={cc(["border-r dark:border-[#353836]"])}>
            <CardOffers
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? authenticatedUserAddress
                  : (swapOfferToAccept as PopulatedSwapOfferInterface).ask
                      .address
              }
            />
          </div>
          <div>
            <CardOffers
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? validatedAddressToSwap
                  : (swapOfferToAccept as PopulatedSwapOfferInterface).bid
                      .address
              }
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#707572] bg-[#212322] rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
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
          <div className="p-4 relative flex flex-grow border border-[#353836] rounded-lg dark:bg-[#282B29]">
            <CardOffers
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? authenticatedUserAddress
                  : (swapOfferToAccept as PopulatedSwapOfferInterface).ask
                      .address
              }
              variant={CreateTokenOfferVariant.VERTICAL}
            />
          </div>

          <div className="w-full relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border dark:border-[#353836] border-[#707572] bg-[#F6F6F6] dark:bg-[#212322] rounded-full w-9 h-9 flex items-center justify-center">
              <SwapIcon variant={SwapIconVariant.VERTICAL} />
            </div>
          </div>

          <div className="p-4 flex flex-grow border border-[#353836] rounded-lg dark:bg-[#282B29]">
            <CardOffers
              swapModalAction={swapModalAction}
              address={
                swapModalAction === SwapModalAction.CREATE_SWAP
                  ? validatedAddressToSwap
                  : (swapOfferToAccept as PopulatedSwapOfferInterface).bid
                      .address
              }
              variant={CreateTokenOfferVariant.VERTICAL}
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
  };

  return <>{CreateTokenOfferPropsConfig[variant].body}</>;
};

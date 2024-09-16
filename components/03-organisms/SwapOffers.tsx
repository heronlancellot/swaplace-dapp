/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ForWhom } from "./TokensShelf";
import {
  AddTokenOrSwapManuallyModal,
  AddTokenOrSwapManuallyModalVariant,
  SwapOfferCard,
  SwapOffersDisplayVariant,
  SwapOffersLayout,
} from "@/components/02-molecules";
import { OffersContext } from "@/lib/client/contexts/OffersContext";
import {
  TokenOfferDetails,
  SwapIcon,
  TokensOfferSkeleton,
} from "@/components/01-atoms";
import { PageData, PopulatedSwapOfferCard } from "@/lib/client/offers-utils";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { SwapNativeEther } from "@/lib/client/swap-utils";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

/**
 * The horizonalVariant from TokenOffers get the data from Ponder
 * This variant will handle the offers to the authenticatedUserAddress
 *
 * @returns
 */
export const SwapOffers = () => {
  const { hasNextPage, fetchNextPage, isFetchingNextPage, isError, data } =
    useContext(OffersContext);
  const [toggleManually, setToggleManually] = useState<boolean>(false);
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  return !authenticatedUserAddress ? (
    <SwapOffersLayout
      variant={SwapOffersDisplayVariant.NO_USER_AUTHENTICATED}
    />
  ) : !data ? (
    <div className="flex gap-5 flex-col">
      <div>
        <TokensOfferSkeleton />
      </div>
      <div>
        <TokensOfferSkeleton />
      </div>
    </div>
  ) : isError && data.every((page) => page.swapOffers.length === 0) ? (
    <SwapOffersLayout variant={SwapOffersDisplayVariant.ERROR} />
  ) : data.every((page) => page.swapOffers.length === 0) ||
    !authenticatedUserAddress ? (
    <SwapOffersLayout variant={SwapOffersDisplayVariant.NO_SWAPS_CREATED} />
  ) : (
    data && (
      <div className="flex flex-col gap-5 no-scrollbar">
        {data
          ?.flatMap((page: PageData) => page.swapOffers)
          .map((swap: PopulatedSwapOfferCard, index: number) => (
            <SwapOffer key={index} swap={swap} />
          ))}

        <div ref={ref}>
          {isFetchingNextPage && (
            <div className="flex gap-5 flex-col">
              <div>
                <TokensOfferSkeleton />
              </div>
              <div>
                <TokensOfferSkeleton />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="p-medium-bold-variant-black bg-yellowGreen border rounded-[10px] py-2 px-4 h-[38px] dark:border-blackGreen border-white"
            onClick={() => setToggleManually(!toggleManually)}
          >
            Add swap manually
          </button>
          <AddTokenOrSwapManuallyModal
            open={toggleManually}
            forWhom={ForWhom.Yours}
            onClose={() => {
              setToggleManually(false);
            }}
            variant={AddTokenOrSwapManuallyModalVariant.SWAP}
          />
        </div>
      </div>
    )
  );
};

const SwapOffer = ({ swap }: { swap: PopulatedSwapOfferCard }) => {
  const nativeEtherSwap: SwapNativeEther = {
    recipient: BigInt(swap.recipient),
    value: BigInt(swap.value),
  };

  return (
    <div className="flex flex-col no-scrollbar border border-solid border-softGray dark:border-darkGray dark:shadow-swap-station shadow-swap-station-light dark:bg-midnightGreen font-onest rounded-lg ">
      <div className="flex flex-row border-b mb-auto dark:border-darkGray relative">
        <div className="border-r dark:border-darkGray">
          <SwapOfferCard
            tokens={swap.askerTokens.tokens}
            address={swap.bidderTokens.address} // Should be inversed to display different in the UI
            nativeEther={nativeEtherSwap}
            swap={swap}
          />
        </div>
        <SwapOfferCard
          tokens={swap.bidderTokens.tokens}
          address={swap.askerTokens.address} // Should be inversed to display different in the UI
          nativeEther={nativeEtherSwap}
          swap={swap}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-translucentGray bg-offWhite dark:bg-midnightGreen rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
          <SwapIcon />
        </div>
      </div>
      <div className="flex-col">
        <TokenOfferDetails swap={swap} />
      </div>
    </div>
  );
};

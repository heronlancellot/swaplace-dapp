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
import { OffersContext } from "@/components/01-atoms/OffersContext";
import {
  TokenOfferDetails,
  SwapIcon,
  TokensOfferSkeleton,
} from "@/components/01-atoms";
import { retrieveDataFromTokensArray } from "@/lib/client/blockchain-utils";
import { PopulatedSwapOfferInterface } from "@/lib/client/offers-utils";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import cc from "classcat";
import { useContext, useEffect, useState } from "react";

/**
 * The horizonalVariant from TokenOffers get the data from Ponder
 * This variant will handle the offers to the authenticatedUserAddress
 *
 * @returns
 */
export const SwapOffers = () => {
  const {
    // hasNextPage,
    // fetchNextPage,
    // isFetchingNextPage,
    isLoadingOffersQuery,
    offersFilter,
    offersQueries,
    isError,
  } = useContext(OffersContext);
  const [isLoading, setIsLoading] = useState(true);
  const { tokensList, setTokensList } = useContext(OffersContext);
  const [toggleManually, setToggleManually] = useState<boolean>(false);
  const { authenticatedUserAddress } = useAuthenticatedUser();

  useEffect(() => {
    offersQueries && processSwaps();
  }, [offersQueries]);

  const processSwaps = async () => {
    try {
      setIsLoading(true);
      const formattedTokensPromises = offersQueries[offersFilter].map(
        async (swap) => {
          const askedTokensWithData = await retrieveDataFromTokensArray(
            swap.ask.tokens,
          );
          const bidedTokensWithData = await retrieveDataFromTokensArray(
            swap.bid.tokens,
          );
          return {
            ...swap,
            ask: { address: swap.ask.address, tokens: askedTokensWithData },
            bid: {
              address: swap.bid.address,
              tokens: bidedTokensWithData,
            },
          };
        },
      );

      // Wait for all promises to resolve
      const formattedTokens = await Promise.all(formattedTokensPromises);
      setTokensList(formattedTokens);
    } catch (error) {
      console.error("Failed to process swaps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return !authenticatedUserAddress ? (
    <SwapOffersLayout
      variant={SwapOffersDisplayVariant.NO_USER_AUTHENTICATED}
    />
  ) : isLoading || isLoadingOffersQuery ? (
    <div className="flex gap-5 flex-col">
      <div>
        <TokensOfferSkeleton />
      </div>
      <div>
        <TokensOfferSkeleton />
      </div>
    </div>
  ) : isError && tokensList.length === 0 ? (
    <SwapOffersLayout variant={SwapOffersDisplayVariant.ERROR} />
  ) : tokensList.length === 0 || !authenticatedUserAddress ? (
    <SwapOffersLayout variant={SwapOffersDisplayVariant.NO_SWAPS_CREATED} />
  ) : (
    <div className="flex flex-col gap-5 no-scrollbar">
      {tokensList.map((swap, index) => {
        return <SwapOffer key={index} swap={swap} />;
      })}
      {/* {hasNextPage && (
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        )} */}
      <div className="flex justify-end mt-5">
        <button
          className="p-medium-bold-variant-black bg-[#DDF23D] border rounded-[10px] py-2 px-4 h-[38px] dark:border-[#181a19] border-white"
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
  );
};

interface SwapOfferProps {
  swap: PopulatedSwapOfferInterface;
}

const SwapOffer = ({ swap }: SwapOfferProps) => {
  return (
    <div className="flex flex-col no-scrollbar border border-solid border-[#D6D5D5] dark:border-[#353836] dark:shadow-swap-station shadow-swap-station-light dark:bg-[#212322] font-onest rounded-lg ">
      <div className="flex flex-row border-b mb-auto dark:border-[#353836] relative">
        <div className={cc(["border-r dark:border-[#353836]"])}>
          <SwapOfferCard tokens={swap.ask.tokens} address={swap.ask.address} />
        </div>
        <SwapOfferCard tokens={swap.bid.tokens} address={swap.bid.address} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#70757230] bg-[#f6f6f6] dark:bg-[#212322] rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
          <SwapIcon />
        </div>
      </div>
      <div className="flex-col">
        <TokenOfferDetails swap={swap} />
      </div>
    </div>
  );
};

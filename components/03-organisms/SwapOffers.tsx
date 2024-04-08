/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { SwapOfferCard } from "@/components/02-molecules";
import {
  OffersContext,
  PopulatedSwapOfferInterface,
} from "@/components/01-atoms/OffersContext";
import {
  TokenOfferDetails,
  SwapIcon,
  TokensOfferSkeleton,
} from "@/components/01-atoms";
import { retrieveDataFromTokensArray } from "@/lib/client/blockchain-utils";
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
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoadingOffersQuery,
    offersFilter,
    offersQueries,
  } = useContext(OffersContext);
  const [isLoading, setIsLoading] = useState(true);

  const [tokensList, setTokensList] = useState<PopulatedSwapOfferInterface[]>(
    [],
  );

  useEffect(() => {
    offersQueries && processSwaps();
  }, [offersQueries]);

  const processSwaps = async () => {
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

    setIsLoading(false);
    setTokensList(formattedTokens);
  };

  return isLoading || isLoadingOffersQuery ? (
    <TokensOfferSkeleton />
  ) : tokensList.length === 0 ? (
    <div className="flex flex-col justify-center border border-[#353836] shadow-add-manually-card dark:bg-[#282B29] rounded-lg w-[716px] h-full">
      <div className="flex">
        <h1 className="w-full h-full text-center">
          You don&apos;t have any swaps in that category
        </h1>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-5 no-scrollbar">
      {tokensList.map((swap, index) => {
        return <SwapOffer key={index} swap={swap} />;
      })}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

interface SwapOfferProps {
  swap: PopulatedSwapOfferInterface;
}

const SwapOffer = ({ swap }: SwapOfferProps) => {
  return (
    <div className="flex flex-col no-scrollbar border border-[#353836] dark:shadow-add-manually-card dark:bg-[#282B29] rounded-lg ">
      <div className="flex flex-row border-b mb-auto dark:border-[#353836] relative">
        <div className={cc(["border-r dark:border-[#353836]"])}>
          <SwapOfferCard tokens={swap.ask.tokens} address={swap.ask.address} />
        </div>
        <SwapOfferCard tokens={swap.bid.tokens} address={swap.bid.address} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#707572] bg-[#212322] rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
          <SwapIcon />
        </div>
      </div>
      <div className="flex-col">
        <TokenOfferDetails swap={swap} />
      </div>
    </div>
  );
};

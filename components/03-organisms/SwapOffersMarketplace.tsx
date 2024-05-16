/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ForWhom } from "./TokensShelf";
import { AddTokenOrSwapManuallyModalMarketplace } from "../02-molecules/AddTokenOrSwapManuallyModalMarketplace";
import { SwapOfferCardMarketplace } from "../02-molecules/SwapOfferCardMarketplace";
import { SwapOffersLayoutMarketplace } from "../02-molecules/SwapOffersLayoutMarketplace";
import { TokenOfferDetailsMarketplace } from "../01-atoms/TokenOfferDetailsMarketplace";
import {
  AddTokenOrSwapManuallyModalVariant,
  SwapOffersDisplayVariant,
} from "@/components/02-molecules";
import {
  OffersContext,
  PonderFilter,
} from "@/lib/client/contexts/OffersContext";
import { SwapIcon, TokensOfferSkeleton } from "@/components/01-atoms";
import {
  decodeConfig,
  retrieveDataFromTokensArray,
} from "@/lib/client/blockchain-utils";
import {
  FormattedSwapOfferAssets,
  PopulatedSwapOfferCard,
} from "@/lib/client/offers-utils";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { getSwap } from "@/lib/service/getSwap";
import { OffersContextMarketplace } from "@/lib/client/contexts/OffersContextMarketplace";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import cc from "classcat";

/**
 * The horizonalVariant from TokenOffers get the data from Ponder
 * This variant will handle the offers to the authenticatedUserAddress
 *
 * @returns
 */
export const SwapOffersMarketplace = () => {
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
  const { tokensList, setTokensList } = useContext(OffersContextMarketplace);
  const [toggleManually, setToggleManually] = useState<boolean>(false);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { chain } = useNetwork();

  useEffect(() => {
    offersQueries && processSwaps();
  }, [offersQueries]);

  const findStatus = (swap: FormattedSwapOfferAssets): PonderFilter => {
    switch (swap.status.toUpperCase()) {
      case PonderFilter.ACCEPTED.toUpperCase():
        return PonderFilter.ACCEPTED;
      case PonderFilter.ALL_OFFERS.toUpperCase():
        return PonderFilter.ALL_OFFERS;
      case PonderFilter.CANCELED.toUpperCase():
        return PonderFilter.CANCELED;
      case PonderFilter.CREATED.toUpperCase():
        return PonderFilter.CREATED;
      case PonderFilter.EXPIRED.toUpperCase():
        return PonderFilter.EXPIRED;
      default:
        return PonderFilter.RECEIVED;
    }
  };

  const processSwaps = async () => {
    setIsLoading(true);

    if (!chain) return null;

    try {
      const formattedTokensPromises: Promise<PopulatedSwapOfferCard>[] =
        offersQueries[offersFilter].map(
          async (swap: FormattedSwapOfferAssets) => {
            const bidedTokensWithData = await retrieveDataFromTokensArray(
              swap.bidderAssets.tokens,
            );
            const askedTokensWithData = await retrieveDataFromTokensArray(
              swap.askerAssets.tokens,
            );
            const swapStatus = findStatus(swap);
            const swapData: any = await getSwap(BigInt(swap.id), chain.id);
            const swapExpiryData = await decodeConfig({
              config: swapData.config,
            });

            return {
              id: BigInt(swap.id),
              status: swapStatus,
              expiryDate: swapExpiryData.expiry,
              bidderTokens: {
                address: swap.bidderAssets.address,
                tokens: bidedTokensWithData,
              },
              askerTokens: {
                address: swap.askerAssets.address,
                tokens: askedTokensWithData,
              },
            };
          },
        );

      // Wait for all promises to resolve
      const formattedTokens: PopulatedSwapOfferCard[] = await Promise.all(
        formattedTokensPromises,
      );
      setTokensList(formattedTokens);
    } catch (error) {
      console.error("Failed to process swaps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return !authenticatedUserAddress ? (
    <SwapOffersLayoutMarketplace
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
    <SwapOffersLayoutMarketplace variant={SwapOffersDisplayVariant.ERROR} />
  ) : tokensList.length === 0 || !authenticatedUserAddress ? (
    <SwapOffersLayoutMarketplace
      variant={SwapOffersDisplayVariant.NO_SWAPS_CREATED}
    />
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
        <AddTokenOrSwapManuallyModalMarketplace
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
  swap: PopulatedSwapOfferCard;
}

const SwapOffer = ({ swap }: SwapOfferProps) => {
  return (
    <div className="flex flex-col no-scrollbar border border-solid border-[#D6D5D5] dark:border-[#353836] dark:shadow-swap-station shadow-swap-station-light dark:bg-[#212322] font-onest rounded-lg ">
      <div className="flex flex-row border-b mb-auto dark:border-[#353836] relative">
        <div className={cc(["border-r dark:border-[#353836]"])}>
          <SwapOfferCardMarketplace
            tokens={swap.askerTokens.tokens}
            address={swap.askerTokens.address}
          />
        </div>
        <SwapOfferCardMarketplace
          tokens={swap.bidderTokens.tokens}
          address={swap.bidderTokens.address}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#70757230] bg-[#f6f6f6] dark:bg-[#212322] rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
          <SwapIcon />
        </div>
      </div>
      <div className="flex-col">
        <TokenOfferDetailsMarketplace swap={swap} />
      </div>
    </div>
  );
};

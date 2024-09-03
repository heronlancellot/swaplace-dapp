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
import { SwapIcon, TokensOfferSkeleton } from "@/components/01-atoms";

import { PageData, PopulatedSwapOfferCard } from "@/lib/client/offers-utils";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { OffersContextMarketplace } from "@/lib/client/contexts/OffersContextMarketplace";
import { SwapNativeEther } from "@/lib/client/swap-utils";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

/**
 * The horizonalVariant from TokenOffers get the data from Ponder
 * This variant will handle the offers to the authenticatedUserAddress
 *
 * @returns
 */
export const SwapOffersMarketplace = () => {
  const {
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    // isLoadingOffersQuery,
    // offersFilter,
    // offersQueries,
    isError,
    data,
  } = useContext(OffersContextMarketplace);
  // const [isLoading, setIsLoading] = useState(true);
  // const { tokensList, setTokensList } = useContext(OffersContextMarketplace);
  const [toggleManually, setToggleManually] = useState<boolean>(false);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  // const { chain } = useNetwork();

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  console.log("data", data);
  return !authenticatedUserAddress ? (
    <SwapOffersLayoutMarketplace
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
    <SwapOffersLayoutMarketplace variant={SwapOffersDisplayVariant.ERROR} />
  ) : data.every((page) => page.swapOffers.length === 0) ||
    !authenticatedUserAddress ? (
    <SwapOffersLayoutMarketplace
      variant={SwapOffersDisplayVariant.NO_SWAPS_CREATED}
    />
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
    )
  );
};

const SwapOffer = ({ swap }: { swap: PopulatedSwapOfferCard }) => {
  const nativeEtherSwap: SwapNativeEther = {
    recipient: BigInt(swap.recipient),
    value: BigInt(swap.value),
  };
  console.log("testando!");
  return (
    <div className="flex flex-col no-scrollbar border border-solid border-[#D6D5D5] dark:border-[#353836] dark:shadow-swap-station shadow-swap-station-light dark:bg-[#212322] font-onest rounded-lg ">
      <div className="flex flex-row border-b mb-auto dark:border-[#353836] relative">
        <div className="border-r dark:border-[#353836]">
          <SwapOfferCardMarketplace
            tokens={swap.askerTokens.tokens}
            address={swap.bidderTokens.address} // Should be inversed to display different in the UI
            nativeEther={nativeEtherSwap}
          />
        </div>
        <SwapOfferCardMarketplace
          tokens={swap.bidderTokens.tokens}
          address={swap.askerTokens.address} // Should be inversed to display different in the UI
          nativeEther={nativeEtherSwap}
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

//   useEffect(() => {
//     offersQueries && processSwaps();
//   }, [offersQueries]);

//   const findStatus = (swap: FormattedSwapOfferAssets): PonderFilter => {
//     switch (swap.status.toUpperCase()) {
//       case PonderFilter.ACCEPTED.toUpperCase():
//         return PonderFilter.ACCEPTED;
//       case PonderFilter.ALL_OFFERS.toUpperCase():
//         return PonderFilter.ALL_OFFERS;
//       case PonderFilter.CANCELED.toUpperCase():
//         return PonderFilter.CANCELED;
//       case PonderFilter.CREATED.toUpperCase():
//         return PonderFilter.CREATED;
//       case PonderFilter.EXPIRED.toUpperCase():
//         return PonderFilter.EXPIRED;
//       default:
//         return PonderFilter.RECEIVED;
//     }
//   };

//   const processSwaps = async () => {
//     setIsLoading(true);

//     if (!chain) return null;

//     try {
//       const formattedTokensPromises: Promise<PopulatedSwapOfferCard>[] =
//         offersQueries[offersFilter].map(
//           async (swap: FormattedSwapOfferAssets) => {
//             const bidedTokensWithData = await retrieveDataFromTokensArray(
//               swap.bidderAssets.tokens,
//             );
//             const askedTokensWithData = await retrieveDataFromTokensArray(
//               swap.askerAssets.tokens,
//             );
//             const swapStatus = findStatus(swap);
//             const swapData: any = await getSwap(BigInt(swap.id), chain.id);
//             const swapExpiryData = await decodeConfig({
//               config: swapData.config,
//             });
//             return {
//               id: BigInt(swap.id),
//               status: swapStatus,
//               expiryDate: swapExpiryData.expiry,
//               recipient: swapExpiryData.etherRecipient,
//               value: swapExpiryData.etherValue,
//               bidderTokens: {
//                 address: swap.bidderAssets.address,
//                 tokens: bidedTokensWithData,
//               },
//               askerTokens: {
//                 address: swap.askerAssets.address,
//                 tokens: askedTokensWithData,
//               },
//             };
//           },
//         );

//       // Wait for all promises to resolve
//       const formattedTokens: PopulatedSwapOfferCard[] = await Promise.all(
//         formattedTokensPromises,
//       );
//       console.log("offersQueries", offersQueries);
//       console.log("formattedTokens", formattedTokens);
//       setTokensList(formattedTokens);
//     } catch (error) {
//       console.error("Failed to process swaps:", error);
//     } finally {
//       setIsLoading(false);
//     }
//     console.log("tokensList", tokensList);
//   };

//   return !authenticatedUserAddress ? (
//     <SwapOffersLayoutMarketplace
//       variant={SwapOffersDisplayVariant.NO_USER_AUTHENTICATED}
//     />
//   ) : isLoading || isLoadingOffersQuery ? (
//     <div className="flex gap-5 flex-col">
//       <div>
//         <TokensOfferSkeleton />
//       </div>
//       <div>
//         <TokensOfferSkeleton />
//       </div>
//     </div>
//   ) : isError && tokensList.length === 0 ? (
//     <SwapOffersLayoutMarketplace variant={SwapOffersDisplayVariant.ERROR} />
//   ) : tokensList.length === 0 || !authenticatedUserAddress ? (
//     <SwapOffersLayoutMarketplace
//       variant={SwapOffersDisplayVariant.NO_SWAPS_CREATED}
//     />
//   ) : (
//     <div className="flex flex-col gap-5 no-scrollbar">
//       {tokensList.map((swap, index) => {
//         return <SwapOffer key={index} swap={swap} />;
//       })}
//       <div className="flex justify-end mt-5">
//         <button
//           className="p-medium-bold-variant-black bg-[#DDF23D] border rounded-[10px] py-2 px-4 h-[38px] dark:border-[#181a19] border-white"
//           onClick={() => setToggleManually(!toggleManually)}
//         >
//           Add swap manually
//         </button>
//         <AddTokenOrSwapManuallyModalMarketplace
//           open={toggleManually}
//           forWhom={ForWhom.Yours}
//           onClose={() => {
//             setToggleManually(false);
//           }}
//           variant={AddTokenOrSwapManuallyModalVariant.SWAP}
//         />
//       </div>
//     </div>
//   );
// };

// const SwapOffer = ({ swap }: { swap: PopulatedSwapOfferCard }) => {
//   const nativeEtherSwap: SwapNativeEther = {
//     recipient: swap.recipient,
//     value: swap.value,
//   };
//   return (
//     <div className="flex flex-col no-scrollbar border border-solid border-[#D6D5D5] dark:border-[#353836] dark:shadow-swap-station shadow-swap-station-light dark:bg-[#212322] font-onest rounded-lg ">
//       <div className="flex flex-row border-b mb-auto dark:border-[#353836] relative">
//         <div className="border-r dark:border-[#353836]">
//           <SwapOfferCardMarketplace
//             tokens={swap.askerTokens.tokens}
//             address={swap.askerTokens.address}
//             nativeEther={nativeEtherSwap}
//           />
//         </div>
//         <SwapOfferCardMarketplace
//           tokens={swap.bidderTokens.tokens}
//           address={swap.bidderTokens.address}
//           nativeEther={nativeEtherSwap}
//         />
//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#70757230] bg-[#f6f6f6] dark:bg-[#212322] rounded-[100px] w-[24px] h-[24px] items-center flex justify-center">
//           <SwapIcon />
//         </div>
//       </div>
//       <div className="flex-col">
//         <TokenOfferDetailsMarketplace swap={swap} />
//       </div>
//     </div>
//   );
// };

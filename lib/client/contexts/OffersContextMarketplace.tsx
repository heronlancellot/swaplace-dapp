/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
//  import { ALL_OFFERS_MARKETPLACE_QUERY } from "../marketplace-queries";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
// import {
//   ACCEPTED_OFFERS_QUERY,
//   CANCELED_OFFERS_QUERY,
//   CREATED_OFFERS_QUERY,
//   EXPIRED_OFFERS_QUERY,
//   RECEIVED_OFFERS_QUERY,
// } from "@/lib/client/offer-queries";
import { EthereumAddress, Token, TokenType } from "@/lib/shared/types";
// import { cleanJsonString } from "@/lib/client/utils";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import {
  FormattedSwapOfferAssets,
  PopulatedSwapOfferCard,
  /*PageParam,*/
  /*RawSwapOfferInterface,*/
  PageInfo,
  InfiniteQueryData,
} from "@/lib/client/offers-utils";
import { SwapContext } from "@/lib/client/contexts";
import { fetchSwaps } from "@/lib/service/fetchSwaps";
import useDebounce from "@/lib/client/hooks/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Dispatch, useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { isAddress } from "viem";
import { /*useAccount,*/ useNetwork } from "wagmi";
// import toast from "react-hot-toast";

export enum PonderFilter {
  MARKETPLACE = "Marketplace",
  ALL_OFFERS = "All Offers",
  CREATED = "Created",
  RECEIVED = "Received",
  ACCEPTED = "Accepted",
  CANCELED = "Canceled",
  EXPIRED = "Expired",
}

const DEFAULT_OFFERS_DATA = {
  [PonderFilter.MARKETPLACE]: [],
  [PonderFilter.ALL_OFFERS]: [],
  [PonderFilter.CREATED]: [],
  [PonderFilter.RECEIVED]: [],
  [PonderFilter.ACCEPTED]: [],
  [PonderFilter.CANCELED]: [],
  [PonderFilter.EXPIRED]: [],
};

interface OffersContextProps {
  setOffersFilter: Dispatch<React.SetStateAction<PonderFilter>>;
  offersFilter: PonderFilter;
  offersQueries: Record<PonderFilter, Array<FormattedSwapOfferAssets>>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isLoadingOffersQuery: boolean;
  swapOfferToAccept: PopulatedSwapOfferCard | null;
  acceptSwapOffer: (swap: PopulatedSwapOfferCard) => void;
  approvedTokensCount: number;
  setApprovedTokensCount: Dispatch<React.SetStateAction<number>>;
  setTokensList: Dispatch<React.SetStateAction<PopulatedSwapOfferCard[]>>;
  tokensList: PopulatedSwapOfferCard[];
  isError: boolean;
  data:
    | {
        swapOffers: PopulatedSwapOfferCard[];
        pageInfo: PageInfo;
      }[]
    | undefined;
}

const DEFAULT_ERC20_TOKEN: Token = {
  tokenType: TokenType.ERC20,
  rawBalance: 0n,
};

const DEFAULT_SWAP_OFFER: PopulatedSwapOfferCard = {
  id: 0n,
  status: PonderFilter.MARKETPLACE,
  expiryDate: 0n,
  recipient: 0n,
  value: 0n,
  bidderTokens: {
    address: new EthereumAddress(ADDRESS_ZERO),
    tokens: [DEFAULT_ERC20_TOKEN],
  },
  askerTokens: {
    address: new EthereumAddress(ADDRESS_ZERO),
    tokens: [DEFAULT_ERC20_TOKEN],
  },
};

const DEFAULT_PAGE_INFO: PageInfo = {
  hasNextPage: false,
  endCursor: null,
};

const DEFAULT_DATA_INFINITE_QUERY: InfiniteQueryData = {
  pages: {
    swapOffers: [
      {
        id: BigInt(1),
        status: PonderFilter.MARKETPLACE,
        expiryDate: 0n,
        recipient: 0n,
        value: 0n,
        bidderTokens: {
          address: new EthereumAddress(ADDRESS_ZERO),
          tokens: [DEFAULT_ERC20_TOKEN],
        },
        askerTokens: {
          address: new EthereumAddress(ADDRESS_ZERO),
          tokens: [DEFAULT_ERC20_TOKEN],
        },
      },
    ],
    pageInfo: DEFAULT_PAGE_INFO,
  },
};

// Copy of OffersContext.tsx
export const OffersContextMarketplaceProvider = ({ children }: any) => {
  // States and constants
  const [swapOfferToAccept, setSwapOfferToBeAccepted] =
    useState<PopulatedSwapOfferCard | null>(null);
  const [approvedTokensCount, setApprovedTokensCount] = useState(0);

  const [offersQueries, setOffersQueries] =
    useState<Record<PonderFilter, Array<FormattedSwapOfferAssets>>>(
      DEFAULT_OFFERS_DATA,
    );

  const [offersFilter, setOffersFilter] = useState<PonderFilter>(
    PonderFilter.MARKETPLACE,
  );

  const debouncedOffersFilter: PonderFilter = useDebounce(offersFilter, 300);

  const [tokensList, setTokensList] = useState<PopulatedSwapOfferCard[]>([
    DEFAULT_SWAP_OFFER,
  ]);

  const [isLoadingOffersQuery, setIsLoadingOffersQuery] = useState(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();
  // const { address, isConnected } = useAccount();

  const { destinyChain } = useContext(SwapContext);
  const { chain } = useNetwork();

  const userAddress = authenticatedUserAddress?.address;
  let chainId: number;

  if (typeof chain?.id !== "undefined") {
    chainId = chain?.id;
  }

  // const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  // Functions
  const acceptSwapOffer = async (swap: PopulatedSwapOfferCard) => {
    setSwapOfferToBeAccepted(swap);
  };

  // Offers query
  const { data, status, isFetchingNextPage, fetchNextPage, isError, refetch } =
    useInfiniteQuery({
      queryKey: [
        "MarketplaceQuerySwaps",
        authenticatedUserAddress,
        debouncedOffersFilter,
        destinyChain,
      ],
      queryFn: async ({ pageParam }: { pageParam: string | null }) =>
        await fetchSwaps({
          pageParam: pageParam,
          userAddress: userAddress,
          offersFilter: debouncedOffersFilter,
          chainId: chainId,
        }),
      initialPageParam: null,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
      enabled: !!authenticatedUserAddress,
      select: (data) => {
        return data.pages.map((page) => ({
          swapOffers: page.swapOffers.map((swap) => {
            return {
              id: BigInt(swap.id),
              status: debouncedOffersFilter,
              expiryDate: swap.expiryDate,
              recipient: swap.recipient,
              value: swap.value,
              bidderTokens: {
                address: swap.bidderTokens.address,
                tokens: swap.bidderTokens.tokens,
              },
              askerTokens: {
                address: swap.askerTokens.address,
                tokens: swap.askerTokens.tokens,
              },
            };
          }),
          pageInfo: page.pageInfo,
        }));
      },
    });

  useEffect(() => {
    refetch();
  }, [debouncedOffersFilter, refetch]);

  console.log("testando!");
  console.log("testando!!!");

  const [hasNextPage, setHasNextPage] = useState(false);

  console.log("dataContext", data);
  useEffect(() => {
    if (data) {
      setHasNextPage(data[data.length - 1].pageInfo.hasNextPage);
    }
  }, [data]);

  useEffect(() => {
    !!authenticatedUserAddress &&
      setIsLoadingOffersQuery(status === "pending" || isFetchingNextPage);
  }, [isFetchingNextPage, status]);

  // const fetchSwaps = async ({ pageParam }: PageParam) => {
  //   const after = pageParam || null;
  //   let query = "";
  //   let variables = {};
  //   let chainId: number | undefined = undefined;

  //   if (typeof chain?.id != "undefined") {
  //     chainId = chain?.id;
  //   }

  //   switch (offersFilter) {
  //     case PonderFilter.ALL_OFFERS:
  //       query = ALL_OFFERS_MARKETPLACE_QUERY;
  //       variables = {
  //         orderBy: "blockTimestamp",
  //         orderDirection: "desc",
  //         after: after,
  //         allowed: "0x00", // For some reason the Ponder retrieves that Data instead of ADDRESS_ZERO
  //         expiry_gte: currentUnixTimeSeconds,
  //         network: chainId,
  //       };
  //       break;
  //     case PonderFilter.CREATED:
  //       query = CREATED_OFFERS_QUERY;
  //       variables = {
  //         orderBy: "blockTimestamp",
  //         orderDirection: "desc",
  //         inputAddress: userAddress,
  //         after: after,
  //         expiry_gt: currentUnixTimeSeconds,
  //         network: chainId,
  //       };
  //       break;
  //     case PonderFilter.RECEIVED:
  //       query = RECEIVED_OFFERS_QUERY;
  //       variables = {
  //         orderBy: "blockTimestamp",
  //         orderDirection: "desc",
  //         after: after,
  //         allowed: userAddress,
  //         expiry_gt: currentUnixTimeSeconds,
  //         network: chainId,
  //       };
  //       break;
  //     case PonderFilter.ACCEPTED:
  //       query = ACCEPTED_OFFERS_QUERY;
  //       variables = {
  //         orderBy: "blockTimestamp",
  //         orderDirection: "desc",
  //         inputAddress: userAddress,
  //         after: after,
  //         allowed: userAddress,
  //         network: chainId,
  //       };
  //       break;
  //     case PonderFilter.CANCELED:
  //       query = CANCELED_OFFERS_QUERY;
  //       variables = {
  //         orderBy: "blockTimestamp",
  //         orderDirection: "desc",
  //         inputAddress: userAddress,
  //         after: after,
  //         allowed: userAddress,
  //         network: chainId,
  //       };
  //       break;
  //     case PonderFilter.EXPIRED:
  //       query = EXPIRED_OFFERS_QUERY;
  //       variables = {
  //         orderBy: "blockTimestamp",
  //         orderDirection: "desc",
  //         inputAddress: userAddress,
  //         expiry_lt: currentUnixTimeSeconds,
  //         after: after,
  //         network: chainId,
  //       };
  //       break;
  //     default:
  //       console.error("Invalid offersFilter:", offersFilter);
  //       throw new Error("Invalid offersFilter");
  //   }

  //   const endpoint = process.env.NEXT_PUBLIC_PONDER_ENDPOINT;
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };

  //   if (!endpoint) {
  //     throw new Error(
  //       "NEXT_PUBLIC_PONDER_ENDPOINT is not defined in the environment variables.",
  //     );
  //   }

  //   try {
  //     const response = await axios.post(
  //       endpoint,
  //       { query, variables },
  //       { headers },
  //     );
  //     console.log("passou do axios");
  //     console.log("response", response);
  //     if (response.data && response.data.data) {
  //       const items = response.data.data.swapDatabases
  //         .items as RawSwapOfferInterface[];
  //       const pageInfo = response.data.data.swapDatabases.pageInfo as PageInfo;
  //       const processedItems: RawSwapOfferInterface[] = items.map(
  //         (obj: any) => {
  //           return {
  //             ...obj,
  //             bid: cleanJsonString(obj.bid),
  //             ask: cleanJsonString(obj.ask),
  //           };
  //         },
  //       );
  //       const itemsArrayAsSwapOffers: FormattedSwapOfferAssets[] =
  //         processedItems.map((item) => {
  //           return {
  //             id: item.swapId,
  //             status: item.status,
  //             expiryDate: item.expiry,
  //             recipient: item.recipient,
  //             value: item.recipient,
  //             bidderAssets: {
  //               address: isAddress(item.allowed)
  //                 ? new EthereumAddress(item.allowed)
  //                 : new EthereumAddress(ADDRESS_ZERO),
  //               tokens: item.bid,
  //             },
  //             askerAssets: {
  //               address: new EthereumAddress(item.owner),
  //               tokens: item.ask,
  //             },
  //           };
  //         });
  //       setOffersQueries({
  //         ...offersQueries,
  //         [offersFilter]: itemsArrayAsSwapOffers,
  //       });
  //       return {
  //         swapOffers: itemsArrayAsSwapOffers,
  //         pageInfo,
  //       };
  //     } else {
  //       console.error("Unexpected response structure:", response.data);
  //       throw new Error("Unexpected response structure");
  //     }
  //   } catch (error) {
  //     toast.error(
  //       "Failed to fetch swaps from Subgraph. Please contact the team",
  //     );
  //     throw new Error("Failed to fetch swaps from Subgraph");
  //   }
  // };

  // Offers query
  // const { data, status, isFetchingNextPage, fetchNextPage, isError, refetch } =
  //   useInfiniteQuery({
  //     queryKey: [
  //       "PonderQuerySwaps",
  //       authenticatedUserAddress,
  //       offersFilter,
  //       destinyChain,
  //     ],
  //     queryFn: async ({ pageParam }: { pageParam: string | null }) =>
  //       await fetchSwaps({ pageParam }),
  //     initialPageParam: null,
  //     refetchOnWindowFocus: false,
  //     staleTime: Infinity,
  //     getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
  //     enabled: !!authenticatedUserAddress,
  //   });

  // useEffect(() => {
  //   refetch();
  // }, [offersFilter, refetch]);

  // const [hasNextPage, setHasNextPage] = useState(false);

  // useEffect(() => {
  //   if (data) {
  //     setHasNextPage(data.pages[data.pages.length - 1].pageInfo.hasNextPage);
  //   }
  // }, [data]);
  // console.log("data:", data);

  // // Effects
  // useEffect(() => {
  //   !!authenticatedUserAddress &&
  //     setIsLoadingOffersQuery(status === "pending" || isFetchingNextPage);
  // }, [isFetchingNextPage, status]);

  useEffect(() => {
    setOffersData({
      setOffersFilter,
      offersFilter,
      offersQueries,
      fetchNextPage,
      isFetchingNextPage,
      isLoadingOffersQuery,
      acceptSwapOffer,
      swapOfferToAccept,
      hasNextPage,
      approvedTokensCount,
      setApprovedTokensCount,
      setTokensList,
      tokensList,
      isError,
      data,
    });
  }, [
    setOffersFilter,
    offersFilter,
    offersQueries,
    fetchNextPage,
    isFetchingNextPage,
    isLoadingOffersQuery,
    swapOfferToAccept,
    hasNextPage,
    approvedTokensCount,
    setApprovedTokensCount,
    tokensList,
  ]);

  // Exportable data
  const [offersData, setOffersData] = useState<OffersContextProps>({
    setOffersFilter,
    offersFilter,
    offersQueries,
    fetchNextPage,
    isFetchingNextPage,
    isLoadingOffersQuery,
    acceptSwapOffer,
    swapOfferToAccept,
    hasNextPage,
    approvedTokensCount,
    setApprovedTokensCount,
    setTokensList,
    tokensList,
    isError,
    data,
  });

  return (
    <OffersContextMarketplace.Provider value={offersData}>
      {children}
    </OffersContextMarketplace.Provider>
  );
};

export const OffersContextMarketplace = React.createContext<OffersContextProps>(
  {
    setOffersFilter: () => {},
    offersFilter: PonderFilter.MARKETPLACE,
    offersQueries: DEFAULT_OFFERS_DATA,
    fetchNextPage: () => {},
    isFetchingNextPage: false,
    hasNextPage: false,
    isLoadingOffersQuery: false,
    acceptSwapOffer: () => {},
    swapOfferToAccept: null,
    approvedTokensCount: 0,
    setApprovedTokensCount: () => {},
    setTokensList: () => {},
    tokensList: [DEFAULT_SWAP_OFFER],
    isError: false,
    data: [DEFAULT_DATA_INFINITE_QUERY.pages],
  },
);

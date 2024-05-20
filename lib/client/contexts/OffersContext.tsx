/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { retrieveDataFromTokensArray, decodeConfig } from "../blockchain-utils";
import { Swap } from "../swap-utils";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  ACCEPTED_OFFERS_QUERY,
  ALL_OFFERS_QUERY,
  CANCELED_OFFERS_QUERY,
  CREATED_OFFERS_QUERY,
  EXPIRED_OFFERS_QUERY,
  RECEIVED_OFFERS_QUERY,
} from "@/lib/client/offer-queries";
import { EthereumAddress, Token, TokenType } from "@/lib/shared/types";
import { cleanJsonString } from "@/lib/client/utils";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import {
  FormattedSwapOfferAssets,
  PopulatedSwapOfferCard,
  PageParam,
  RawSwapOfferInterface,
  PageInfo,
  InifniteQueryData,
} from "@/lib/client/offers-utils";
import { SwapContext } from "@/lib/client/contexts";
import { getSwap } from "@/lib/service/getSwap";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Dispatch, useEffect, useState, useContext } from "react";
import axios from "axios";
import { isAddress } from "viem";
import { useAccount, useNetwork } from "wagmi";
import toast from "react-hot-toast";

export enum PonderFilter {
  ALL_OFFERS = "All Offers",
  CREATED = "Created",
  RECEIVED = "Received",
  ACCEPTED = "Accepted",
  CANCELED = "Canceled",
  EXPIRED = "Expired",
}

const DEFAULT_OFFERS_DATA = {
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

const DEFAULT_ERC20_TOKEN: Readonly<Token> = {
  tokenType: TokenType.ERC20,
  rawBalance: 0n,
};

const DEFAULT_SWAP_OFFER: Readonly<PopulatedSwapOfferCard> = {
  id: 0n,
  status: PonderFilter.ALL_OFFERS,
  expiryDate: 0n,
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

const DEFAULT_DATA_INFINITE_QUERY: InifniteQueryData = {
  pages: {
    swapOffers: [
      {
        id: BigInt(1),
        status: PonderFilter.ALL_OFFERS, // Replace with actual PonderFilter instance
        expiryDate: 0n,
        bidderTokens: {
          address: new EthereumAddress(ADDRESS_ZERO), // Replace with actual EthereumAddress instance
          tokens: [DEFAULT_ERC20_TOKEN], // Replace with actual Token instances
        },
        askerTokens: {
          address: new EthereumAddress(ADDRESS_ZERO), // Replace with actual EthereumAddress instance
          tokens: [DEFAULT_ERC20_TOKEN], // Replace with actual Token instances
        },
      },
    ],
    pageInfo: DEFAULT_PAGE_INFO, // Replace with actual PageInfo instance
  },
};

// const DEFAULT_DATA_INFINITE_QUERY: InifniteQueryData = {
//   pages:
//     [
//       {
//         swapOffers: [DEFAULT_SWAP_OFFER],
//         pageInfo: DEFAULT_PAGE_INFO,
//       },
//     ] | undefined,
// };
export const OffersContextProvider = ({ children }: any) => {
  // States and constants
  const [swapOfferToAccept, setSwapOfferToBeAccepted] =
    useState<PopulatedSwapOfferCard | null>(null);
  const [approvedTokensCount, setApprovedTokensCount] = useState(0);

  const [offersQueries, setOffersQueries] =
    useState<Record<PonderFilter, Array<FormattedSwapOfferAssets>>>(
      DEFAULT_OFFERS_DATA,
    );

  const [offersFilter, setOffersFilter] = useState<PonderFilter>(
    PonderFilter.ALL_OFFERS,
  );
  const [tokensList, setTokensList] = useState<PopulatedSwapOfferCard[]>([
    DEFAULT_SWAP_OFFER,
  ]);

  const [isLoadingOffersQuery, setIsLoadingOffersQuery] = useState(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { address, isConnected } = useAccount();

  const { destinyChain } = useContext(SwapContext);
  const { chain } = useNetwork();

  const userAddress = authenticatedUserAddress?.address;

  const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  // Functions
  const acceptSwapOffer = async (swap: PopulatedSwapOfferCard) => {
    setSwapOfferToBeAccepted(swap);
  };

  const fetchSwaps = async ({
    pageParam,
  }: PageParam): Promise<{
    swapOffers: PopulatedSwapOfferCard[];
    pageInfo: PageInfo;
  }> => {
    if (!userAddress) {
      throw new Error("User address is not defined");
    }
    const after = pageParam || null;
    let query = "";
    let variables = {};
    let chainId: number | undefined = undefined;

    if (typeof chain?.id !== "undefined") {
      chainId = chain?.id;
    }

    switch (offersFilter) {
      case PonderFilter.ALL_OFFERS:
        query = ALL_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          after: after,
          allowed: userAddress,
          network: chainId,
        };
        break;
      case PonderFilter.CREATED:
        query = CREATED_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          after: after,
          expiry_gt: currentUnixTimeSeconds,
          network: chainId,
        };
        break;
      case PonderFilter.RECEIVED:
        query = RECEIVED_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          after: after,
          allowed: userAddress,
          expiry_gt: currentUnixTimeSeconds,
          network: chainId,
        };
        break;
      case PonderFilter.ACCEPTED:
        query = ACCEPTED_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          after: after,
          allowed: userAddress,
          network: chainId,
        };
        break;
      case PonderFilter.CANCELED:
        query = CANCELED_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          after: after,
          allowed: userAddress,
          network: chainId,
        };
        break;
      case PonderFilter.EXPIRED:
        query = EXPIRED_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          expiry_lt: currentUnixTimeSeconds,
          after: after,
          network: chainId,
        };
        break;
      default:
        console.error("Invalid offersFilter:", offersFilter);
        throw new Error("Invalid offersFilter");
    }

    const endpoint = process.env.NEXT_PUBLIC_PONDER_ENDPOINT;
    const headers = {
      "Content-Type": "application/json",
    };

    if (!endpoint) {
      throw new Error(
        "NEXT_PUBLIC_PONDER_ENDPOINT is not defined in the environment variables.",
      );
    }

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

    try {
      const response = await axios.post(
        endpoint,
        { query, variables },
        { headers },
      );
      if (response.data && response.data.data) {
        const items = response.data.data.swapDatabases
          .items as RawSwapOfferInterface[];
        const pageInfo = response.data.data.swapDatabases.pageInfo as PageInfo;
        const processedItems: RawSwapOfferInterface[] = items.map(
          (obj: any) => {
            return {
              ...obj,
              bid: cleanJsonString(obj.bid),
              ask: cleanJsonString(obj.ask),
            };
          },
        );
        const itemsArrayAsSwapOffers: FormattedSwapOfferAssets[] =
          processedItems.map((item) => {
            return {
              id: item.swapId,
              status: item.status,
              expiryDate: item.expiry,
              bidderAssets: {
                address: isAddress(item.allowed)
                  ? new EthereumAddress(item.allowed)
                  : new EthereumAddress(ADDRESS_ZERO),
                tokens: item.bid,
              },
              askerAssets: {
                address: new EthereumAddress(item.owner),
                tokens: item.ask,
              },
            };
          });
        const itemsArrayAsSwapOffersPopulated: Promise<PopulatedSwapOfferCard>[] =
          itemsArrayAsSwapOffers.map(async (swap) => {
            const bidedTokensWithData = await retrieveDataFromTokensArray(
              swap.bidderAssets.tokens,
            );
            const askedTokensWithData = await retrieveDataFromTokensArray(
              swap.askerAssets.tokens,
            );
            const swapStatus = findStatus(swap);
            const swapData: Swap = await getSwap(
              BigInt(swap.id),
              chainId as number,
            );
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
          });

        const formattedTokens: PopulatedSwapOfferCard[] = await Promise.all(
          itemsArrayAsSwapOffersPopulated,
        );
        setOffersQueries({
          ...offersQueries,
          [offersFilter]: formattedTokens,
        });
        return {
          swapOffers: formattedTokens,
          pageInfo,
        };
      } else {
        throw new Error("Failed to fetch swaps from Subgraph");
      }
    } catch (error) {
      toast.error(
        "Failed to fetch swaps from Subgraph. Please contact the team",
      );
      throw new Error("Failed to fetch swaps from Subgraph");
    }
  };

  // Offers query
  const { data, status, isFetchingNextPage, fetchNextPage, isError, refetch } =
    useInfiniteQuery({
      queryKey: [
        "PonderQuerySwaps",
        authenticatedUserAddress,
        offersFilter,
        destinyChain,
      ],
      queryFn: async ({ pageParam }: { pageParam: string | null }) =>
        await fetchSwaps({ pageParam }),
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
              status: offersFilter,
              expiryDate: swap.expiryDate,
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

  console.log("data,", data);

  useEffect(() => {
    refetch();
  }, [offersFilter, refetch]);

  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (data) {
      setHasNextPage(data[data.length - 1].pageInfo.hasNextPage);
    }
  }, [data]);

  // Effects
  useEffect(() => {
    !!authenticatedUserAddress &&
      setIsLoadingOffersQuery(status === "pending" || isFetchingNextPage);
  }, [isFetchingNextPage, status]);

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
    <OffersContext.Provider value={offersData}>
      {children}
    </OffersContext.Provider>
  );
};

export const OffersContext = React.createContext<OffersContextProps>({
  setOffersFilter: () => {},
  offersFilter: PonderFilter.ALL_OFFERS,
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
});

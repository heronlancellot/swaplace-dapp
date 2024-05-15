/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { SwapContext } from "./SwapContext";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { ALL_OFFERS_MARKETPLACE_QUERY } from "@/lib/client/marketplace-queries";
import { EthereumAddress, type Token, TokenType } from "@/lib/shared/types";
import { cleanJsonString } from "@/lib/client/utils";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import axios from "axios";
import { isAddress } from "viem";
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import type {
  FormattedSwapOfferAssets,
  PopulatedSwapOfferCard,
  PageParam,
  RawSwapOfferInterface,
  PageInfo,
} from "@/lib/client/offers-utils";

// TO DO: Move those static functions to utils
enum PonderFilter {
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

interface MarketplaceContextProps {
  setOffersFilterMarketplace: Dispatch<React.SetStateAction<PonderFilter>>;
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
}

const DEFAULT_ERC20_TOKEN: Token = {
  tokenType: TokenType.ERC20,
  rawBalance: 0n,
};

const DEFAULT_SWAP_OFFER: PopulatedSwapOfferCard = {
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

export const MarketplaceContextProvider = ({ children }: any) => {
  // States and constants
  const [swapOfferToAccept, setSwapOfferToBeAccepted] =
    useState<PopulatedSwapOfferCard | null>(null);
  const [approvedTokensCount, setApprovedTokensCount] = useState(0);

  const [offersQueries, setOffersQueries] =
    useState<Record<PonderFilter, Array<FormattedSwapOfferAssets>>>(
      DEFAULT_OFFERS_DATA,
    );

  const [offersFilter, setOffersFilterMarketplace] = useState<PonderFilter>(
    PonderFilter.ALL_OFFERS,
  );
  const [tokensList, setTokensList] = useState<PopulatedSwapOfferCard[]>([
    DEFAULT_SWAP_OFFER,
  ]);

  const [isLoadingOffersQuery, setIsLoadingOffersQuery] = useState(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { destinyChain } = useContext(SwapContext);
  const { chain } = useNetwork();

  const userAddress = authenticatedUserAddress?.address;

  const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  // Functions
  const acceptSwapOffer = async (swap: PopulatedSwapOfferCard) => {
    setSwapOfferToBeAccepted(swap);
  };

  const fetchSwaps = async ({ pageParam }: PageParam) => {
    const after = pageParam || null;
    let query = "";
    let variables = {};
    let chainId: number | undefined = undefined;

    if (typeof chain?.id != "undefined") {
      chainId = chain?.id;
    }

    switch (offersFilter) {
      case PonderFilter.ALL_OFFERS:
        query = ALL_OFFERS_MARKETPLACE_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          after: after,
          allowed: "0x00", // For some reason the Ponder retrieves that Data instead of ADDRESS_ZERO
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
        setOffersQueries({
          ...offersQueries,
          [offersFilter]: itemsArrayAsSwapOffers,
        });
        return {
          swapOffers: itemsArrayAsSwapOffers,
          pageInfo,
        };
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error(error);
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
    });

  useEffect(() => {
    refetch();
  }, [offersFilter, refetch]);

  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (data) {
      setHasNextPage(data.pages[data.pages.length - 1].pageInfo.hasNextPage);
    }
  }, [data]);

  // Effects
  useEffect(() => {
    !!authenticatedUserAddress &&
      setIsLoadingOffersQuery(status === "pending" || isFetchingNextPage);
  }, [isFetchingNextPage, status]);

  useEffect(() => {
    setOffersData({
      setOffersFilterMarketplace,
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
    });
  }, [
    setOffersFilterMarketplace,
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
  const [offersData, setOffersData] = useState<MarketplaceContextProps>({
    setOffersFilterMarketplace,
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
  });

  return (
    <MarketplaceContext.Provider value={offersData}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const MarketplaceContext = React.createContext<MarketplaceContextProps>({
  setOffersFilterMarketplace: () => {},
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
});

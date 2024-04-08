/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  ACCEPTED_OFFERS_QUERY,
  ALL_OFFERS_QUERY,
  CANCELED_OFFERS_QUERY,
  CREATED_OFFERS_QUERY,
  EXPIRED_OFFERS_QUERY,
  RECEIVED_OFFERS_QUERY,
} from "@/lib/client/offer-queries";
import { Asset } from "@/lib/client/swap-utils";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { cleanJsonString } from "@/lib/client/utils";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Dispatch, useEffect, useState } from "react";
import axios from "axios";
import { isAddress } from "viem";

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
  offersQueries: Record<PonderFilter, Array<FormattedSwapOfferInterface>>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isLoadingOffersQuery: boolean;
  swapOfferToAccept: PopulatedSwapOfferInterface | null;
  acceptSwapOffer: (swap: PopulatedSwapOfferInterface) => void;
  approvedTokensCount: number;
  setApprovedTokensCount: Dispatch<React.SetStateAction<number>>;
}

export const OffersContextProvider = ({ children }: any) => {
  // States and constants
  const [swapOfferToAccept, setSwapOfferToBeAccepted] =
    useState<PopulatedSwapOfferInterface | null>(null);
  const [approvedTokensCount, setApprovedTokensCount] = useState(0);

  const [offersQueries, setOffersQueries] =
    useState<Record<PonderFilter, Array<FormattedSwapOfferInterface>>>(
      DEFAULT_OFFERS_DATA,
    );

  const [offersFilter, setOffersFilter] = useState<PonderFilter>(
    PonderFilter.ALL_OFFERS,
  );

  const [isLoadingOffersQuery, setIsLoadingOffersQuery] = useState(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();

  const userAddress = authenticatedUserAddress?.address;

  const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  // Functions
  const acceptSwapOffer = async (swap: PopulatedSwapOfferInterface) => {
    setSwapOfferToBeAccepted(swap);
  };

  const fetchSwaps = async ({ pageParam }: PageParam) => {
    const after = pageParam || null;
    let query = "";
    let variables = {};

    switch (offersFilter) {
      case PonderFilter.ALL_OFFERS:
        query = ALL_OFFERS_QUERY;
        variables = {
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          inputAddress: userAddress,
          after: after,
          allowed: userAddress,
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
        const items = response.data.data.databases
          .items as RawSwapOfferInterface[];
        const pageInfo = response.data.data.databases.pageInfo as PageInfo;

        const processedItems: RawSwapOfferInterface[] = items.map(
          (obj: any) => {
            return {
              ...obj,
              bid: cleanJsonString(obj.bid),
              ask: cleanJsonString(obj.ask),
            };
          },
        );

        const itemsArrayAsSwapOffers: FormattedSwapOfferInterface[] =
          processedItems.map((item) => {
            return {
              id: item.swapId,
              status: item.status,
              expiryDate: item.expiry,
              bid: {
                address: isAddress(item.allowed)
                  ? new EthereumAddress(item.allowed)
                  : new EthereumAddress(ADDRESS_ZERO),
                tokens: item.bid,
              },
              ask: {
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
      console.error("Error fetching swaps:", error);
      throw error;
    }
  };

  // Offers query
  const { data, status, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["PonderQuerySwaps", authenticatedUserAddress, offersFilter],
    queryFn: async ({ pageParam }: { pageParam: string | null }) =>
      await fetchSwaps({ pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
  });

  const [hasNextPage, setHasNextPage] = useState(false);
  useEffect(() => {
    if (data) {
      setHasNextPage(data.pages[data.pages.length - 1].pageInfo.hasNextPage);
    }
  }, [data]);

  // Effects
  useEffect(() => {
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
});

// Interfaces
interface RawSwapOfferInterface {
  // RawSwapOfferInterface represents the object interface of a Swap Offer coming from Ponder
  swapId: string;
  status: string;
  owner: string;
  allowed: string;
  expiry: bigint;
  bid: Asset[];
  ask: Asset[];
}
export interface FormattedSwapOfferInterface {
  id: string;
  status: string;
  expiryDate: bigint;
  bid: {
    address: EthereumAddress;
    tokens: Asset[];
  };
  ask: {
    address: EthereumAddress;
    tokens: Asset[];
  };
}

export interface PopulatedSwapOfferInterface {
  id: string;
  status: string;
  expiryDate: bigint;
  bid: {
    address: EthereumAddress;
    tokens: Token[];
  };
  ask: {
    address: EthereumAddress;
    tokens: Token[];
  };
}

interface PageInfo {
  // PageInfo is used by useInfiniteQuery for pagination
  hasNextPage: boolean;
  endCursor: string | null;
}

interface PageParam {
  pageParam: string | null;
}

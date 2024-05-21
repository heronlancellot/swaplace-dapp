/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress, Token, TokenType } from "@/lib/shared/types";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import {
  FormattedSwapOfferAssets,
  PopulatedSwapOfferCard,
  PageInfo,
  InfiniteQueryData,
} from "@/lib/client/offers-utils";
import { SwapContext } from "@/lib/client/contexts";
import { fetchSwaps } from "@/lib/service/fetchSwaps";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Dispatch, useEffect, useState, useContext } from "react";
import { useNetwork } from "wagmi";

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

const DEFAULT_DATA_INFINITE_QUERY: InfiniteQueryData = {
  pages: {
    swapOffers: [
      {
        id: BigInt(1),
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
      },
    ],
    pageInfo: DEFAULT_PAGE_INFO,
  },
};

export const OffersContextProvider = ({ children }: any) => {
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
  const { destinyChain } = useContext(SwapContext);
  const { chain } = useNetwork();

  const userAddress = authenticatedUserAddress?.address;
  let chainId: number;

  if (typeof chain?.id !== "undefined") {
    chainId = chain?.id;
  }

  // Functions
  const acceptSwapOffer = async (swap: PopulatedSwapOfferCard) => {
    setSwapOfferToBeAccepted(swap);
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
        await fetchSwaps({
          pageParam: pageParam,
          userAddress: userAddress,
          offersFilter: offersFilter,
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

/* eslint-disable @typescript-eslint/no-empty-function */
import { SwapContext } from "./SwapContext";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { RawLeaderboardDataInterface } from "../ponder-utils";
import { PageInfo } from "../offers-utils";
import { ADDRESS_ZERO } from "../constants";
import { fetchLeaderboard } from "@/lib/service/fetchLeaderboard";
import { createContext, useContext, useEffect, useState } from "react";
import { useInfiniteQuery, useNetwork } from "wagmi";

interface LeaderboardContextProps {
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  // hasNextPage: boolean;
  // isLoadingOffersQuery: boolean;
  // isError: boolean;
  data:
    | {
        profileData: RawLeaderboardDataInterface[];
        pageInfo: PageInfo;
      }[]
    | undefined;
}

export interface InfiniteQueryData {
  pages: {
    profileData: RawLeaderboardDataInterface[];
    pageInfo: PageInfo;
  };
}

const DEFAULT_PAGE_INFO: PageInfo = {
  hasNextPage: false,
  endCursor: null,
};

const DEFAULT_PROFILE_DATA: RawLeaderboardDataInterface[] = [
  {
    id: ADDRESS_ZERO,
    totalScore: BigInt(1),
  },
];

const DEFAULT_DATA_INFINITE_QUERY: InfiniteQueryData = {
  pages: {
    profileData: DEFAULT_PROFILE_DATA,
    pageInfo: DEFAULT_PAGE_INFO,
  },
};

export const LeaderboardContextProvider = ({ children }: any) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { destinyChain } = useContext(SwapContext);

  const userAddress = authenticatedUserAddress?.address;
  const { chain } = useNetwork();

  let chainId: number;

  if (typeof chain?.id !== "undefined") {
    chainId = chain?.id;
  }

  // Leaderboard query
  const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      "PonderQueryLeaderboard",
      authenticatedUserAddress,
      destinyChain,
    ],
    queryFn: async ({ pageParam }: { pageParam: string | null }) =>
      await fetchLeaderboard({
        pageParam: pageParam,
        userAddress: userAddress,
        chainId: chainId,
      }),
    initialPageParam: null,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
    enabled: !!authenticatedUserAddress,
  });

  useEffect(() => {
    setLeaderboardData({
      fetchNextPage,
      isFetchingNextPage,
      data,
    });
  }, [data]);

  // Exportable data
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardContextProps>({
      fetchNextPage,
      isFetchingNextPage,
      data,
    });
  return (
    <LeaderboardContext.Provider value={leaderboardData}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const LeaderboardContext = createContext<LeaderboardContextProps>({
  fetchNextPage: () => {},
  isFetchingNextPage: false,
  data: [DEFAULT_DATA_INFINITE_QUERY.pages],
});

/* eslint-disable @typescript-eslint/no-empty-function */
import { SwapContext } from "./SwapContext";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { RawLeaderboardDataInterface } from "../ponder-utils";
import { PageInfo } from "../offers-utils";
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

// {
//           "totalScore": "130",
//           "id": "0x00000000000d86e4837ba41dacde4b8713d5ccac",
//         },

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
    select: (data) => {
      return data.pages.map((page) => ({
        leaderboard: page.leaderboard.map(
          (leaderboardInitialData: RawLeaderboardDataInterface) => {
            return {
              ...leaderboardInitialData,
            };
          },
        ),
        pageInfo: page.pageInfo,
      }));
    },
  });

  useEffect(() => {
    setLeaderboardData({
      fetchNextPage,
      isFetchingNextPage,
      data,
    });
  }, []);

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
  data,
});

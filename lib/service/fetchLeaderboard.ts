import { PageInfo } from "../client/offers-utils";
import { RawLeaderboardDataInterface } from "../client/leaderboard-utils";
import {
  LEADERBOARD_QUERY,
  USER_RANKING_QUERY,
} from "../client/leaderboard-queries";
import axios from "axios";

export interface LeaderboardDataResponse {
  profileData: RawLeaderboardDataInterface[];
  pageInfo: PageInfo;
  userRank?: number;
}

export const fetchLeaderboard = async ({
  pageParam,
  chainId,
  userAddress,
}: {
  pageParam: string | null;
  userAddress: `0x${string}` | undefined;
  chainId: number;
}): Promise<LeaderboardDataResponse> => {
  const after = pageParam || null;
  const leaderboardQuery = LEADERBOARD_QUERY;
  const variables = {
    orderDirection: "desc",
    after: after,
    network: chainId,
  };

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
    const leaderboardResponse = await axios.post(
      endpoint,
      { query: leaderboardQuery, variables },
      { headers },
    );

    let userRank;
    if (userAddress) {
      const userRankingResponse = await axios.post(
        endpoint,
        {
          query: USER_RANKING_QUERY,
          variables: { network: chainId, inputAddress: userAddress },
        },
        { headers },
      );

      if (userRankingResponse.data && userRankingResponse.data.data) {
        const userScore =
          userRankingResponse.data.data.profileDatabases.items[0]?.totalScore;
        const rankingEndpoint = process.env.NEXT_PUBLIC_EXPRESS_ENDPOINT;
        const rankingResponse = await axios.get(
          `${rankingEndpoint}?score=${userScore}`,
        );
        userRank = rankingResponse.data.total_count;
        console.log(`Current rank position of the user: ${userRank}`);
      }
    }

    if (leaderboardResponse.data && leaderboardResponse.data.data) {
      const items = leaderboardResponse.data.data.profileDatabases
        .items as RawLeaderboardDataInterface[];
      const pageInfo = leaderboardResponse.data.data.profileDatabases
        .pageInfo as PageInfo;

      return {
        profileData: items,
        pageInfo,
        userRank,
      };
    } else {
      throw new Error("Failed to fetch data from Leaderboard.");
    }
  } catch (error) {
    throw new Error("Failed to fetch data from Leaderboard.");
  }
};

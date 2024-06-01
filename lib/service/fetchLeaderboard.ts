import { PageInfo } from "../client/offers-utils";
import { RawLeaderboardDataInterface } from "../client/leaderboard-utils";
import { LEADERBOARD_QUERY } from "../client/leaderboard-queries";
import axios from "axios";

export interface LeaderboardDataResponse {
  profileData: RawLeaderboardDataInterface[];
  pageInfo: PageInfo;
}

export const fetchLeaderboard = async ({
  pageParam,
  userAddress,
  chainId,
}: {
  pageParam: string | null;
  userAddress: `0x${string}` | undefined;
  chainId: number;
}): Promise<LeaderboardDataResponse> => {
  const after = pageParam || null;
  const query = LEADERBOARD_QUERY;
  const variables = {
    orderDirection: "desc",
    inputAddress: userAddress,
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
    const response = await axios.post(
      endpoint,
      { query, variables },
      { headers },
    );

    if (response.data && response.data.data) {
      const items = response.data.data.profileDatabases
        .items as RawLeaderboardDataInterface[];
      const pageInfo = response.data.data.profileDatabases.pageInfo as PageInfo;

      return {
        profileData: items,
        pageInfo,
      };
    } else {
      throw new Error("Failed to fetch data from Leaderboard.");
    }
  } catch (error) {
    throw new Error("Failed to fetch data from Leaderboard.");
  }
};

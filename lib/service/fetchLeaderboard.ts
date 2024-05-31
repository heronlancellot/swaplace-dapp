import { PageInfo } from "../client/offers-utils";

import { RawLeaderboardDataInterface } from "../client/ponder-utils";
import axios from "axios";
import toast from "react-hot-toast";

export const fetchLeaderboard = async ({
  pageParam,
  userAddress,
  chainId,
}: {
  pageParam: string | null;
  userAddress: `0x${string}` | undefined;
  chainId: number;
}) => {
  if (!userAddress) throw new Error("User address is not defined");

  // {
  //           "totalScore": "130",
  //           "ensName": "",
  //           "acceptSwapCount": "1",
  //           "cancelSwapCount": "0",
  //           "createSwapCount": "3",
  //           "id": "0x00000000000d86e4837ba41dacde4b8713d5ccac",
  //           "totalTransactionCount": "4",
  //           "firstInteractionDate": "5734777",
  //           "lastInteractionDate": "5738563"
  //         },

  console.log("ChainId: ", chainId);
  const after = pageParam || null;
  const query = "";
  const variables = {};

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
      throw new Error("Failed to fetch swaps from Subgraph");
    }
  } catch (error) {
    toast.error("Failed to fetch swaps from Subgraph. Please contact the team");
    throw new Error("Failed to fetch swaps from Subgraph");
  }
};

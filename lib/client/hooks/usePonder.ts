import { cleanJsonString } from "../utils";
import { Asset } from "../swap-utils";
import { SwapContext } from "@/components/01-atoms";
import { type NftMetadataBatchToken } from "alchemy-sdk";
import axios from "axios";
import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

//Swaps
interface Item {
  swapId: string;
  status: string;
  owner: string;
  allowed: string | null;
  expiry: bigint;
  bid: string;
  ask: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface PageParam {
  pageParam: string | null;
}

export enum PonderFilter {
  ALL_OFFERS = "ALL OFFERS",
  CREATED = "CREATED",
  RECEIVED = "RECEIVED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

export const usePonder = () => {
  const { inputAddress, ponderFilterStatus } = useContext(SwapContext);

  const formattedInputAddress = inputAddress.startsWith("0x") // Temporary replacing the authAddress
    ? inputAddress
    : `0x${inputAddress}`;

  const fetchSwaps = async ({ pageParam }: PageParam) => {
    console.log("Ponder Filter Inside FetchSwaps:", ponderFilterStatus);
    const after = pageParam ? pageParam : null;
    let query = "";
    let variables = {};

    const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

    if (ponderFilterStatus === PonderFilter.ALL_OFFERS) {
      //Done
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String!, $after: String, $allowed: String) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { OR: [{owner: $inputAddress}, {allowed: $allowed}] },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
               bid
               ask
               blockTimestamp
               transactionHash
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        inputAddress: formattedInputAddress,
        after: after,
        allowed: formattedInputAddress,
      };
    } else if (ponderFilterStatus === PonderFilter.CREATED) {
      //Done
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String!, $ponderFilterStatus: Status!, $after: String, $expiry_gt: BigInt) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { owner: $inputAddress, status: $ponderFilterStatus, expiry_gt: $expiry_gt },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
               bid
               ask
               blockTimestamp
               transactionHash
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        inputAddress: formattedInputAddress,
        ponderFilterStatus: ponderFilterStatus,
        after: after,
        expiry_gt: currentUnixTimeSeconds,
      };
    } else if (ponderFilterStatus === PonderFilter.RECEIVED) {
      // Done
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $after: String, $allowed: String, $expiry_gt: BigInt) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { allowed: $allowed, status_not: ACCEPTED, expiry_gt: $expiry_gt },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
               bid
               ask
               blockTimestamp
               transactionHash
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        after: after,
        allowed: formattedInputAddress,
        expiry_gt: currentUnixTimeSeconds,
      };
    } else if (ponderFilterStatus === PonderFilter.ACCEPTED) {
      //Done
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String!, $after: String, $allowed: String) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [ {status: ACCEPTED}, {OR: [ {owner: $inputAddress},{allowed: $allowed}]}]},
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
               bid
               ask
               blockTimestamp
               transactionHash
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        inputAddress: formattedInputAddress,
        ponderFilterStatus: ponderFilterStatus,
        after: after,
        allowed: formattedInputAddress,
      };
    } else if (ponderFilterStatus === PonderFilter.CANCELED) {
      // Done
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String!, $ponderFilterStatus: Status!, $after: String) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { owner: $inputAddress, status: $ponderFilterStatus },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
               bid
               ask
               blockTimestamp
               transactionHash
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        inputAddress: formattedInputAddress,
        ponderFilterStatus: ponderFilterStatus,
        after: after,
      };
    } else if (ponderFilterStatus === PonderFilter.EXPIRED) {
      query = `
           query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String!, $after: String, $expiry_lt: BigInt) {
             databases(
               orderBy: $orderBy,
               orderDirection: $orderDirection,
               where: {OR: [{ owner: $inputAddress }, { allowed: $inputAddress }, { status_not: ACCEPTED }, { status_not: CANCELED }], expiry_lt: $expiry_lt },
               limit: 20,
               after: $after
             ) {
               items {
                 swapId
                 status
                 owner
                 allowed
                 expiry
                 bid
                 ask
                 blockTimestamp
                 transactionHash
               }
               pageInfo {
                 hasNextPage
                 endCursor
               }
             }
           }
         `;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        inputAddress: formattedInputAddress,
        expiry_lt: currentUnixTimeSeconds,
        after: after,
      };
    }

    const endpoint =
      "https://rascar-swaplace-ponder-production.up.railway.app/";
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        endpoint,
        { query, variables },
        { headers },
      );
      // console.log("Full response:", response);

      if (response.data && response.data.data) {
        const items = response.data.data.databases.items as Item[];
        const pageInfo = response.data.data.databases.pageInfo as PageInfo;
        // console.log("Items:", items);
        // console.log("PageInfo:", pageInfo);

        return {
          items,
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

  const {
    data,
    status,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["swaps", inputAddress, ponderFilterStatus],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      fetchSwaps({ pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
  });

  const pages = data?.pages ?? [];
  console.log("pages:", pages);

  return {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};

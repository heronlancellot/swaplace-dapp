/* eslint-disable react-hooks/exhaustive-deps */
import { cleanJsonString } from "../utils";
import { Asset } from "../swap-utils";
import { SwapContext } from "@/components/01-atoms";
import { type NftMetadataBatchToken } from "alchemy-sdk";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";

interface Item {
  swapId: string;
  status: string;
  owner: string;
  allowed: string;
  expiry: bigint;
  bid: Asset[]; // Asset
  ask: Asset[]; // Asset
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
  const { ponderFilterStatus } = useContext(SwapContext);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const [erc721AskSwaps, setERC721AskSwaps] = useState<NftMetadataBatchToken[]>(
    [],
  );

  const userAddress = authenticatedUserAddress?.address;

  const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  const fetchSwaps = async ({ pageParam }: PageParam) => {
    const after = pageParam ? pageParam : null;
    let query = "";
    let variables = {};

    if (ponderFilterStatus === PonderFilter.ALL_OFFERS) {
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String) {
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
        inputAddress: userAddress,
        after: after,
        allowed: userAddress,
      };
    } else if (ponderFilterStatus === PonderFilter.CREATED) {
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $expiry_gt: BigInt) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { owner: $inputAddress, status: CREATED, expiry_gt: $expiry_gt },
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
        inputAddress: userAddress,
        after: after,
        expiry_gt: currentUnixTimeSeconds,
      };
    } else if (ponderFilterStatus === PonderFilter.RECEIVED) {
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
        allowed: userAddress,
        expiry_gt: currentUnixTimeSeconds,
      };
    } else if (ponderFilterStatus === PonderFilter.ACCEPTED) {
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String) {
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
        inputAddress: userAddress,
        after: after,
        allowed: userAddress,
      };
    } else if (ponderFilterStatus === PonderFilter.CANCELED) {
      query = `
         query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String) {
           databases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [ {status: CANCELED}, {OR: [ {owner: $inputAddress}, {allowed: $allowed}]}]},
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
        inputAddress: userAddress,

        after: after,
        allowed: userAddress,
      };
    } else if (ponderFilterStatus === PonderFilter.EXPIRED) {
      query = `
           query databases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $expiry_lt: BigInt) {
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
        inputAddress: userAddress,
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

      if (response.data && response.data.data) {
        const items = response.data.data.databases.items as Item[];
        const pageInfo = response.data.data.databases.pageInfo as PageInfo;

        // const processedItems = items.map(item => ({
        //   ...item,
        //   bid: cleanJsonString(item.bid),
        //   ask: cleanJsonString(item.ask),
        // }));

        const processedItems = items.map((obj: any) => {
          return {
            ...obj,
            bid: cleanJsonString(obj.bid),
            ask: cleanJsonString(obj.ask),
          };
        });

        const PonderAlchemyERC721Ask: NftMetadataBatchToken[] = processedItems
          .map((swap: Item) => {
            if (Array.isArray(swap.ask) && swap.ask.length > 0) {
              const askObject = swap.ask[0];
              return {
                contractAddress: askObject.addr,
                tokenId: BigInt(askObject.amountOrId),
              };
            } else {
              console.error("Error ASK is not an array");
              return null;
            }
          })
          .filter((item) => item !== null) as NftMetadataBatchToken[];

        return {
          items: processedItems,
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
    queryKey: ["PonderQuerySwaps", userAddress, ponderFilterStatus],
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

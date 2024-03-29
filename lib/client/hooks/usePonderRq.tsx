import { SwapContext } from "@/components/01-atoms";
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

  const fetchSwaps = async ({ pageParam }: PageParam) => {
    const after = pageParam ? pageParam : null;

    const query = `
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

    const variables = {
      orderBy: "blockTimestamp",
      orderDirection: "desc",
      inputAddress: "0x12a0AA4054CDa340492228B1ee2AF0315276092b", //Test hardcoded
      ponderFilterStatus: "ACCEPTED",
      after: after,
    };

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
      console.log("Full response:", response);

      const items = response.data.data.databases.items as Item[];
      const pageInfo = response.data.data.databases.pageInfo as PageInfo;
      console.log("Items:", items);
      console.log("PageInfo:", pageInfo);

      return {
        items,
        pageInfo,
      };
    } catch (error) {
      console.error("Error fetching swaps:", error);
      throw error;
    }
  };

  const { data, status, error, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["swaps", inputAddress, ponderFilterStatus],
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
        fetchSwaps({ pageParam }),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
    });

  console.log("status:", status);
  console.log("error:", error?.message);
  const allSwaps = data;
  console.log("data:", allSwaps);

  const pages = data?.pages ?? [];
  console.log("pages:", pages);

  return {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
  };
};

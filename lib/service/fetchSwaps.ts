import axios from "axios";
import { ALL_OFFERS_QUERY } from "../client/offer-queries";

const fetchSwaps = async ({ pageParam, userAddress }: PageParam) => {
  if (!userAddress) throw new Error("User address is not defined");

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
      const items = response.data.data.swapDatabases
        .items as RawSwapOfferInterface[];
      const pageInfo = response.data.data.swapDatabases.pageInfo as PageInfo;
      const processedItems: RawSwapOfferInterface[] = items.map((obj: any) => {
        return {
          ...obj,
          bid: cleanJsonString(obj.bid),
          ask: cleanJsonString(obj.ask),
        };
      });
      const itemsArrayAsSwapOffers: FormattedSwapOfferAssets[] =
        processedItems.map((item) => {
          return {
            id: item.swapId,
            status: item.status,
            expiryDate: item.expiry,
            bidderAssets: {
              address: isAddress(item.allowed)
                ? new EthereumAddress(item.allowed)
                : new EthereumAddress(ADDRESS_ZERO),
              tokens: item.bid,
            },
            askerAssets: {
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
    toast.error("Failed to fetch swaps from Subgraph. Please contact the team");
    throw new Error("Failed to fetch swaps from Subgraph");
  }
};

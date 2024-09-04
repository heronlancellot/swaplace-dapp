import { getSwap } from "./getSwap";
import { ADDRESS_ZERO } from "../client/constants";
import { PonderFilter } from "../client/contexts";
import {
  ACCEPTED_OFFERS_QUERY,
  ALL_OFFERS_QUERY,
  CANCELED_OFFERS_QUERY,
  CREATED_OFFERS_QUERY,
  EXPIRED_OFFERS_QUERY,
  RECEIVED_OFFERS_QUERY,
} from "../client/offer-queries";
import {
  RawSwapOfferInterface,
  PageInfo,
  FormattedSwapOfferAssets,
  PopulatedSwapOfferCard,
} from "../client/offers-utils";
import { EthereumAddress } from "../shared/types";
import { cleanJsonString } from "../client/utils";
import { Asset, Swap } from "../client/swap-utils";
import {
  retrieveDataFromTokensArray,
  decodeConfig,
} from "../client/blockchain-utils";
import { ALL_OFFERS_MARKETPLACE_QUERY } from "@/lib/client/marketplace-queries";
import axios from "axios";
import { isAddress } from "viem";
import toast from "react-hot-toast";

export const fetchSwaps = async ({
  pageParam,
  userAddress,
  offersFilter,
  chainId,
}: {
  pageParam: string | null;
  userAddress: `0x${string}` | undefined;
  offersFilter: PonderFilter;
  chainId: number;
}) => {
  if (!userAddress) throw new Error("User address is not defined");

  const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  const after = pageParam || null;
  let query = "";
  let variables = {};

  switch (offersFilter) {
    case PonderFilter.MARKETPLACE:
      query = ALL_OFFERS_MARKETPLACE_QUERY;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        after: after,
        allowed: "0x00",
        expiry_gte: currentUnixTimeSeconds,
        network: chainId,
      };
      break;
    case PonderFilter.ALL_OFFERS:
      query = ALL_OFFERS_QUERY;
      variables = {
        orderBy: "blockTimestamp",
        orderDirection: "desc",
        inputAddress: userAddress,
        after: after,
        allowed: userAddress,
        expiry_gt: currentUnixTimeSeconds,
        network: chainId,
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
        network: chainId,
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
        network: chainId,
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
        network: chainId,
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
        network: chainId,
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
        network: chainId,
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

  const findStatus = (swap: FormattedSwapOfferAssets): PonderFilter => {
    switch (swap.status.toUpperCase()) {
      case PonderFilter.ACCEPTED.toUpperCase():
        return PonderFilter.ACCEPTED;
      case PonderFilter.ALL_OFFERS.toUpperCase():
        return PonderFilter.ALL_OFFERS;
      case PonderFilter.CANCELED.toUpperCase():
        return PonderFilter.CANCELED;
      case PonderFilter.CREATED.toUpperCase():
        return PonderFilter.CREATED;
      case PonderFilter.EXPIRED.toUpperCase():
        return PonderFilter.EXPIRED;
      default:
        return PonderFilter.RECEIVED;
    }
  };

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
      const processedItems: RawSwapOfferInterface[] = items.map(
        (obj: RawSwapOfferInterface) => {
          const bid = cleanJsonString(String(obj.bid));
          const ask = cleanJsonString(String(obj.ask));
          const bidderAssets: Asset[] = bid.map((item: Asset) => {
            return {
              addr: item.addr as `0x${string}`,
              amountOrId: BigInt(item.amountOrId) as bigint,
            };
          });
          const askerAssets: Asset[] = ask.map((item: Asset) => {
            return {
              addr: item.addr as `0x${string}`,
              amountOrId: BigInt(item.amountOrId) as bigint,
            };
          });
          return {
            ...obj,
            bid: bidderAssets,
            ask: askerAssets,
          };
        },
      );
      const itemsArrayAsSwapOffers: FormattedSwapOfferAssets[] =
        processedItems.map((item) => {
          return {
            id: item.swapId,
            status: item.status,
            expiryDate: item.expiry,
            recipient: item.recipient,
            value: item.value,
            bidderAssets: {
              address: new EthereumAddress(item.owner),
              tokens: item.bid,
            },
            askerAssets: {
              address: isAddress(item.allowed)
                ? new EthereumAddress(item.allowed)
                : new EthereumAddress(ADDRESS_ZERO),
              tokens: item.ask,
            },
          };
        });
      const itemsArrayAsSwapOffersPopulated: Promise<PopulatedSwapOfferCard>[] =
        itemsArrayAsSwapOffers.map(async (swap) => {
          const bidedTokensWithData = await retrieveDataFromTokensArray(
            swap.bidderAssets.tokens,
          );
          const askedTokensWithData = await retrieveDataFromTokensArray(
            swap.askerAssets.tokens,
          );

          const swapStatus = findStatus(swap);
          const swapData: Swap = await getSwap(
            BigInt(swap.id),
            chainId as number,
          );
          const swapExpiryData = await decodeConfig({
            config: swapData.config,
          });

          return {
            id: BigInt(swap.id),
            status: swapStatus,
            expiryDate: swapExpiryData.expiry,
            recipient: swap.recipient,
            value: swap.value,
            bidderTokens: {
              address: swap.bidderAssets.address,
              tokens: bidedTokensWithData,
            },
            askerTokens: {
              address: swap.askerAssets.address,
              tokens: askedTokensWithData,
            },
          };
        });

      const formattedTokens: PopulatedSwapOfferCard[] = await Promise.all(
        itemsArrayAsSwapOffersPopulated,
      );

      return {
        swapOffers: formattedTokens,
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

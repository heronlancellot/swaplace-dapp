import { Asset } from "./swap-utils";
import { PonderFilter } from "./contexts";
import { EthereumAddress, Token } from "../shared/types";

export interface RawSwapOfferInterface {
  // RawSwapOfferInterface represents the object interface of a Swap Offer coming from Ponder
  swapId: string;
  status: string;
  owner: string;
  allowed: string;
  expiry: bigint;
  recipient: bigint;
  value: bigint;
  bid: Asset[];
  ask: Asset[];
}
export interface FormattedSwapOfferAssets {
  // FormattedSwapOffers represents the object interface in the middle of the process to populated the swap
  id: string;
  status: string;
  expiryDate: bigint;
  recipient: bigint;
  value: bigint;
  bidderAssets: {
    address: EthereumAddress;
    tokens: Asset[];
  };
  askerAssets: {
    address: EthereumAddress;
    tokens: Asset[];
  };
}

export interface PopulatedSwapOfferCard {
  // The PopulatedSwapOfferCard represents the card with all the data needed to represent a offer
  id: bigint;
  status: PonderFilter;
  expiryDate: bigint;
  recipient: bigint;
  value: bigint;
  bidderTokens: {
    address: EthereumAddress;
    tokens: Token[];
  };
  askerTokens: {
    address: EthereumAddress;
    tokens: Token[];
  };
}

export interface PageInfo {
  // PageInfo is used by useInfiniteQuery for pagination
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PageData {
  swapOffers: PopulatedSwapOfferCard[];
  pageInfo: PageInfo;
}

export interface PageParam {
  pageParam: string | null;
}

export interface InfiniteQueryData {
  pages: {
    swapOffers: {
      id: bigint;
      status: PonderFilter;
      expiryDate: bigint;
      recipient: bigint;
      value: bigint;
      bidderTokens: { address: EthereumAddress; tokens: Token[] };
      askerTokens: { address: EthereumAddress; tokens: Token[] };
    }[];
    pageInfo: PageInfo;
  };
}

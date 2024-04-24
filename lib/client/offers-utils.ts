import { Asset } from "./swap-utils";
import { EthereumAddress, Token } from "../shared/types";
import { PonderFilter } from "@/components/01-atoms";

export interface RawSwapOfferInterface {
  // RawSwapOfferInterface represents the object interface of a Swap Offer coming from Ponder
  swapId: string;
  status: string;
  owner: string;
  allowed: string;
  expiry: bigint;
  bid: Asset[];
  ask: Asset[];
  recipient: bigint;
  value: bigint;
}
export interface FormattedSwapOfferAssets {
  // FormattedSwapOffers represents the object interface in the middle of the process to populated the swap
  id: string;
  status: string;
  expiryDate: bigint;
  bidderAssets: {
    address: EthereumAddress;
    tokens: Asset[];
  };
  askerAssets: {
    address: EthereumAddress;
    tokens: Asset[];
  };
}

// - The `biding` are the assets that the owner is offering.
// - The `asking` are the assets that the owner wants in exchange.
export interface PopulatedSwapOfferCard {
  // The PopulatedSwapOfferCard represents the card with all the data needed to represent a offer
  id: bigint;
  status: PonderFilter;
  expiryDate: bigint;
  bidderTokens: {
    address: EthereumAddress; // owner address
    tokens: Token[];
  };
  askerTokens: {
    address: EthereumAddress; // address of the asking user ( allowed )
    tokens: Token[];
  };
}

export interface PageInfo {
  // PageInfo is used by useInfiniteQuery for pagination
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PageParam {
  pageParam: string | null;
}

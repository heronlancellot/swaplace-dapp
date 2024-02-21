/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/named */
import {
  ERC20,
  ERC721,
  NFTsQueryStatus,
  Token,
  getApiKeyForNetwork,
  getRpcHttpUrlForNetwork,
} from "./constants";
import { Asset, makeAsset } from "./swap-utils";
import {
  GetTokensForOwnerResponse,
  OwnedNftsResponse,
  OwnedNft,
  OwnedToken,
} from "alchemy-sdk";
import { Dispatch, SetStateAction } from "react";

export interface ICreateSwap {
  walletClient: any;
  expireDate: bigint;
  nftInputUser: any[];
  nftAuthUser: any[];
  validatedAddressToSwap: string;
  authenticatedUserAddress: any;
  chain: number;
}

export interface IApproveMulticall {
  abi: any;
  functionName: string;
  address: `0x${string}`;
  args?: [any];
}
export interface IGetApproveSwap {
  tokenAddress: `0x${string}`;
  amountOrId: bigint;
}
export interface IApproveSwap {
  walletClient: any;
  spender: any;
  amountOrId: bigint;
  tokenContractAddress: any;
}

export enum SwapModalSteps {
  APPROVE_NFTS,
  CREATE_SWAP,
  CREATING_SWAP,
  CREATED_SWAP,
}

export enum ButtonClickPossibilities {
  PREVIOUS_STEP,
  NEXT_STEP,
}

export enum TransactionStatus {
  SEND_TRANSACTION,
  WAITING_WALLET_APPROVAL,
  TRANSACTION_APPROVED,
  SUCCESSFUL_TRANSACTION,
}

export type NftSwappingInfo = {
  tokenAddress: `0x${string}`;
  amountOrId: bigint;
};

export async function ComposeTokenUserAssets(
  nftUser: Token[],
): Promise<Asset[]> {
  const tokenAssetArray: Asset[] = [];
  const assetPromisesArray: Promise<void>[] = [];

  for (let i = 0; i < nftUser.length; i += 1) {
    const addr = nftUser[i]?.contract as `0x${string}`;
    const amountOrId = BigInt(nftUser[i].id as unknown as number);

    if (amountOrId !== undefined && addr !== undefined) {
      const assetPromise = makeAsset(addr, amountOrId).then((asset) => {
        tokenAssetArray.push(asset);
      });
      assetPromisesArray.push(assetPromise);
    }
  }

  await Promise.all(assetPromisesArray);

  return tokenAssetArray;
}

export function getNftsInfoToSwap(userNfts: Token[]): NftSwappingInfo[] {
  const nftsInfoArray: NftSwappingInfo[] = [];

  for (let i = 0; i < userNfts.length; i++) {
    const nftAmountOrTokenId = BigInt(userNfts[i]?.id as unknown as number);
    const nftContractAddress = userNfts[i]?.contract as `0x${string}`;

    if (nftAmountOrTokenId !== undefined && nftContractAddress !== undefined) {
      nftsInfoArray.push({
        tokenAddress: nftContractAddress,
        amountOrId: nftAmountOrTokenId,
      });
    }

    // if (i + 1 < userNfts.length) {
    //   const nextAmountOrId = BigInt(hexToNumber(userNfts[i + 1]?.id?.tokenId));
    //   const nextAddr = userNfts[i + 1]?.contract?.address as `0x${string}`;

    //   if (nextAmountOrId !== undefined && nextAddr !== undefined) {
    //     nftsInfoArray.push([nextAddr, nextAmountOrId]);
    //   }
    // }
  }

  return nftsInfoArray;
}

// Check out the Alchemy Documentation https://docs.alchemy.com/reference/getnfts-sdk-v3
export const getERC721TokensFromAddress = async (
  address: string,
  chainId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stateSetter: Dispatch<SetStateAction<NFTsQueryStatus>>,
) => {
  const { Alchemy } = require("alchemy-sdk");

  const config = {
    apiKey: getApiKeyForNetwork.get(chainId),
    network: getRpcHttpUrlForNetwork
      .get(chainId)
      ?.split("https://")[1]
      .split(".")[0], // The network from alchemy needs to be like 'eth-sepolia' | 'eth-goerli'
  };
  const alchemy = new Alchemy(config);

  return alchemy.nft
    .getNftsForOwner(address)
    .then((response: OwnedNftsResponse) => {
      return parseAlchemyERC721Tokens(response.ownedNfts);
    })
    .catch((error: any) => {
      console.error("Error getNftsForOwner:", error);
      throw new Error();
    });
};

const parseAlchemyERC721Tokens = (tokens: OwnedNft[]): ERC721[] => {
  return tokens.map((token) => {
    return {
      id: token.tokenId,
      name: token.contract.name,
      metadata: token.raw.metadata,
      contract: token.contract.address,
      contractMetadata: token.contract,
    };
  });
};

// Check out the Alchemy Documentation https://docs.alchemy.com/reference/gettokensforowner-sdk-v3
export const getERC20TokensFromAddress = async (
  address: string,
  chainId: number,
): Promise<ERC20[]> => {
  const { Alchemy } = require("alchemy-sdk");

  const config = {
    apiKey: getApiKeyForNetwork.get(chainId),
    network: getRpcHttpUrlForNetwork
      .get(chainId)
      ?.split("https://")[1]
      .split(".")[0], // The network from alchemy needs to be like 'eth-sepolia' | 'eth-goerli'
  };
  const alchemy = new Alchemy(config);

  const ownerAddress = address;

  return alchemy.core
    .getTokensForOwner(ownerAddress)
    .then((response: GetTokensForOwnerResponse) => {
      return parseAlchemyERC20Tokens(response.tokens);
    });
};

const parseAlchemyERC20Tokens = (tokens: OwnedToken[]): ERC20[] => {
  return tokens.map((token) => {
    return {
      name: token.name,
      logo: token.logo,
      symbol: token.symbol,
      rawBalance: token.rawBalance,
      contract: token.contractAddress,
    };
  });
};

// export interface Swap {
//   owner: string;
//   config: any;
//   biding: Token[];
//   asking: Token[];
// }

// export async function makeConfig(
//   Contract: any,
//   allowed: any,
//   destinationChainSelector: any,
//   expiration: any,
// ) {
//   const config = await Contract.packData(
//     allowed,
//     destinationChainSelector,
//     expiration,
//   );
//   return config;
// }

// export async function makeSwap(
//   Contract: any,
//   owner: any,
//   allowed: any,
//   destinationChainSelector: any,
//   expiration: any,
//   biding: Token[],
//   asking: Token[],
//   chainId: number,
// ) {
//   const timestamp = await getTimestamp(chainId);
//   if (expiration < timestamp) {
//     throw new Error("InvalidExpiry");
//   }

//   if (biding.length == 0 || asking.length == 0) {
//     throw new Error("InvalidAssetsLength");
//   }

//   const config = await makeConfig(
//     Contract,
//     allowed,
//     destinationChainSelector,
//     expiration,
//   );

//   const swap: Swap = {
//     owner: owner,
//     config: config,
//     biding: biding,
//     asking: asking,
//   };

//   return swap;
// }

export interface IArrayStatusTokenApproved {
  approved: `0x${string}`;
  tokenAddress: `0x${string}`;
  amountOrId: bigint;
}

export async function packingData(
  Contract: any,
  allowed: any,
  expiration: any,
) {
  const config = await Contract.read.packData([allowed, expiration]);
  return config;
}

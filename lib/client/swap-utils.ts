import { Dispatch, SetStateAction } from "react";
import { getMultipleNftsApprovalStatus } from "../service/verifyTokensSwapApproval";
import {
  IArrayStatusTokenApproved,
  getNftsInfoToSwap,
} from "./blockchain-data";
import { ADDRESS_ZERO, NFT } from "./constants";
import { ethers } from "ethers";

export const updateNftsToSwapApprovalStatus = async (
  nftsList: NFT[],
  setNftsApprovalStatus: Dispatch<SetStateAction<IArrayStatusTokenApproved[]>>,
  setNftsAreAllApproved: (areApproved: boolean) => void,
) => {
  const nftsToSwapFromAuthedUser = getNftsInfoToSwap(nftsList);
  try {
    const result = await getMultipleNftsApprovalStatus(
      nftsToSwapFromAuthedUser,
    );

    const nftsApprovalStatus = result.map((approved, index) => ({
      tokenAddress: nftsToSwapFromAuthedUser[index].tokenAddress,
      amountOrId: nftsToSwapFromAuthedUser[index].amountOrId,
      approved: approved as `0x${string}`,
    }));

    const someNftIsNotApprovedForSwapping = !result.some(
      (approved) => approved === ADDRESS_ZERO,
    );

    setNftsApprovalStatus(nftsApprovalStatus);
    setNftsAreAllApproved(someNftIsNotApprovedForSwapping);
  } catch (error) {
    console.error("error ", error);
  }
};

export interface Asset {
  addr: string;
  amountOrId: bigint;
}

export interface Swap {
  owner: string;
  config: number;
  biding: Asset[];
  asking: Asset[];
}

export async function makeAsset(
  addr: string,
  amountOrId: number | bigint,
): Promise<Asset> {
  // validate if its an ethereum address
  if (!ethers.utils.isAddress(addr)) {
    throw new Error("InvalidAddressFormat");
  }

  // if the amount is negative, it will throw an error
  if (amountOrId < 0) {
    throw new Error("AmountOrIdCannotBeNegative");
  }

  /**
   * @dev Create a new Asset type described by the contract interface.
   *
   * NOTE: If the amount is in number format, it will be converted to bigint.
   * EVM works with a lot of decimals and might overload using number type.
   */
  const asset: Asset = {
    addr: addr,
    amountOrId: typeof amountOrId == "number" ? BigInt(amountOrId) : amountOrId,
  };

  return asset;
}

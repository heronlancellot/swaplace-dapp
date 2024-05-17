import { SwaplaceAbi } from "../client/abi";
import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { Swap } from "../client/swap-utils";
import { publicClient } from "../wallet/wallet-config";

export async function getSwap(swapId: bigint, chainId: number) {
  const swapDataById = (await publicClient({
    chainId: chainId,
  }).readContract({
    address: SWAPLACE_SMART_CONTRACT_ADDRESS[chainId] as `0x${string}`,
    abi: SwaplaceAbi,
    functionName: "getSwap",
    args: [swapId],
  })) as Swap;

  return swapDataById;
}

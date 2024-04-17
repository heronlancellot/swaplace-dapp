import { SwaplaceAbi } from "../client/abi";
import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

interface getSwapUserConfiguration {
  chain: number;
}

export async function getSwap(
  swapId: bigint,
  configurations: getSwapUserConfiguration,
) {
  const swapDataById = await publicClient({
    chainId: configurations.chain,
  }).readContract({
    address: SWAPLACE_SMART_CONTRACT_ADDRESS[
      configurations.chain
    ] as `0x${string}`,
    abi: SwaplaceAbi,
    functionName: "getSwap",
    args: [swapId],
  });

  return swapDataById;
}

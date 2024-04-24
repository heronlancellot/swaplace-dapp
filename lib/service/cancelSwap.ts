import { SwaplaceAbi } from "../client/abi";
import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { encodeFunctionData } from "viem";

export interface SwapUserConfiguration {
  walletClient: any;
  chain: number;
}

export function cancelSwap(
  swapId: bigint,
  configurations: SwapUserConfiguration,
) {
  const data = encodeFunctionData({
    abi: SwaplaceAbi,
    functionName: "cancelSwap",
    args: [swapId],
  });

  return configurations.walletClient.sendTransaction({
    data: data,
    to: SWAPLACE_SMART_CONTRACT_ADDRESS[configurations.chain],
  });
}

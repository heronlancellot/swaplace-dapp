import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { EthereumAddress } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import { encodeFunctionData } from "viem";

export interface SwapUserConfiguration {
  walletClient: any;
  chain: number;
}

// TODO: Modify accept function
export async function acceptSwap(
  swapId: string,
  receiver: EthereumAddress,
  configurations: SwapUserConfiguration,
) {
  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "swapId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "acceptSwap",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [BigInt(swapId), receiver.address],
  });
  try {
    const transactionHash = await configurations.walletClient.sendTransaction({
      data: data,
      to: SWAPLACE_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
    });

    const transactionReceipt = await publicClient({
      chainId: configurations.chain,
    }).waitForTransactionReceipt({
      hash: transactionHash,
    });

    return transactionReceipt;
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
}

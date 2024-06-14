import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { EthereumAddress } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import { encodeFunctionData } from "viem";

export interface SwapUserConfiguration {
  walletClient: any;
  chain: number;
}

export async function acceptSwap(
  swapId: bigint,
  receiver: EthereumAddress,
  configurations: SwapUserConfiguration,
  msgValue: bigint,
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
    args: [swapId, receiver.address],
  });

  try {
    const gasLimit = await publicClient({
      chainId: configurations.chain,
    }).estimateGas({
      account: configurations.walletClient.account as `0x${string}`,
      data: data,
      to: SWAPLACE_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      value: msgValue,
    });

    const transactionHash = await configurations.walletClient.sendTransaction({
      data: data,
      to: SWAPLACE_SMART_CONTRACT_ADDRESS[
        configurations.chain
      ] as `0x${string}`,
      gasLimit: gasLimit,
      value: msgValue,
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

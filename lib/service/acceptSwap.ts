import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { EthereumAddress } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import { encodeFunctionData, parseEther } from "viem";
import { ethers } from "ethers";

export interface SwapUserConfiguration {
  walletClient: any;
  chain: number;
}

export async function acceptSwap(
  swapId: bigint,
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
    args: [swapId, receiver.address],
  });

  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/D4cZZW64N8gn71Xp8Vk5lr6CNlLMCdqr",
  );

  try {
    const contractAddress = SWAPLACE_SMART_CONTRACT_ADDRESS[
      configurations.chain
    ] as `0x${string}`;
    const estimatedGas = await provider.estimateGas({
      to: contractAddress,
      data: data,
    });

    const transactionHash = await configurations.walletClient.sendTransaction({
      to: contractAddress,
      data: data,
      gasLimit: estimatedGas,
      maxPriorityFeePerGas: parseEther("1"),
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

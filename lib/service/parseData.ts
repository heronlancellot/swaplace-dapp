import { SwaplaceAbi } from "../client/abi";
import { SWAPLACE_SMART_CONTRACT_ADDRESS } from "../client/constants";
import { EthereumAddress } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";

interface getSwapUserConfiguration {
  chain: number;
}

interface ParseDataPromise {
  bidingAddress: EthereumAddress;
  expiryDate: bigint;
}

export async function parseData(
  packConfigData: bigint,
  configurations: getSwapUserConfiguration,
): Promise<ParseDataPromise> {
  const response = await publicClient({
    chainId: configurations.chain,
  }).readContract({
    address: SWAPLACE_SMART_CONTRACT_ADDRESS[
      configurations.chain
    ] as `0x${string}`,
    abi: SwaplaceAbi,
    functionName: "parseData",
    args: [packConfigData],
  });

  if (Array.isArray(response) && response.length === 2) {
    const [bidingAddress, expiryDate] = response;

    if (typeof bidingAddress === "string" && typeof expiryDate === "bigint") {
      return {
        bidingAddress: new EthereumAddress(bidingAddress),
        expiryDate: expiryDate as bigint,
      };
    }
  }

  throw new Error("The returned data does not match the expected format.");
}

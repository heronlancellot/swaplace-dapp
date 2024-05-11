import { MockERC721Abi } from "../client/abi";
import { SWAPLACE_MOCK_TOKENS } from "../client/constants";
import { publicClient } from "../wallet/wallet-config";

/**
 * Retrieves the token URI associated with the given token ID from an ERC721 contract.
 * This is a read-only function.
 */
export async function getTokenUri(
  tokenID: bigint,
  chainId: number,
): Promise<string> {
  const metadata: string = (await publicClient({
    chainId: chainId,
  }).readContract({
    address: SWAPLACE_MOCK_TOKENS[chainId].ERC721 as `0x${string}`,
    abi: MockERC721Abi,
    functionName: "tokenURI",
    args: [tokenID],
  })) as string;

  return metadata;
}

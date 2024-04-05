import { MockERC20Abi, MockERC721Abi } from "../client/abi";
import { EthereumAddress, TokenType } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import toast from "react-hot-toast";
import { getContract } from "viem";

interface verifyTokensOwnershipProps {
  address: EthereumAddress;
  tokenType: TokenType;
  contractAddress: `0x${string}`;
  tokenId: string;
  chainId: number;
}

interface VerifyTokensResponse {
  isOwner: boolean;
  erc20Balance: bigint | null;
}

export async function verifyTokenOwnership({
  address,
  contractAddress,
  tokenId,
  tokenType,
  chainId,
}: verifyTokensOwnershipProps): Promise<VerifyTokensResponse> {
  const [abi, args] =
    tokenType === TokenType.ERC20
      ? [MockERC20Abi, [address.address]]
      : [MockERC721Abi, [tokenId]];

  try {
    const contract = getContract({
      address: contractAddress,
      publicClient: publicClient({ chainId: chainId }),
      abi,
    });

    if (tokenType === TokenType.ERC721) {
      const tokenOwner = await contract.simulate.ownerOf(args);
      if (typeof tokenOwner.result === "string") {
        return {
          isOwner:
            (tokenOwner.result as string).toUpperCase() ===
            address.address.toUpperCase(),
          erc20Balance: null,
        };
      } else throw new Error("Invalid Token ownerOf response type");
    } else if (tokenType === TokenType.ERC20) {
      // The array [] should not be used.
      // This is a turn around for the current viem version: "^1.19.11"
      const hasDecimals = await contract.read.decimals([]).catch((error) => {
        toast.error("This contract is not an ERC20 contract.");
        console.error(error);
        throw error;
      });

      if (hasDecimals) {
        const tokenBalance = await contract.read
          .balanceOf(args)
          .catch((error) => {
            console.error(error);
            throw error;
          });

        if (typeof tokenBalance === "bigint") {
          return {
            isOwner: tokenBalance > 0,
            erc20Balance: tokenBalance,
          };
        } else throw new Error("Invalid Token balance response type");
      }
    }
  } catch (error) {
    console.error(error);
    toast.error(
      "Transaction failed. Check the Contract address and the token chain",
    );
    throw error;
  }

  return {
    isOwner: false,
    erc20Balance: null,
  };
}

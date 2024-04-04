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

export async function verifyTokenOwnership({
  address,
  contractAddress,
  tokenId,
  tokenType,
  chainId,
}: verifyTokensOwnershipProps) {
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
          erc20Balance: undefined,
        };
      } else throw new Error("Invalid Token ownerOf response type");
    } else if (tokenType === TokenType.ERC20) {
      // The array [] should not be used.
      // This is a turn around for the current viem version: "^1.19.11"
      await contract.simulate
        .decimals([])
        .then(async (hasDecimals) => {
          hasDecimals &&
            (await contract.simulate.balanceOf(args).then((tokenBalance) => {
              if (typeof tokenBalance.result === "bigint") {
                return {
                  isOwner: tokenBalance.result > 0,
                  erc20Balance: tokenBalance.result,
                };
              } else throw new Error("Invalid Token balance response type");
            }));
        })
        .catch((error) => {
          toast.error("This contract is not an ERC20 contract.");
          console.error(error);
        });
    }
  } catch (error) {
    console.error(error);
    toast.error(
      "Transaction failed. Check the Contract address and the token chain",
    );
    return {
      receipt: null,
      success: false,
      errorMessage: String(error),
    };
  }
}

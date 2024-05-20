import { MockERC20Abi, MockERC721Abi } from "../client/abi";
import { ADDRESS_ZERO } from "../client/constants";
import { EthereumAddress, TokenType } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import toast from "react-hot-toast";
import { getContract } from "viem";

export interface UserConfiguration {
  address: EthereumAddress;
  chainId: number;
}
export interface TokenConfiguration {
  contractAddress: `0x${string}`;
  tokenId: string;
  tokenType: TokenType;
}

/**
 *  This function verifies if the user is the owner of the token.
 *  It returns a boolean value.
 */
export async function verifyTokenOwnership({
  user,
  token,
}: {
  user: UserConfiguration;
  token: TokenConfiguration;
}): Promise<boolean> {
  const [abi, args] =
    token.tokenType === TokenType.ERC20
      ? [MockERC20Abi, [user.address.address]]
      : [MockERC721Abi, [token.tokenId]];

  const contract = getContract({
    address: token.contractAddress,
    publicClient: publicClient({ chainId: user.chainId }),
    abi,
  });

  const allowedToSwapAnyUser = user.address.address === ADDRESS_ZERO; // Any user can swap with the zero address

  switch (token.tokenType) {
    case TokenType.ERC721:
      try {
        const tokenOwner = await contract.simulate.ownerOf(args);

        if (typeof tokenOwner.result === "string") {
          return allowedToSwapAnyUser
            ? allowedToSwapAnyUser
            : (tokenOwner.result as string).toUpperCase() ===
                user.address.address.toUpperCase();
        }
      } catch (error: any) {
        console.error(error);
        error.message.includes("ERC721: invalid token ID") &&
          toast.error("Invalid Token ID");
      }

    case TokenType.ERC20:
      try {
        const hasDecimals = (await contract.read.decimals([])) as number;
        if (hasDecimals === 18) {
          const tokenBalance = (await contract.read.balanceOf(args)) as bigint;
          if (!allowedToSwapAnyUser) {
            return tokenBalance > 0n;
          } else {
            return true; // When the user is allowed to swap any token
          }
        } else toast.error("This contract is not an ERC20 contract");
      } catch (error: any) {
        console.error(error);
        return false;
      }

    default:
      return false;
  }
}

interface TokenDataResponse {
  isOwner: boolean;
  erc20Balance: bigint;
  name: string;
}

/**
 *  This function parses the token data and returns the token name and balance.
 *  Getting the data from the contract and returning it as a TokenDataResponse.
 */
export async function parseTokenData({
  user,
  token,
}: {
  user: UserConfiguration;
  token: TokenConfiguration & { tokenOwner: boolean };
}): Promise<TokenDataResponse> {
  const [abi, args] =
    token.tokenType === TokenType.ERC20
      ? [MockERC20Abi, [user.address.address]]
      : [MockERC721Abi, [token.tokenId]];

  const contract = getContract({
    address: token.contractAddress,
    publicClient: publicClient({ chainId: user.chainId }),
    abi,
  });
  const tokenName = await contract.read.name([]);

  const allowedToSwapAnyUser = user.address.address === ADDRESS_ZERO; // Any user can swap with the zero address

  switch (token.tokenType) {
    case TokenType.ERC721:
      return {
        isOwner: token.tokenOwner,
        erc20Balance: 0n,
        name: tokenName as string,
      };

    case TokenType.ERC20:
      const hasDecimals = await contract.read.decimals([]);
      if (hasDecimals) {
        const tokenBalance = await contract.read.balanceOf(args);
        const totalSupply = (await contract.read.totalSupply([])) as bigint;
        if (typeof tokenBalance === "bigint") {
          return {
            isOwner: token.tokenOwner,
            erc20Balance: allowedToSwapAnyUser ? totalSupply : tokenBalance,
            name: tokenName as string,
          };
        }
      }

    default:
      return {
        isOwner: false,
        erc20Balance: 0n,
        name: "",
      };
  }
}

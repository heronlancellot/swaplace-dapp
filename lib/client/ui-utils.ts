import { TimeStampDate } from "./swap-utils";
import {
  ERC20,
  ERC20WithTokenAmountSelection,
  ERC721,
  EthereumAddress,
  Token,
  TokenType,
} from "../shared/types";

export const WIDE_SCREEN_SIZE = 1279;
export const DESKTOP_SCREEN_SIZE = 1023;
export const TABLET_SCREEN_SIZE = 768;

export enum TokenCardActionType {
  "SELECT_TOKEN_FOR_SWAP",
  "APPROVE_TOKEN_SWAP",
  "SHOW_NFT_DETAILS",
  "NO_ACTION",
}

export enum TokenCardStyleType {
  SMALL = "small",
  NORMAL = "normal",
  MEDIUM = "medium",
  LARGE = "large",
}
export const TokenSizeClassNames = {
  [TokenCardStyleType.SMALL]: "card-token-small",
  [TokenCardStyleType.NORMAL]: "card-token-normal",
  [TokenCardStyleType.MEDIUM]: "card-token-medium",
  [TokenCardStyleType.LARGE]: "card-token-large",
};

export interface ExpireOption {
  label: string;
  value: TimeStampDate;
}

export enum SwapModalSteps {
  APPROVE_TOKENS,
  ACCEPT_SWAP,
  WAIT_BLOCKCHAIN_INTERACTION,
  SUCCESSFUL_SWAP,
}

export const ExpireDate: ExpireOption[] = [
  { label: "1 day", value: TimeStampDate.ONE_DAY },
  { label: "1 week", value: TimeStampDate.ONE_WEEK },
  { label: "1 month", value: TimeStampDate.ONE_MONTH },
  { label: "1 year", value: TimeStampDate.ONE_YEAR },
];

export const getTokenName = (
  token: Token,
  prefix = {
    withAmountPrefix: true,
    displayTokenAmount: true,
  },
): string => {
  if (token.tokenType === TokenType.ERC20) {
    const erc20balancePrefix = prefix.withAmountPrefix
      ? prefix.displayTokenAmount &&
        (token as ERC20WithTokenAmountSelection).tokenAmount
        ? (token as ERC20WithTokenAmountSelection).tokenAmount.toLocaleString(
            "en-US",
          )
        : (token as ERC20).rawBalance.toLocaleString("en-US")
      : "";

    return token.symbol
      ? erc20balancePrefix + " $" + token.symbol
      : erc20balancePrefix + " " + token.tokenType;
  } else if (token.tokenType === TokenType.ERC721) {
    const metadataSymbol =
      (token as ERC721).metadata?.symbol ?? (token as ERC721).symbol;
    const tokenName =
      (token as ERC721).metadata?.name ?? (token as ERC721).name;

    return metadataSymbol
      ? `[#${token.id}]` + ` $${metadataSymbol}`
      : tokenName
      ? `[#${token.id}] ${token.name}`
      : `[#${token.id}] ${token.tokenType}`;
  } else {
    return "Metadata not found";
  }
};

/**
 *
 * @param token
 * @returns TokenContractAddress from token, returns EthereumAddress type.
 */
export const getTokenContractAddress = (token: Token): EthereumAddress => {
  if (!token) throw new Error("Token not defined");

  const address: EthereumAddress | undefined = !token.contract
    ? (token as ERC721).contractMetadata?.address
    : typeof token.contract === "string"
    ? new EthereumAddress(token.contract)
    : undefined;

  if (address === undefined)
    throw new Error(
      `Token contract address not defined for ${getTokenName(token)}`,
    );
  return address;
};

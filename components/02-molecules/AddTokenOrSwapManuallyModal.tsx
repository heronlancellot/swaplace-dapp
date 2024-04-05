import { ForWhom } from "@/components/03-organisms";
import { SwapContext, SwapModalLayout } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { ERC20, ERC721, Token, TokenType } from "@/lib/shared/types";
import { verifyTokenOwnership } from "@/lib/service/verifyTokenOwnership";
import { ShelfContext } from "@/lib/client/contexts/ShelfContext";
import React, { useContext, useState } from "react";
import cc from "classcat";
import { isAddress } from "viem";
import { useNetwork } from "wagmi";
import toast from "react-hot-toast";

export enum AddTokenOrSwapManuallyModalVariant {
  SWAP = "swap",
  TOKEN = "token",
}

interface AddManuallyConfig {
  header: string;
  body: React.ReactNode;
}

interface AddManuallyProps {
  variant?: AddTokenOrSwapManuallyModalVariant;
  forWhom: ForWhom;
  onClose: () => void;
  open: boolean;
}

const SwapBody = () => {
  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <div className="dark:p-small-dark p-small-variant-black">Swap ID</div>
        <div>
          <input className="w-full p-3 dark:bg-[#282a29] border border-[#353836] rounded-lg h-[44px]" />
        </div>
      </div>
      <div className="flex h-[36px]">
        <button className="bg-[#DDF23D] hover:bg-[#aabe13] w-full dark:shadow-add-manually-button py-2 px-4 rounded-[10px] p-medium-bold-variant-black">
          Add Swap
        </button>
      </div>
    </div>
  );
};

interface TokenBodyProps {
  forWhom: ForWhom;
}

const TokenBody = ({ forWhom }: TokenBodyProps) => {
  const [tokenType, setTokenType] = useState<TokenType>(TokenType.ERC20);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const { chain } = useNetwork();
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { validatedAddressToSwap } = useContext(SwapContext);
  const {
    yourTokensList,
    setYourManuallyAddedTokensList,
    theirTokensList,
    setTheirManuallyAddedTokensList,
  } = useContext(ShelfContext);

  interface TokenManually {
    tokenType: TokenType;
    contractAddress: `0x${string}`;
    tokenId: string;
    balance?: bigint;
  }

  const verifyTokenAlreadyInTokenList = async (token: Token) => {
    const filteringYourToken = yourTokensList.some(
      (t) =>
        t.contract &&
        token.contract &&
        t.contract.toUpperCase() === token.contract.toUpperCase(),
    );
    const filteringTheirToken = theirTokensList.some(
      (t) =>
        t.contract &&
        token.contract &&
        t.contract.toUpperCase() === token.contract.toUpperCase(),
    );
    if (forWhom === ForWhom.Your) {
      if (token.tokenType === TokenType.ERC20) {
        return filteringYourToken;
      } else if (token.tokenType === TokenType.ERC721) {
        return yourTokensList.some(
          (t) => filteringYourToken && t.id === token.id,
        );
      }
    } else if (forWhom === ForWhom.Their) {
      if (token.tokenType === TokenType.ERC20) {
        return filteringTheirToken;
      } else if (token.tokenType === TokenType.ERC721) {
        return theirTokensList.some(
          (t) => filteringTheirToken && t.id === token.id,
        );
      }
    }
  };

  const addTokenToTokensList = (token: TokenManually) => {
    if (forWhom === ForWhom.Your) {
      if (token.tokenType === TokenType.ERC20 && token.balance) {
        const tokenERC20: ERC20 = {
          contract: token.contractAddress,
          rawBalance: token.balance,
          tokenType: token.tokenType,
        };

        verifyTokenAlreadyInTokenList(tokenERC20).then((tokenAlreadyInList) => {
          if (tokenAlreadyInList) {
            toast.error("Token ERC20 already in Token List");
          } else {
            setYourManuallyAddedTokensList([tokenERC20]);
            toast.success("Token ERC20 added in Token List");
          }
        });
      } else if (token.tokenType === TokenType.ERC721) {
        const tokenERC721: ERC721 = {
          contract: token.contractAddress,
          id: token.tokenId,
          tokenType: token.tokenType,
        };
        verifyTokenAlreadyInTokenList(tokenERC721).then(
          (tokenAlreadyInList) => {
            if (tokenAlreadyInList) {
              toast.error("Token ERC721 already in Token List");
            } else {
              setYourManuallyAddedTokensList([tokenERC721]);
              toast.success("Token ERC721 added in Token List");
            }
          },
        );
      }
    } else if (forWhom === ForWhom.Their) {
      if (token.tokenType === TokenType.ERC20 && token.balance) {
        const tokenERC20: ERC20 = {
          contract: token.contractAddress,
          rawBalance: token.balance,
          tokenType: token.tokenType,
        };

        verifyTokenAlreadyInTokenList(tokenERC20).then((tokenAlreadyInList) => {
          if (tokenAlreadyInList) {
            toast.error("Token ERC20 already in Token List");
          } else {
            setTheirManuallyAddedTokensList([tokenERC20]);
            toast.success("Token ERC20 added in Token List");
          }
        });
      } else if (token.tokenType === TokenType.ERC721) {
        const tokenERC721: ERC721 = {
          contract: token.contractAddress,
          id: token.tokenId,
          tokenType: token.tokenType,
        };

        verifyTokenAlreadyInTokenList(tokenERC721).then(
          (tokenAlreadyInList) => {
            if (tokenAlreadyInList) {
              toast.error("Token ERC721 already in Token List");
            } else {
              setYourManuallyAddedTokensList([tokenERC721]);
              toast.success("Token ERC721 added in Token List");
            }
          },
        );
      }
    }
  };

  const addTokenCard = async () => {
    const address =
      forWhom === ForWhom.Your
        ? authenticatedUserAddress
        : validatedAddressToSwap;

    if (!address) {
      toast.error("No valid address was given to add a token card for.");
      throw new Error("No valid address was given to add a token card for.");
    }
    if (!contractAddress) {
      toast.error("No contract address was given to add a token card for.");
      throw new Error("No contract address was given to add a token card for.");
    } else if (isAddress(contractAddress) === false) {
      toast.error("Invalid contract address.");
      return;
    }

    if (!chain) {
      throw new Error("No chain was found.");
    }

    await verifyTokenOwnership({
      address: address,
      chainId: chain.id,
      contractAddress: contractAddress,
      tokenId: tokenId,
      tokenType: tokenType,
    })
      .then((verification) => {
        if (!verification.isOwner) {
          toast.error(
            `The token does not belong to the address: ${address.getEllipsedAddress()}`,
          );
          throw new Error("The token does not belong to the address");
        } else if (verification && verification.isOwner) {
          addTokenToTokensList({
            contractAddress: contractAddress,
            tokenId: tokenId,
            tokenType: tokenType,
            balance: verification.erc20Balance ?? 0n,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <div className="">What kind of token you want to add?</div>
        <div className="flex justify-between gap-3 ">
          <button
            className={cc([
              "w-full border border-[#353836] rounded-lg py-3 pl-3 pr-4 text-start dark:bg-[#282B29]",
              tokenType === TokenType.ERC20
                ? "dark:bg-[#ddf23d] bg-[#ddf23d] p-medium-2"
                : "dark:p-medium-2-dark dark:hover:bg-[#353836] hover:bg-[#35383617]",
            ])}
            onClick={() => {
              setTokenType(TokenType.ERC20);
            }}
          >
            ERC20
          </button>
          <button
            className={cc([
              "w-full  border border-[#353836] rounded-lg py-3 pl-3 pr-4 text-start dark:bg-[#282B29]",
              tokenType === TokenType.ERC721
                ? "dark:bg-[#ddf23d] bg-[#ddf23d] p-medium-2"
                : "dark:p-medium-2-dark dark:hover:bg-[#353836] hover:bg-[#35383617]",
            ])}
            onClick={() => {
              setTokenType(TokenType.ERC721);
            }}
          >
            ERC721
          </button>
        </div>
      </div>
      <div>
        {tokenType === TokenType.ERC20 ? (
          <div className="flex flex-col gap-2">
            <div className="dark:p-small-dark p-small-variant-black">
              Contract address
            </div>
            <div>
              <input
                onChange={(e) => setContractAddress(e.target.value)}
                className="w-full p-3 dark:bg-[#282a29] border border-[#353836] rounded-lg h-[44px]"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="dark:p-small-dark p-small-variant-black">
                Contract address
              </div>
              <div>
                <input
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="w-full p-3 dark:bg-[#282a29] border border-[#353836] rounded-lg h-[44px]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="dark:p-small-dark p-small-variant-black ">
                Token ID
              </div>
              <div>
                <input
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full p-3 dark:bg-[#282a29] border border-[#353836] rounded-lg h-[44px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex h-[36px]">
        <button
          onClick={addTokenCard}
          className="bg-[#DDF23D] hover:bg-[#aabe13] w-full dark:shadow-add-manually-button py-2 px-4 rounded-[10px] p-medium-bold-variant-black"
        >
          Add token
        </button>
      </div>
    </div>
  );
};

const AddTokenOrSwapManuallyModalConfig = (
  variant: AddTokenOrSwapManuallyModalVariant,
  forWhom: ForWhom,
) => {
  const configs: Record<AddTokenOrSwapManuallyModalVariant, AddManuallyConfig> =
    {
      [AddTokenOrSwapManuallyModalVariant.SWAP]: {
        header: "Add swap manually",
        body: <SwapBody />,
      },
      [AddTokenOrSwapManuallyModalVariant.TOKEN]: {
        header: "Add token",
        body: <TokenBody forWhom={forWhom} />,
      },
    };

  return configs[variant] || <></>;
};

export const AddTokenOrSwapManuallyModal = ({
  variant = AddTokenOrSwapManuallyModalVariant.TOKEN,
  forWhom,
  onClose,
  open,
}: AddManuallyProps) => {
  const modalConfig = AddTokenOrSwapManuallyModalConfig(variant, forWhom);

  return (
    <SwapModalLayout
      toggleCloseButton={{ open, onClose }}
      body={modalConfig.body}
      text={{ title: modalConfig.header }}
    />
  );
};

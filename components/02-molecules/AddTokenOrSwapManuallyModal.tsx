import { ForWhom } from "@/components/03-organisms";
import {
  OffersContext,
  SwapContext,
  SwapModalLayout,
} from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  ERC20,
  ERC721,
  EthereumAddress,
  Token,
  TokenType,
} from "@/lib/shared/types";
import { verifyTokenOwnership } from "@/lib/service/verifyTokenOwnership";
import { ShelfContext } from "@/lib/client/contexts/ShelfContext";
import { getSwap } from "@/lib/service/getSwap";
import { Swap } from "@/lib/client/swap-utils";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import {
  decodeConfig,
  retrieveDataFromTokensArray,
} from "@/lib/client/blockchain-utils";
import { PopulatedSwapOfferInterface } from "@/lib/client/offers-utils";
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
  const [swapId, setSwapId] = useState<bigint>(0n);
  const { chain } = useNetwork();
  let swapBelongsToAuthUser: boolean;
  const { setTokensList, tokensList } = useContext(OffersContext);

  const { authenticatedUserAddress } = useAuthenticatedUser();

  if (!authenticatedUserAddress?.address) {
    return null;
  }

  let chainId: number | undefined = undefined;

  if (typeof chain?.id != "undefined") {
    chainId = chain?.id;
  }

  if (!chainId) {
    toast.error("Wallet not connected to any chain");
  }

  const verifySwapBelongsToAuthUser = async (swap: Swap): Promise<boolean> => {
    const bidingAddressAndExpiryData = await decodeConfig({
      config: BigInt(swap.config),
    });

    if (swap.owner === ADDRESS_ZERO) {
      toast.error("Swap ID doesn't exist. Please check the given ID");
    } else if (swap.owner !== ADDRESS_ZERO) {
      toast.success("Searching for swap...");
      if (
        swap.owner.toUpperCase() ===
        authenticatedUserAddress.address.toUpperCase()
      ) {
        swapBelongsToAuthUser = true;
      } else if (bidingAddressAndExpiryData.allowed === ADDRESS_ZERO) {
        swapBelongsToAuthUser = true;
      } else {
        swapBelongsToAuthUser = false;
      }
    }
    return swapBelongsToAuthUser;
  };

  const addSwapToTokensList = async (swapArray: Swap) => {
    const askedTokensWithData = await retrieveDataFromTokensArray(
      swapArray.asking,
    );
    const bidedTokensWithData = await retrieveDataFromTokensArray(
      swapArray.biding,
    );

    const bidingAddressAndExpiryData = await decodeConfig({
      config: BigInt(swapArray.config),
    });

    const formattedTokens: PopulatedSwapOfferInterface = {
      id: String(swapId),
      status: "",
      expiryDate: BigInt(bidingAddressAndExpiryData.expiry),
      ask: {
        address: new EthereumAddress(swapArray.owner),
        tokens: askedTokensWithData,
      },
      bid: {
        address: new EthereumAddress(bidingAddressAndExpiryData.allowed),
        tokens: bidedTokensWithData,
      },
    };

    // const tokensListResponse = tokensList.filter((token) => {
    //   token === formattedTokens;
    // });

    // console.log("tokensListResponse", tokensListResponse);

    setTokensList([...tokensList, formattedTokens]);

    return swapArray;
  };

  const addSwapId = async () => {
    if (!authenticatedUserAddress?.address) {
      toast.error("No wallet connected");
      return;
    }
    if (!swapId) {
      toast.error("No swap ID provided to be added");
      return;
    }
    if (!chain) {
      toast.error("Wallet not connected to any chain");
      return;
    }
    await getSwap(swapId, chain.id).then(async (swap: any) => {
      await verifySwapBelongsToAuthUser(swap).then(
        (swapBelongsToAuthUser: boolean) => {
          if (swapBelongsToAuthUser) {
            addSwapToTokensList(swap);
          }
        },
      );
    });

    return <></>;
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <div className="dark:p-small-dark p-small-variant-black">Swap ID</div>
        <div>
          <input
            onChange={(e) => setSwapId(BigInt(e.target.value))}
            className="w-full p-3 dark:bg-[#282a29] border border-[#353836] focus-visible:outline-[#DDF23D] rounded-lg h-[44px]"
          />
        </div>
      </div>
      <div className="flex h-[36px]">
        <button
          onClick={addSwapId}
          className="bg-[#DDF23D] hover:bg-[#aabe13] w-full dark:shadow-add-manually-button py-2 px-4 rounded-[10px] p-medium-bold-variant-black"
        >
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
    tokenName: string;
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
    if (forWhom === ForWhom.Yours) {
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
    if (forWhom === ForWhom.Yours) {
      if (token.tokenType === TokenType.ERC20 && token.balance) {
        const tokenERC20: ERC20 = {
          name: token.tokenName,
          contract: token.contractAddress,
          rawBalance: token.balance,
          tokenType: token.tokenType,
        };

        verifyTokenAlreadyInTokenList(tokenERC20).then((tokenAlreadyInList) => {
          if (tokenAlreadyInList) {
            toast.error("Token ERC20 already in the Token List");
          } else {
            setYourManuallyAddedTokensList([tokenERC20]);
            toast.success("Token ERC20 added in the Token List");
          }
        });
      } else if (token.tokenType === TokenType.ERC721) {
        const tokenERC721: ERC721 = {
          name: token.tokenName,
          contract: token.contractAddress,
          id: token.tokenId,
          tokenType: token.tokenType,
        };
        verifyTokenAlreadyInTokenList(tokenERC721).then(
          (tokenAlreadyInList) => {
            if (tokenAlreadyInList) {
              toast.error("Token ERC721 already in the Token List");
            } else {
              setYourManuallyAddedTokensList([tokenERC721]);
              toast.success("Token ERC721 added in the Token List");
            }
          },
        );
      }
    } else if (forWhom === ForWhom.Their) {
      if (token.tokenType === TokenType.ERC20 && token.balance) {
        const tokenERC20: ERC20 = {
          name: token.tokenName,
          contract: token.contractAddress,
          rawBalance: token.balance,
          tokenType: token.tokenType,
        };

        verifyTokenAlreadyInTokenList(tokenERC20).then((tokenAlreadyInList) => {
          if (tokenAlreadyInList) {
            toast.error("Token ERC20 already in the Token List");
          } else {
            setTheirManuallyAddedTokensList([tokenERC20]);
            toast.success("Token ERC20 added in Token List");
          }
        });
      } else if (token.tokenType === TokenType.ERC721) {
        const tokenERC721: ERC721 = {
          name: token.tokenName,
          contract: token.contractAddress,
          id: token.tokenId,
          tokenType: token.tokenType,
        };

        verifyTokenAlreadyInTokenList(tokenERC721).then(
          (tokenAlreadyInList) => {
            if (tokenAlreadyInList) {
              toast.error("Token ERC721 already in the Token List");
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
      forWhom === ForWhom.Yours
        ? authenticatedUserAddress
        : validatedAddressToSwap;

    if (!address) {
      toast.error("No valid address provided");
      return;
    }
    if (!contractAddress) {
      toast.error("No contract address provided");
      return;
    } else if (isAddress(contractAddress) === false) {
      toast.error("Invalid contract address");
      return;
    }
    if (!chain) {
      toast.error("Wallet not connected to any chain");
      return;
    }

    await verifyTokenOwnership({
      address: address,
      chainId: chain.id,
      contractAddress: `0x${contractAddress}`,
      tokenId: tokenId,
      tokenType: tokenType,
    })
      .then((verification) => {
        if (!verification.isOwner) {
          toast.error(
            `This token doesn't belong to the address: ${address.getEllipsedAddress()}`,
          );
        } else if (verification && verification.isOwner) {
          addTokenToTokensList({
            tokenName: verification.name,
            contractAddress: `0x${contractAddress}`,
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
                className="w-full p-3 dark:bg-[#282a29] border border-[#353836] focus-visible:outline-[#DDF23D] rounded-lg h-[44px]"
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
                  className="w-full p-3 dark:bg-[#282a29] border border-[#353836] focus-visible:outline-[#DDF23D] rounded-lg h-[44px]"
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
                  className="w-full p-3 dark:bg-[#282a29] border border-[#353836] focus-visible:outline-[#DDF23D] rounded-lg h-[44px]"
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

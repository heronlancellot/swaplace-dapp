import { ERC20, ERC721 } from "@/lib/client/constants";
import React, { useContext, useEffect, useState } from "react";
import { SwapContext } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress } from "@/lib/shared/types";
import cc from "classcat";
import toast from "react-hot-toast";

interface ITokenCard {
  erc721Data?: ERC721;
  erc20Data?: ERC20;
  ownerAddress: string | null;
  onClickAction?: NftCardActionType;
  withSelectionValidation?: boolean;
  styleType?: NftCardStyleType;
}

/**
 *
 * This component receives the data of an token and create a card
 *
 * @returns TokenCard
 */

export enum NftCardActionType {
  "SELECT_NFT_FOR_SWAP",
  "SHOW_NFT_DETAILS",
  "NFT_ONCLICK",
}

export enum NftCardStyleType {
  "SMALL",
  "NORMAL",
  "LARGE",
}

export const TokenCard = ({
  erc721Data,
  erc20Data,
  ownerAddress,
  withSelectionValidation = true,
  onClickAction = NftCardActionType.SELECT_NFT_FOR_SWAP,
  styleType,
}: ITokenCard) => {
  if (!erc721Data || !erc721Data.id || !erc721Data.contract || !ownerAddress) {
    return null;
  }

  if (erc20Data) {
    console.log(erc20Data);
  }

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { setNftAuthUser, setNftInputUser, nftAuthUser, nftInputUser } =
    useContext(SwapContext);
  const [currentNftIsSelected, setCurrentNftIsSelected] = useState(false);

  const setNftAsActiveOne = () => {
    if (onClickAction === NftCardActionType.SELECT_NFT_FOR_SWAP) {
      const ownerEthAddress = new EthereumAddress(ownerAddress);

      if (authenticatedUserAddress?.equals(ownerEthAddress)) {
        const isSelected = nftAuthUser.some(
          (selectedNft) => selectedNft.id === erc721Data.id,
        );

        if (isSelected) {
          setNftAuthUser((prevNftAuthUser) =>
            prevNftAuthUser.filter(
              (selectedNft) => selectedNft.id !== erc721Data.id,
            ),
          );
        } else {
          setNftAuthUser((prevNftAuthUser) => [...prevNftAuthUser, erc721Data]);
        }
      } else {
        const isSelected = nftInputUser.some(
          (selectedNft) => selectedNft.id === erc721Data.id,
        );

        if (isSelected) {
          setNftInputUser((prevNftInputUser) =>
            prevNftInputUser.filter(
              (selectedNft) => selectedNft.id !== erc721Data.id,
            ),
          );
        } else {
          setNftInputUser((prevNftInputUser) => [
            ...prevNftInputUser,
            erc721Data,
          ]);
        }
      }
    } else if (onClickAction === NftCardActionType.SHOW_NFT_DETAILS) {
      navigator.clipboard.writeText(JSON.stringify(erc721Data));
      toast.success("NFT data copied to your clipboard");
    } else if (onClickAction === NftCardActionType.NFT_ONCLICK) {
      () => {};
    }
  };

  useEffect(() => {
    const currentNftIsFromAuthedUser = authenticatedUserAddress?.equals(
      new EthereumAddress(ownerAddress),
    );

    if (currentNftIsFromAuthedUser) {
      setCurrentNftIsSelected(
        nftAuthUser.some((selectedNft) => selectedNft.id === erc721Data.id),
      );
    } else {
      setCurrentNftIsSelected(
        nftInputUser.some((selectedNft) => selectedNft.id === erc721Data.id),
      );
    }
  }, [
    authenticatedUserAddress,
    ownerAddress,
    nftAuthUser,
    nftInputUser,
    erc721Data,
  ]);

  const [couldntLoadNftImage, setCouldntLoadNftImage] = useState(false);
  const handleImageLoadError = () => {
    setCouldntLoadNftImage(true);
  };

  useEffect(() => {
    setCouldntLoadNftImage(false);
  }, [erc721Data]);

  const ButtonLayout = (children: React.ReactNode) => {
    return (
      <button
        onClick={setNftAsActiveOne}
        className={cc([
          styleType === NftCardStyleType.SMALL
            ? "card-nft-small"
            : styleType === NftCardStyleType.LARGE
            ? "card-nft-large"
            : "card-nft",
          {
            "border-green-500": currentNftIsSelected && withSelectionValidation,
          },
        ])}
      >
        {currentNftIsSelected && withSelectionValidation && (
          <div className="absolute left-0 top-0 w-full h-full bg-green-500 rounded-xl opacity-50 z-20"></div>
        )}
        {children}
      </button>
    );
  };

  return erc721Data.metadata?.image && !couldntLoadNftImage ? (
    <>
      {ButtonLayout(
        <img
          onError={handleImageLoadError}
          src={erc721Data.metadata?.image}
          alt={erc721Data.metadata?.name}
          className="static z-10 w-full overflow-y-auto rounded-xl"
        />,
      )}
    </>
  ) : erc721Data.metadata?.name ? (
    <>
      {ButtonLayout(
        <div className="text-center text-[10px] mt-2 font-medium max-h-[40px] oveflow-y-scroll">
          {erc721Data.metadata?.name}
        </div>,
      )}
    </>
  ) : erc721Data.contract.name && erc721Data.id.tokenId ? (
    <>
      {ButtonLayout(
        <div className="text-center text-[10px] mt-2 font-medium max-h-[40px] oveflow-y-scroll">
          {erc721Data.metadata?.name}
        </div>,
      )}
    </>
  ) : erc721Data.contractMetadata?.name && erc721Data.id.tokenId ? (
    <>
      {ButtonLayout(
        <div className="text-center text-[10px] mt-2 font-medium max-h-[40px] oveflow-y-scroll ">
          {erc721Data.contractMetadata?.name}
        </div>,
      )}
    </>
  ) : null;
};

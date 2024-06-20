import { ForWhom } from "@/components/03-organisms";
import {
  AddTokenCardManually,
  TokenAmountSelectionModal,
  TokenCard,
  TokenCardActionType,
  TokenCardStyleType,
} from "@/components/02-molecules";
import { TokenCardsPlaceholder } from "@/components/01-atoms";
import { ERC20, EthereumAddress, Token } from "@/lib/shared/types";
import { EMPTY_ERC_20_BALANCE } from "@/lib/client/blockchain-utils";
import { useState } from "react";
import toast from "react-hot-toast";

export interface TokensListProps {
  tokensList: Token[];
  ownerAddress: EthereumAddress | null;
  withSelectionValidation?: boolean;
  withPlaceholders?: boolean;
  withAddTokenCard?: boolean;
  mobileTotalCards?: number;
  tabletTotalCards?: number;
  desktopTotalCards?: number;
  wideScreenTotalCards?: number;
  confirmationModalTotalSquares?: number;

  /* 
    When true, instead of displaying an ERC20 Token balance
    the TokenCard will display the ERC20 Token amount 
    selected by the user for the swap transaction
  */
  displayERC20TokensAmount?: boolean;
  tokenCardStyleType?: TokenCardStyleType;
  tokenCardClickAction?: TokenCardActionType;
  variant: ForWhom;
  gridClassNames?: string;
  isToken3D?: boolean; // If true, the token card will be displayed in 3D using the AtroposLibrary
}

/**
 * Renders a list of tokens associated with a user's account.
 *
 * This component allows users to view a list of tokens associated with a specific account.
 * It provides flexibility in displaying tokens based on various parameters and screen sizes.
 * Users can interact with individual tokens, including selecting tokens for swapping and viewing token amounts.
 * Additionally, the component supports the addition of custom styling and actions for token cards.
 *
 **/

export const TokensList = ({
  tokensList,
  ownerAddress,
  mobileTotalCards,
  tabletTotalCards,
  desktopTotalCards,
  wideScreenTotalCards,
  confirmationModalTotalSquares = 0,
  withPlaceholders = true,
  withAddTokenCard = true,
  withSelectionValidation = true,
  displayERC20TokensAmount = false,
  variant = ForWhom.Yours,
  tokenCardStyleType = TokenCardStyleType.NORMAL,
  tokenCardClickAction = TokenCardActionType.SELECT_TOKEN_FOR_SWAP,
  gridClassNames = "w-full h-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-3",
  isToken3D = false,
}: TokensListProps) => {
  const [selectTokenAmountOf, setSelectTokenAmountOf] =
    useState<EthereumAddress | null>(null);
  const [selectTokenAmountFor, setSelectTokenAmountFor] =
    useState<Token | null>(null);

  const openTokenAmountSelectionModal = (
    owner: EthereumAddress,
    token: Token,
  ) => {
    toast("You have selected one ERC20 token!", {
      icon: "⬇️",
    });

    setSelectTokenAmountFor(token);
    setSelectTokenAmountOf(owner);
  };

  const onCloseModal = () => {
    setSelectTokenAmountFor(null);
    setSelectTokenAmountOf(null);
  };

  /* Filter TokenList so that TokenCard receives the filtered array and does not display tokens with a zero balance on the screen */
  tokensList = tokensList.filter(
    (token) => (token as ERC20).rawBalance !== EMPTY_ERC_20_BALANCE,
  );

  const placeholders = withPlaceholders
    ? TokenCardsPlaceholder({
        totalCardsLength: withAddTokenCard
          ? tokensList.length + 1 // Removes one empty square, so there is space for addTokenSquare
          : tokensList.length, // Removes one empty square, so there is space for addTokenSquare
        mobileTotalSquares: mobileTotalCards,
        tabletTotalSquares: tabletTotalCards,
        desktopTotalSquares: desktopTotalCards,
        wideScreenTotalSquares: wideScreenTotalCards,
        confirmationModalTotalSquares: confirmationModalTotalSquares,
        styleType: tokenCardStyleType,
      })
    : [<></>];
  const tokenCards = tokensList.map((token: Token, index) => (
    <TokenCard
      key={index}
      styleType={tokenCardStyleType}
      onClickAction={tokenCardClickAction}
      displayERC20TokensAmount={displayERC20TokensAmount}
      openTokenAmountSelectionModal={openTokenAmountSelectionModal}
      withSelectionValidation={withSelectionValidation}
      ownerAddress={ownerAddress}
      tokenData={token}
      isToken3D={isToken3D}
    />
  ));

  const addTokenSquare = AddTokenCardManually({ forWhom: variant });
  const allSquares = withAddTokenCard
    ? [...tokenCards, addTokenSquare, ...placeholders]
    : [...tokenCards, ...placeholders];

  const Layout = (squares: JSX.Element[]) => {
    return (
      <div className={gridClassNames}>
        {squares.map((square, index) => {
          return <div key={index}>{square}</div>;
        })}
        <TokenAmountSelectionModal
          owner={selectTokenAmountOf}
          token={selectTokenAmountFor}
          onCloseModal={onCloseModal}
        />
      </div>
    );
  };

  return Layout(allSquares);
};

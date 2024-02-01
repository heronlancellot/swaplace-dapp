import { ERC20, ERC721, Token } from "@/lib/client/constants";
import { TokenCard } from "@/components/02-molecules";
import { EmptyTokensCards } from "@/components/01-atoms";
import { useEffect } from "react";

/**
 *
 * This component receives the data of multiple Tokens and create its cards
 *
 * @returns TokensList
 */

export const TokensList = ({ fungibleToken, nonFungibleToken }: Token) => {
  const emptySquares = EmptyTokensCards(
    nonFungibleToken.data.length + fungibleToken.data.length,
    15,
    30,
    30,
    30,
  );

  const erc721Squares = nonFungibleToken.data.map((nft: ERC721, index) => (
    <div key={`nft-${index}`}>
      <TokenCard
        ownerAddress={nonFungibleToken.ownerAddress}
        erc721Data={nft}
      />
    </div>
  ));

  const erc20Squares = fungibleToken.data.map((token: ERC20, index) => (
    <div key={`token-${index}`}>
      <TokenCard ownerAddress={fungibleToken.ownerAddress} erc20Data={token} />
    </div>
  ));

  let allSquares = [...erc721Squares, ...erc20Squares, ...emptySquares];

  useEffect(() => {
    allSquares = [...erc721Squares, ...erc20Squares, ...emptySquares];
  }, [fungibleToken, nonFungibleToken]);

  return (
    <div className="w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-3 py-6 px-4">
      {allSquares}
    </div>
  );
};

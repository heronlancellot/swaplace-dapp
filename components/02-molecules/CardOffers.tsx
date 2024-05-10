import { CreateTokenOfferVariant, ForWhom } from "@/components/03-organisms";
import {
  SwapModalAction,
  TokenCardActionType,
  TokenCardStyleType,
  TokensList,
  UserOfferInfo,
  UserOfferVariant,
} from "@/components/02-molecules";
import { TokenCardProperties } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { SwapContext, OffersContext } from "@/lib/client/contexts";
import { useContext } from "react";

interface CardOffersProps {
  address: EthereumAddress | null;
  variant?: CreateTokenOfferVariant;
  swapModalAction: SwapModalAction;
}

interface CardOfferSConfig {
  body: React.ReactNode;
}

export const CardOffers = ({
  address,
  swapModalAction,
  variant = CreateTokenOfferVariant.HORIZONTAL,
}: CardOffersProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { authenticatedUserTokensList, searchedUserTokensList } =
    useContext(SwapContext);

  const { swapOfferToAccept } = useContext(OffersContext);

  const tokenShelfVariant = authenticatedUserAddress?.equals(address)
    ? ForWhom.Yours
    : ForWhom.Their;
  const tokensOfferFor: Record<ForWhom, Token[]> = {
    [ForWhom.Yours]:
      swapModalAction === SwapModalAction.CREATE_SWAP
        ? searchedUserTokensList
        : swapOfferToAccept?.bidderTokens.tokens ?? [],
    [ForWhom.Their]:
      swapModalAction === SwapModalAction.CREATE_SWAP
        ? authenticatedUserTokensList
        : swapOfferToAccept?.askerTokens.tokens ?? [],
  };

  const HorizontalVariant = (address: EthereumAddress | null) => {
    if (!address) return null;

    return (
      <div className="md:p-4">
        <div className="flex flex-col justify-content gap-4 md:w-[326px]">
          <UserOfferInfo address={address} />
          <TokensList
            ownerAddress={address}
            withAddTokenCard={false}
            withPlaceholders={false}
            variant={tokenShelfVariant}
            withSelectionValidation={false}
            tokenCardClickAction={TokenCardActionType.NO_ACTION}
            tokensList={tokensOfferFor[tokenShelfVariant]}
            tokenCardStyleType={TokenCardStyleType.MEDIUM}
          />
          <div>
            <TokenCardProperties properties={{ amount: 2, value: 0.056 }} />
          </div>
        </div>
      </div>
    );
  };

  const VerticalVariant = (address: EthereumAddress | null) => {
    if (!address) return null;

    return (
      <div className="flex flex-col justify-content gap-4 md:w-[400px] overflow-x-hidden no-scrollbar">
        <UserOfferInfo address={address} variant={UserOfferVariant.SECONDARY} />
        <TokensList
          ownerAddress={address}
          withAddTokenCard={false}
          withPlaceholders={true}
          variant={tokenShelfVariant}
          displayERC20TokensAmount={true}
          withSelectionValidation={false}
          tokenCardClickAction={TokenCardActionType.NO_ACTION}
          tokensList={tokensOfferFor[tokenShelfVariant]}
          confirmationModalTotalSquares={5}
          tokenCardStyleType={TokenCardStyleType.MEDIUM}
          gridClassNames="grid md:grid-cols-5 md:gap-3"
        />
      </div>
    );
  };

  const CardOfferVariantsConfig: Record<
    CreateTokenOfferVariant,
    CardOfferSConfig
  > = {
    [CreateTokenOfferVariant.HORIZONTAL]: {
      body: HorizontalVariant(address),
    },
    [CreateTokenOfferVariant.VERTICAL]: {
      body: VerticalVariant(address),
    },
  };

  return <>{CardOfferVariantsConfig[variant].body}</>;
};

import { TokensSwapList } from "./TokensSwapList";
import { ForWhom } from "../03-organisms";
import {
  TokenCardActionType,
  TokenCardStyleType,
  UserOfferInfo,
  UserOfferVariant,
} from "@/components/02-molecules";
import { TokenCardProperties } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { SwapNativeEther } from "@/lib/client/swap-utils";
import { PopulatedSwapOfferCard } from "@/lib/client/offers-utils";

interface SwapOfferCardProps {
  swap?: PopulatedSwapOfferCard;
  address: EthereumAddress | null;
  tokens?: Token[];
  nativeEther?: SwapNativeEther;
}

/**
 * Renders a swap offer card component.
 * OffersPage.tsx uses the SwapOffers and this component to render the swap offer cards.
 */

export const SwapOfferCard = ({
  swap,
  address,
  tokens,
  nativeEther,
}: SwapOfferCardProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const tokenShelfVariant = authenticatedUserAddress?.equals(address)
    ? ForWhom.Yours
    : ForWhom.Their;

  return (
    <div className="md:p-4">
      <div className="flex flex-col justify-between h-full gap-4 md:w-[326px]">
        <UserOfferInfo
          address={address}
          variant={UserOfferVariant.SWAP_CREATED}
          nativeEther={nativeEther}
          swap={swap}
        />
        <div className="mb-auto max-h-[100px] overflow-auto no-scrollbar">
          <TokensSwapList
            ownerAddress={authenticatedUserAddress}
            withAddTokenCard={false}
            withPlaceholders={true}
            variant={tokenShelfVariant}
            withSelectionValidation={false}
            tokenCardClickAction={TokenCardActionType.NO_ACTION}
            tokensList={tokens ?? []}
            tokenCardStyleType={TokenCardStyleType.MEDIUM}
          />
        </div>

        <TokenCardProperties properties={{ amount: tokens?.length ?? 0 }} />
      </div>
    </div>
  );
};

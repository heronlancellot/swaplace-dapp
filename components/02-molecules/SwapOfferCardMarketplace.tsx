import {
  TokensSwapListMarketplace,
  UserOfferInfo,
  UserOfferVariant,
} from "@/components/02-molecules";
import { TokenCardProperties } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { ForWhom } from "@/lib/client/constants";
import { TokenCardActionType, TokenCardStyleType } from "@/lib/client/ui-utils";

interface SwapOfferCardProps {
  address: EthereumAddress | null;
  tokens?: Token[];
}

export const SwapOfferCardMarketplace = ({
  address,
  tokens,
}: SwapOfferCardProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const tokenShelfVariant = authenticatedUserAddress?.equals(address)
    ? ForWhom.Yours
    : ForWhom.Their;

  return (
    <div className="md:p-4">
      <div className="flex flex-col justify-between h-full gap-4 md:w-[326px]">
        <UserOfferInfo address={address} variant={UserOfferVariant.SECONDARY} />
        <div className="mb-auto max-h-[100px] overflow-auto no-scrollbar">
          <TokensSwapListMarketplace
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

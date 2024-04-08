import { TokensSwapList } from "./TokensSwapList";
import { ForWhom } from "../03-organisms";
import {
  TokenCardActionType,
  TokenCardStyleType,
  UserOfferInfo,
} from "@/components/02-molecules";
import { TokenCardProperties } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress, Token } from "@/lib/shared/types";

interface SwapOfferCardProps {
  address: EthereumAddress | null;
  tokens?: Token[];
}

export const SwapOfferCard = ({ address, tokens }: SwapOfferCardProps) => {
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const tokenShelfVariant = authenticatedUserAddress?.equals(address)
    ? ForWhom.Your
    : ForWhom.Their;

  return (
    <div className="md:p-4">
      <div className="flex flex-col justify-between h-full gap-4 md:w-[326px]">
        <UserOfferInfo address={address} />
        <div className="mb-auto max-h-[100px] overflow-auto">
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

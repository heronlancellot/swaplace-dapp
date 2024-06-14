import { ENSAvatar, ENSAvatarSize } from "@/components/01-atoms";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import { SwapContext } from "@/lib/client/contexts";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useEnsData } from "@/lib/client/hooks/useENSData";
import { isInRange } from "@/lib/client/utils";
import { EthereumAddress } from "@/lib/shared/types";
import { useContext, useEffect, useState } from "react";
import { formatEther } from "viem";
import { useNetwork } from "wagmi";

export enum UserOfferVariant {
  DEFAULT = "default",
  SECONDARY = "secondary",
}
interface UserOfferInfoProps {
  address: EthereumAddress | null;
  variant?: UserOfferVariant;
}

export const UserOfferInfo = ({
  address,
  variant = UserOfferVariant.DEFAULT,
}: UserOfferInfoProps) => {
  const { primaryName } = useEnsData({
    ensAddress: address,
  });
  const { etherValue, etherRecipient } = useContext(SwapContext);
  const [isMounted, setIsMounted] = useState(false);
  const { chain } = useNetwork();
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const displayAddress =
    address?.address === ADDRESS_ZERO
      ? "Acceptor"
      : address?.getEllipsedAddress();

  useEffect(() => {
    /* Only render the chain symbol after the component has mounted */
    setIsMounted(true);
  }, []);
  return variant == UserOfferVariant.DEFAULT ? (
    <div>
      <div className="flex gap-2">
        <div>
          {address && (
            <ENSAvatar avatarENSAddress={address} size={ENSAvatarSize.SMALL} />
          )}
        </div>
        <div className="flex ">
          {primaryName ? <p>{primaryName}</p> : <p>{displayAddress}</p>}
        </div>
      </div>
    </div>
  ) : variant === UserOfferVariant.SECONDARY ? (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div>
            {address && (
              <ENSAvatar
                avatarENSAddress={address}
                size={ENSAvatarSize.SMALL}
              />
            )}
          </div>
          <div className="flex ">
            {primaryName ? (
              <p>{primaryName} gets</p>
            ) : (
              <p>{displayAddress} gets</p>
            )}
          </div>
        </div>
        {address?.address !== authenticatedUserAddress?.address &&
        etherRecipient === 0 ? (
          <div className="flex-row flex items-center gap-1">
            <p className="flex dark:p-small-dark p-small-variant-black">
              {formatEther(etherValue).toString()}
            </p>
            <p className="flex dark:p-small-dark p-small-variant-black">
              {isMounted && chain ? chain.nativeCurrency.symbol : ""}
            </p>
          </div>
        ) : address?.address === authenticatedUserAddress?.address &&
          isInRange(etherRecipient, 1, 255) ? (
          <div className="flex-row flex items-center gap-1">
            <p className="flex dark:p-small-dark p-small-variant-black">
              {formatEther(etherValue).toString()}
            </p>
            <p className="flex dark:p-small-dark p-small-variant-black">
              {isMounted && chain ? chain.nativeCurrency.symbol : ""}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

import { EthereumAddress } from "@/lib/shared/types";
import { useEffect, useState } from "react";

export enum ENSAvatarQueryStatus {
  LOADING,
  SUCCESS,
  ERROR,
}

interface Props {
  ensAddress: EthereumAddress | null;
}

export const useEnsData = ({ ensAddress }: Props) => {
  const [primaryName, setPrimaryName] = useState<string | null | undefined>(
    undefined,
  );
  const [avatarQueryStatus, setAvatarQueryStatus] =
    useState<ENSAvatarQueryStatus>(ENSAvatarQueryStatus.LOADING);

  useEffect(() => {
    if (ensAddress) {
      setAvatarQueryStatus(ENSAvatarQueryStatus.LOADING);

      fetch(`/api/ens?address=${ensAddress}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data && data.ens_primary) {
            setPrimaryName(data.ens_primary);
            setAvatarQueryStatus(ENSAvatarQueryStatus.SUCCESS);
          } else {
            setAvatarQueryStatus(ENSAvatarQueryStatus.ERROR);
            setPrimaryName(null);
          }
        })
        .catch(() => {
          setAvatarQueryStatus(ENSAvatarQueryStatus.ERROR);
          setPrimaryName(null);
        });
    } else {
      setPrimaryName(null);
    }
  }, [ensAddress]);

  return {
    primaryName,
    avatarQueryStatus: avatarQueryStatus,
    avatarSrc: primaryName
      ? `https://metadata.ens.domains/mainnet/avatar/${primaryName}`
      : null,
  };
};

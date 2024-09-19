/**
 * @deprecated This hook is deprecated because the searched ENS address
 * sometimes returns incorrect results, which negatively impacts the user flow
 * of the application.
 *
 * The `useEnsData` hook is responsible for fetching and managing Ethereum Name Service (ENS)
 * data based on the provided ENS address. It fetches the primary ENS name and avatar status
 * for the given address.
 *
 * The hook uses the `useEffect` hook to trigger the data fetching process whenever the
 * `ensAddress` changes. It updates the state variables `primaryName` and `avatarQueryStatus`
 * based on the fetched data or any errors encountered during the fetch process.
 *
 * @param {Props} props - The properties object.
 * @param {EthereumAddress | null} props.ensAddress - The ENS address to fetch the data for.
 *
 * @returns {object} An object containing the primary ENS name, avatar query status, and avatar source URL.
 */

/**
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
      console.log("ensAddress", ensAddress);

      fetch(`/api/ens?address=${ensAddress}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.ens) {
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
 */

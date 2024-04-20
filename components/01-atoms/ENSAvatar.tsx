/* eslint-disable react-hooks/exhaustive-deps */
import {
  LoadingIndicator,
  PersonIcon,
  SwapContext,
} from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  ENSAvatarQueryStatus,
  useEnsData,
} from "@/lib/client/hooks/useENSData";
import { EthereumAddress } from "@/lib/shared/types";
import cc from "classcat";
import { useContext, useEffect, useState } from "react";

export enum ENSAvatarSize {
  SMALL = "small",
  MEDIUM = "medium",
}

const ENSAvatarClassName = {
  [ENSAvatarSize.SMALL]: "ens-avatar-small",
  [ENSAvatarSize.MEDIUM]: "ens-avatar-medium",
};

interface ENSAvatarProps {
  avatarENSAddress: EthereumAddress;
  size?: ENSAvatarSize;
}

export const ENSAvatar = ({
  avatarENSAddress,
  size = ENSAvatarSize.MEDIUM,
}: ENSAvatarProps) => {
  const { avatarQueryStatus, avatarSrc, primaryName } = useEnsData({
    ensAddress: avatarENSAddress,
  });

  const { savedimageSrc, saveimageSrc } = useContext(SwapContext);
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [failedLoadingImage, setFailedLoadingImage] = useState<boolean>(false);
  useEffect(() => {
    if (avatarQueryStatus === ENSAvatarQueryStatus.SUCCESS) {
      if (avatarSrc) {
        fetch(avatarSrc)
          .then((response) => {
            if (response.ok) {
              setImageSrc(avatarSrc);
              setFailedLoadingImage(false);
              if (
                avatarENSAddress.address === authenticatedUserAddress?.address
              ) {
                saveimageSrc(avatarSrc);
              }
            } else {
              setImageSrc(null);
              setFailedLoadingImage(true);
              if (
                avatarENSAddress.address === authenticatedUserAddress?.address
              ) {
                saveimageSrc(null);
              }
            }
          })
          .catch(() => {
            setImageSrc(null);
            setFailedLoadingImage(true);
            if (
              avatarENSAddress.address === authenticatedUserAddress?.address
            ) {
              saveimageSrc(null);
            }
          });
      } else {
        setImageSrc(null);
        setFailedLoadingImage(true);
        if (avatarENSAddress.address === authenticatedUserAddress?.address) {
          saveimageSrc(null);
        }
      }
    }
  }, [avatarQueryStatus]);

  return (
    <div>
      {avatarENSAddress.address === authenticatedUserAddress?.address &&
      savedimageSrc ? (
        <img
          src={savedimageSrc}
          className={ENSAvatarClassName[size]}
          alt={`ENS Avatar for ${avatarENSAddress}`}
        />
      ) : avatarQueryStatus === ENSAvatarQueryStatus.LOADING &&
        !savedimageSrc ? (
        <div
          className={cc([
            ENSAvatarClassName[size],
            "flex justify-center items-center",
          ])}
        >
          <LoadingIndicator colors="dark:border-[#f6f6f6] border-[#212322]" />
        </div>
      ) : avatarQueryStatus === ENSAvatarQueryStatus.ERROR ||
        failedLoadingImage ? (
        <div className={ENSAvatarClassName[size]}>
          <div
            className={cc([
              ENSAvatarClassName[size] === "ens-avatar-small"
                ? "bg-[#E4E4E4] dark:bg-[#353836] p-[5px] rounded-md"
                : "w-full flex justify-center items-center h-10 w-10 rounded-[10px] bg-[#DDF23D]",
              "",
            ])}
          >
            <PersonIcon
              size={`${
                ENSAvatarClassName[size] === "ens-avatar-small" ? 14 : 20
              }`}
              className={cc([
                ENSAvatarClassName[size] === "ens-avatar-small"
                  ? "text-[#A3A9A5] dark:text-[#707572]"
                  : "text-[#a3a9a5] dark:text-[#181A19]",
              ])}
            />
          </div>
        </div>
      ) : imageSrc ? (
        <img
          src={imageSrc}
          className={ENSAvatarClassName[size]}
          alt={`ENS Avatar for ${avatarENSAddress}`}
        />
      ) : null}
    </div>
  );
};

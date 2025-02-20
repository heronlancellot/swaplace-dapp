/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingIndicator, PersonIcon } from "@/components/01-atoms";
import {
  ENSAvatarQueryStatus,
  useEnsData,
} from "@/lib/client/hooks/useENSData";
import { EthereumAddress } from "@/lib/shared/types";
import cc from "classcat";
import { useEffect, useState } from "react";

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
  const { avatarQueryStatus, avatarSrc } = useEnsData({
    ensAddress: avatarENSAddress,
  });

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
            } else {
              setImageSrc(null);
              setFailedLoadingImage(true);
            }
          })
          .catch(() => {
            setImageSrc(null);
            setFailedLoadingImage(true);
          });
      } else {
        setImageSrc(null);
        setFailedLoadingImage(true);
      }
    }
  }, [avatarQueryStatus]);

  return (
    <div>
      {avatarQueryStatus === ENSAvatarQueryStatus.LOADING ? (
        <div
          className={cc([
            ENSAvatarClassName[size],
            "flex justify-center items-center",
          ])}
        >
          <LoadingIndicator colors="dark:border-offWhite border-midnightGreen" />
        </div>
      ) : avatarQueryStatus === ENSAvatarQueryStatus.ERROR ||
        failedLoadingImage ? (
        <div className={ENSAvatarClassName[size]}>
          <div
            className={cc([
              ENSAvatarClassName[size] === "ens-avatar-small"
                ? "bg-lightSilver dark:bg-darkGray p-[5px] rounded-md"
                : "w-full flex justify-center items-center h-10 rounded-[10px] bg-yellowGreen",
              "",
            ])}
          >
            <PersonIcon
              size={`${
                ENSAvatarClassName[size] === "ens-avatar-small" ? 14 : 20
              }`}
              className={cc([
                ENSAvatarClassName[size] === "ens-avatar-small"
                  ? "text-sageGray dark:text-mediumGray"
                  : "text-sageGray dark:text-blackGreen",
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

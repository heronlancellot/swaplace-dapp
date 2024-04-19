/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingIndicator, PersonIcon } from "@/components/01-atoms";
import {
  ENSAvatarQueryStatus,
  useEnsData,
} from "@/lib/client/hooks/useENSData";
import { EthereumAddress } from "@/lib/shared/types";
import BoringAvatar from "boring-avatars";
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
  const { avatarQueryStatus, avatarSrc, primaryName } = useEnsData({
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
          <LoadingIndicator colors="dark:border-[#f6f6f6] border-[#212322]" />
        </div>
      ) : avatarQueryStatus === ENSAvatarQueryStatus.ERROR ||
        failedLoadingImage ? (
        <div className={ENSAvatarClassName[size]}>
          <div className="bg-[#E4E4E4] dark:bg-[#353836] p-[5px] rounded-md">
            <PersonIcon className="text-[#A3A9A5] dark:text-[#707572]" />
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

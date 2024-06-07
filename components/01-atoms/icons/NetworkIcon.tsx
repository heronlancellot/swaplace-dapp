import { ChainKakarotSepoliaIcon } from "./ChainKakarotSepoliaIcon";
import {
  ChainArbitrumSepoliaIcon,
  ChainBaseSepoliaIcon,
  ChainBnbIcon,
  ChainEthereumSepoliaIcon,
  ChainFujiIcon,
  ChainNetworkDefaultIcon,
  ChainOptimismIcon,
  ChainPolygonIcon,
} from "@/components/01-atoms";
import { SupportedNetworks } from "@/lib/client/constants";
import { SVGProps } from "react";

export type NetworkVariants = SupportedNetworks | "default";

interface NetworkIconProps {
  props?: SVGProps<SVGSVGElement>;
  variant: NetworkVariants;
}

/**
 * This component will render the network Icons
 * The variants are the Supported Networks by the dApp
 *
 * The default variant is not a supported network.
 * It's only the icon when the user is not logged into the dApp.
 *
 **/
export const NetworkIcon = ({
  variant = "default",
  props,
}: NetworkIconProps) => {
  const NetworkIcons: Partial<Record<NetworkVariants, React.ReactElement>> = {
    [SupportedNetworks.ARBITRUMSEPOLIA]: (
      <ChainArbitrumSepoliaIcon className={props?.className} />
    ),
    [SupportedNetworks.BASESEPOLIA]: (
      <ChainBaseSepoliaIcon className={props?.className} />
    ),
    [SupportedNetworks.SEPOLIA]: (
      <ChainEthereumSepoliaIcon className={props?.className} />
    ),
    [SupportedNetworks.KAKAROT_SEPOLIA]: (
      <ChainKakarotSepoliaIcon className={props?.className} />
    ),
    [SupportedNetworks.FUJI]: <ChainFujiIcon className={props?.className} />,
    [SupportedNetworks.BNB]: <ChainBnbIcon className={props?.className} />,
    [SupportedNetworks.OPTIMISM]: (
      <ChainOptimismIcon className={props?.className} />
    ),
    [SupportedNetworks.OPSEPOLIA]: (
      <ChainOptimismIcon className={props?.className} />
    ),
    [SupportedNetworks.BNBTESTNET]: (
      <ChainBnbIcon className={props?.className} />
    ),
    [SupportedNetworks.AMOY]: <ChainPolygonIcon className={props?.className} />,
    default: (
      <ChainNetworkDefaultIcon className="dark:text-[#707572] text-[#A3A9A5]" />
    ),
  };

  return NetworkIcons[variant] || <></>;
};

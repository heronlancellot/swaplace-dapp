import { ChainInfo, SupportedNetworks } from "../constants";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";

export const useSupportedNetworks = () => {
  const [isNetworkSupported, setIsNetworkSupported] = useState(true);
  const supportedNetworksId = Object.values(ChainInfo).map((net) => net.id);
  const { chain } = useNetwork();

  useEffect(() => {
    if (
      chain &&
      supportedNetworksId.includes(chain.id) &&
      (chain.id === ChainInfo[SupportedNetworks.SEPOLIA].id ||
        chain.id === ChainInfo[SupportedNetworks.KAKAROT_SEPOLIA].id)
    ) {
      setIsNetworkSupported(true);
    } else {
      setIsNetworkSupported(false);
    }
  }, [supportedNetworksId, chain]);

  return {
    isNetworkSupported,
  };
};

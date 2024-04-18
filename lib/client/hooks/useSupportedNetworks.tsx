import { ChainInfo } from "../constants";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

export const useSupportedNetworks = () => {
  const [isNetworkSupported, setIsNetworkSupported] = useState(true);
  const supportedNetworksId = Object.values(ChainInfo).map((net) => net.id);
  const { chain } = useNetwork();

  useEffect(() => {
    const test = new InjectedConnector();
    test.getProvider().then((res) => console.log("res", res));
    if (
      chain &&
      supportedNetworksId.includes(chain.id) &&
      (chain.id === 11155111 || // Hardcoded for now to accept only Sepolia for now, until we accept others chains afther alpha
        chain.id === 1802203764)
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

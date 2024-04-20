import {
  ArrowIcon,
  ArrowIconVariant,
  NetworkIcon,
  NetworkVariants,
} from "@/components/01-atoms";
import { ChainInfo, SupportedNetworks } from "@/lib/client/constants";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useSupportedNetworks } from "@/lib/client/hooks/useSupportedNetworks";
import { capitalizeFirstLetterPrhases } from "@/lib/client/utils";
import { useSwitchNetwork, sepolia, useNetwork } from "wagmi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import cc from "classcat";

interface NetworkDropdownProps {
  forAuthedUser: boolean;
}
export const NetworkDropdown = ({ forAuthedUser }: NetworkDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkText, setNetworkText] = useState<NetworkVariants>("default");
  const { switchNetwork } = useSwitchNetwork();
  const { isNetworkSupported } = useSupportedNetworks();
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!isNetworkSupported || !authenticatedUserAddress) {
      setNetworkText("default");
    } else {
      if (ChainInfo[SupportedNetworks.KAKAROT_SEPOLIA].id === chain?.id) {
        setNetworkText(SupportedNetworks.KAKAROT_SEPOLIA);
      } else if (ChainInfo[SupportedNetworks.SEPOLIA].id === chain?.id) {
        setNetworkText(SupportedNetworks.SEPOLIA);
      } else {
        setNetworkText("default");
      }
    }
  }, [authenticatedUserAddress, isNetworkSupported, chain]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownItemClick = async (networkName: NetworkVariants) => {
    try {
      let networkId;
      if (networkName === SupportedNetworks.KAKAROT_SEPOLIA) {
        networkId = 1802203764;
        await window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x6B6B7274", // Replace <chain_id> with the hexadecimal chain ID of the network
                chainName: "Kakarot", // Replace with the name of the network
                rpcUrls: [
                  "https://sepolia-rpc.kakarot.org", // Replace <rpc_url> with the RPC URL of the network
                ],
                iconUrls: [
                  "https://ipfs.io/ipfs/QmSg36ytguM4b5cjCAnSjPKDBCetDmq9yiPS5GeK19BejA/",
                ],
                nativeCurrency: {
                  name: "Kakarot", // Name of the native currency (e.g., Ether)
                  symbol: "KKT", // Symbol of the currency (e.g., ETH)
                  decimals: 18,
                },
                blockExplorerUrls: [
                  "https://etherscan.io", // Replace <explorer_url> with the URL of a block explorer for the network
                ],
              },
            ],
          })
          .then(() => {
            toast.success("Network added successfully");
            // setNetworkText(SupportedNetworks.KAKAROT);
          })
          .catch((error: any) => {
            console.error("Error adding network:", error);
          });
      } else if (networkName === SupportedNetworks.SEPOLIA) {
        // setNetworkText(SupportedNetworks.SEPOLIA);
        networkId = sepolia.id;
      }

      if (networkId) {
        await switchNetwork?.(networkId);
      } else {
        console.error("Unsupported network selected:", networkName);
      }
    } catch (error) {
      console.error("Network switch failed:", error);
    } finally {
      setIsOpen(false);
    }
  };

  interface NetworkProps {
    icon: JSX.Element;
    name: string;
  }

  /**
   * This constant represents a collection of network icons and their corresponding names.
   * It facilitates the automatic rendering of network icons and names in a select component.
   *
   * For now only SEPOLIA available
   * Each entry consists of a network icon component and its associated name.
   */
  const NetworkInfo: Partial<Record<NetworkVariants, NetworkProps>> = {
    [SupportedNetworks.KAKAROT_SEPOLIA]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.KAKAROT_SEPOLIA}
        />
      ),
      name: SupportedNetworks.KAKAROT_SEPOLIA,
    },
    [SupportedNetworks.SEPOLIA]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.SEPOLIA}
        />
      ),
      name: SupportedNetworks.SEPOLIA,
    },

    // [SupportedNetworks.OPTIMISM]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.OPTIMISM}
    //     />
    //   ),
    //   name: SupportedNetworks.OPTIMISM,
    // },
    // [SupportedNetworks.MUMBAI]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.MUMBAI}
    //     />
    //   ),
    //   name: SupportedNetworks.MUMBAI,
    // },
    // [SupportedNetworks.FUJI]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.FUJI}
    //     />
    //   ),
    //   name: SupportedNetworks.FUJI,
    // },
    // [SupportedNetworks.BNB]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.BNB}
    //     />
    //   ),
    //   name: SupportedNetworks.BNB,
    // },
    // [SupportedNetworks.BASEGOERLI]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.BASEGOERLI}
    //     />
    //   ),
    //   name: SupportedNetworks.BASEGOERLI,
    // },
    // [SupportedNetworks.ARBITRUMSEPOLIA]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.ARBITRUMSEPOLIA}
    //     />
    //   ),
    //   name: SupportedNetworks.ARBITRUMSEPOLIA,
    // },
  };

  return (
    <div className="w-full">
      <div
        className="relative"
        role="button"
        onClick={handleToggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div
          className={cc([
            "lg:max-w-[280px] max-h-[44px] rounded-xl pl-3 pr-4 dark:bg-[#212322] bg-[#F6F6F6] hover:bg-[#F0EEEE75] hover:shadow-[0_0_6px_1px_#00000014] border dark:border-[#353836] border-[#D6D5D5] hover:border-[#AABE13] dark:hover:border-[#edff6259] dark:shadow-swap-connection shadow-swap-connection-light transition duration-300 ease-in-out",
            isOpen &&
              "hover:bg-[#F0EEEE75] border-[#E4E4E4] hover:border-[#AABE13] hover:shadow-[0_0_6px_1px_#00000014] dark:border-[#DDF23D33] dark:hover:border-[#edff6259]",
          ])}
        >
          <div className="flex justify-between items-center h-[44px] lg:w-[252px]">
            <div className="flex gap-2 items-center">
              <div className="flex dark:bg-[#353836] bg-[#E4E4E4] rounded-md">
                <NetworkIcon variant={networkText} />
              </div>
              <div
                className={cc([
                  networkText === "default"
                    ? "dark:p-small p-small-dark-variant-grey"
                    : "p-small-variant-black dark:p-small-dark",
                ])}
              >
                {networkText === "default"
                  ? forAuthedUser
                    ? "Your network"
                    : "Their network"
                  : capitalizeFirstLetterPrhases(networkText)}
              </div>
            </div>
            <div>
              <ArrowIcon
                props={{ className: "dark:text-[#707572] text-[#A3A9A5]" }}
                variant={isOpen ? ArrowIconVariant.UP : ArrowIconVariant.DOWN}
              />
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="max-w-[280px]">
            <div className="absolute z-10 top-12 left-0 w-full bg-white dark:bg-[#212322] overflow-hidden border dark:border-[#505150] rounded-xl dark:shadow-swap-connection-dropwdown">
              {Object.values(NetworkInfo).map((network, index) => (
                <div
                  key={index}
                  onClick={() =>
                    handleDropdownItemClick(network.name as NetworkVariants)
                  }
                  className="gap-2 flex px-4 py-2 p-small-variant-black-2 dark:p-small-dark-variant-grey items-center hover:dark:bg-[#353836] transition-colors duration-200"
                >
                  <NetworkIcon variant={network.name as NetworkVariants} />
                  {capitalizeFirstLetterPrhases(network.name)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

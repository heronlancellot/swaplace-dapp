/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowIcon,
  ArrowIconVariant,
  NetworkIcon,
  NetworkVariants,
  Tooltip,
} from "@/components/01-atoms";
import {
  BNB_TESTNET_DATA,
  ChainInfo,
  KAKAROT_CHAIN_DATA,
  SupportedNetworks,
} from "@/lib/client/constants";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useSupportedNetworks } from "@/lib/client/hooks/useSupportedNetworks";
import { capitalizeFirstLetterPrhases } from "@/lib/client/utils";
import { SwapContext } from "@/lib/client/contexts";
import { useSwitchNetwork, useNetwork } from "wagmi";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import cc from "classcat";
import { hexToNumber } from "viem";

interface NetworkProps {
  icon: JSX.Element;
  name: SupportedNetworks;
}

export enum NetworkVariantPosition {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}

export const NetworkDropdown = ({
  forAuthedUser,
  variant = NetworkVariantPosition.HORIZONTAL,
}: {
  forAuthedUser: boolean;
  variant?: NetworkVariantPosition;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkText, setNetworkText] = useState<NetworkVariants>("default");
  const { switchNetwork } = useSwitchNetwork();
  const { isNetworkSupported } = useSupportedNetworks();
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { chain } = useNetwork();
  const { setDestinyChain, destinyChain } = useContext(SwapContext);

  useEffect(() => {
    if (!isNetworkSupported || !authenticatedUserAddress) {
      setNetworkText("default");
    } else if (chain) {
      const supportedNetworks = Object.values(SupportedNetworks);
      const matchingNetwork = supportedNetworks.find(
        (network) => ChainInfo[network]?.id === chain.id,
      );
      if (matchingNetwork) {
        setDestinyChain(matchingNetwork);
        setNetworkText(matchingNetwork);
      } else {
        setNetworkText("default");
      }
    }
  }, [authenticatedUserAddress, isNetworkSupported, chain, destinyChain]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownItemClick = async (networkName: NetworkVariants) => {
    try {
      let networkId: number;
      // As KAKAROT is not in ALCHEMY we must manually add the RPC with the data.
      // These requests check whether you already have KAKAROT in the metamask by adding it or switching it
      if (networkName === SupportedNetworks.KAKAROT_SEPOLIA) {
        networkId = hexToNumber(KAKAROT_CHAIN_DATA.chainId as `0x${string}`);
        await window.ethereum
          .request({
            method: "eth_chainId",
            params: [],
          })
          .then(async (chain: number) => {
            if (chain !== networkId) {
              await window.ethereum
                .request({
                  method: "wallet_switchEthereumChain",
                  params: [
                    {
                      chainId: KAKAROT_CHAIN_DATA.chainId,
                    },
                  ],
                })
                .catch(async () => {
                  await window.ethereum
                    .request({
                      method: "wallet_addEthereumChain",
                      params: [KAKAROT_CHAIN_DATA],
                    })
                    .then(() => {
                      toast.success("Network added successfully!");
                    })
                    .catch((error: any) => {
                      console.error("Error adding network:", error);
                    });
                });
            }
          });
      }
      // As BNBTESTNET is not in ALCHEMY we must manually add the RPC with the data.
      if (networkName === SupportedNetworks.BNBTESTNET) {
        networkId = hexToNumber(BNB_TESTNET_DATA.chainId as `0x${string}`);
        await window.ethereum
          .request({
            method: "eth_chainId",
            params: [],
          })
          .then(async (chain: number) => {
            if (chain !== networkId) {
              await window.ethereum
                .request({
                  method: "wallet_switchEthereumChain",
                  params: [
                    {
                      chainId: BNB_TESTNET_DATA.chainId,
                    },
                  ],
                })
                .catch(async () => {
                  await window.ethereum
                    .request({
                      method: "wallet_addEthereumChain",
                      params: [BNB_TESTNET_DATA],
                    })
                    .then(() => {
                      toast.success("Network added successfully!");
                    })
                    .catch((error: any) => {
                      console.error("Error adding network:", error);
                    });
                });
            }
          });
      }
      // if (networkName === SupportedNetworks.MUMBAI) {
      //   networkId = hexToNumber(POLYGON_MUMBAI_DATA.chainId as `0x${string}`);
      //   await window.ethereum
      //     .request({
      //       method: "eth_chainId",
      //       params: [],
      //     })
      //     .then(async (chain: number) => {
      //       if (chain !== networkId) {
      //         await window.ethereum
      //           .request({
      //             method: "wallet_switchEthereumChain",
      //             params: [
      //               {
      //                 chainId: POLYGON_MUMBAI_DATA.chainId,
      //               },
      //             ],
      //           })
      //           .catch(async () => {
      //             await window.ethereum
      //               .request({
      //                 method: "wallet_addEthereumChain",
      //                 params: [POLYGON_MUMBAI_DATA],
      //               })
      //               .then(() => {
      //                 toast.success("Network added successfully!");
      //               })
      //               .catch((error: any) => {
      //                 console.error("Error adding network:", error);
      //               });
      //           });
      //       }
      //     });
      // }
      else if (NetworkInfo[networkName as NetworkVariants]) {
        const networkId = ChainInfo[networkName as SupportedNetworks];
        if (networkId.id) {
          await switchNetwork?.(networkId.id);
        } else {
          console.error("Unsupported network selected:", networkName);
        }
      }
    } catch (error) {
      console.error("Network switch failed:", error);
    } finally {
      setIsOpen(false);
    }
  };

  /**
   * This constant represents a collection of network icons and their corresponding names.
   * It facilitates the automatic rendering of network icons and names in a select component.
   *
   * For now only SEPOLIA & KAKAROT available
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
    [SupportedNetworks.OPSEPOLIA]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.OPSEPOLIA}
        />
      ),
      name: SupportedNetworks.OPSEPOLIA,
    },
    // [SupportedNetworks.MUMBAI]: {
    //   icon: (
    //     <NetworkIcon
    //       props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
    //       variant={SupportedNetworks.MUMBAI}
    //     />
    //   ),
    //   name: SupportedNetworks.MUMBAI,
    // },
    [SupportedNetworks.FUJI]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.FUJI}
        />
      ),
      name: SupportedNetworks.FUJI,
    },
    [SupportedNetworks.BNBTESTNET]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.BNBTESTNET}
        />
      ),
      name: SupportedNetworks.BNBTESTNET,
    },
    [SupportedNetworks.BASESEPOLIA]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.BASESEPOLIA}
        />
      ),
      name: SupportedNetworks.BASESEPOLIA,
    },
    [SupportedNetworks.ARBITRUMSEPOLIA]: {
      icon: (
        <NetworkIcon
          props={{ className: "text-[#A3A9A5] dark:text-[#707572]" }}
          variant={SupportedNetworks.ARBITRUMSEPOLIA}
        />
      ),
      name: SupportedNetworks.ARBITRUMSEPOLIA,
    },
  };

  const NetworkDropdownVariant: Record<NetworkVariantPosition, JSX.Element> = {
    HORIZONTAL: (
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
              <div className="absolute z-20 top-12 left-0 w-full bg-white dark:bg-[#212322] overflow-hidden border dark:border-[#505150] rounded-xl dark:shadow-swap-connection-dropwdown">
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
    ),
    VERTICAL: (
      <div className="flex justify-center relative">
        <Tooltip
          position={"right"}
          content={
            !authenticatedUserAddress
              ? "Network"
              : capitalizeFirstLetterPrhases(destinyChain)
          }
        >
          <button
            onClick={handleToggleDropdown}
            className="bg-black-500 outline-none dark:hover:bg-[#353836] hover:bg-[#E4E4E4] transition-colors duration-200 rounded-[10px] p-2"
          >
            {!authenticatedUserAddress ? (
              <NetworkIcon variant={"default"} />
            ) : (
              <NetworkIcon variant={destinyChain} />
            )}
          </button>
        </Tooltip>
        {isOpen && (
          <div className="max-w-[280px]">
            <div className="absolute xl:ml-2 lg:right-10 xl:right-auto xl:bottom-1 bg-white dark:bg-[#212322] overflow-hidden border dark:border-[#505150] rounded-xl dark:shadow-swap-connection-dropwdown">
              {Object.values(NetworkInfo).map((network, index) => (
                <div
                  key={index}
                  onClick={() =>
                    handleDropdownItemClick(network.name as NetworkVariants)
                  }
                  className="gap-2 flex px-4 py-2 p-small-variant-black-2 dark:p-small-dark-variant-grey items-center hover:dark:bg-[#353836] transition-colors duration-200"
                >
                  <NetworkIcon variant={network.name as NetworkVariants} />
                  <span className="w-[200px]">
                    {capitalizeFirstLetterPrhases(network.name)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  };

  return NetworkDropdownVariant[variant];
};

import { ForWhom } from "../03-organisms";
import { SwapContext } from "@/lib/client/contexts";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import { EthereumAddress } from "@/lib/shared/types";
import { useContext, useState } from "react";
import cc from "classcat";

export const SwappingSearchTab = () => {
  const [lastSearchedUser, setLastsearchedUser] =
    useState<EthereumAddress | null>(null);
  // PUBLIC OFFER
  const {
    setValidatedAddressToSwap,
    setAnyUserToSwap,
    setPublicOrPrivateSwap,
    publicOrPrivateSwap,
    validatedAddressToSwap,
    setInputAddress,
  } = useContext(SwapContext);
  interface SwappingSearchTab {
    id: number;
    name: string;
  }

  const swappingTabs: Array<SwappingSearchTab> = [
    {
      id: ForWhom.Yours,
      name: "User",
    },
    {
      id: ForWhom.Their,
      name: "Public offer",
    },
  ];

  const handleTabChange = (tabId: number) => {
    setPublicOrPrivateSwap(tabId);

    switch (tabId) {
      case ForWhom.Yours:
        setAnyUserToSwap(false);
        if (
          lastSearchedUser &&
          validatedAddressToSwap &&
          lastSearchedUser.address !== validatedAddressToSwap.address
        ) {
          setInputAddress(lastSearchedUser.address);
        } else if (
          lastSearchedUser &&
          validatedAddressToSwap &&
          lastSearchedUser.address === validatedAddressToSwap.address
        ) {
          setValidatedAddressToSwap(null);
        }
        break;
      case ForWhom.Their:
        setAnyUserToSwap(true);
        setValidatedAddressToSwap(new EthereumAddress(ADDRESS_ZERO));
        setLastsearchedUser(new EthereumAddress(ADDRESS_ZERO));
        if (
          lastSearchedUser &&
          validatedAddressToSwap &&
          lastSearchedUser.address !== validatedAddressToSwap.address
        ) {
          setInputAddress("");
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex gap-[6px]">
      {swappingTabs.map((tab) => {
        return (
          <div
            key={tab.id}
            className={cc([
              publicOrPrivateSwap === tab.id && "bg-[#DDF23D]",
              "flex cursor-pointer rounded-lg py-2 px-3 justify-center items-center dark:p-medium-bold-variant-black p-medium-bold-variant-black w-[100px]",
            ])}
            role="tab"
            onClick={() => {
              handleTabChange(tab.id);
            }}
          >
            <div className="flex items-center justify-center contrast-50">
              {tab.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

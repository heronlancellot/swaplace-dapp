/* eslint-disable react-hooks/exhaustive-deps */
import { TokensShelf, ForWhom } from "@/components/03-organisms";
import { SearchItemsShelf, TokensShelfTab } from "@/components/01-atoms/";
import { ShelfContext } from "@/lib/client/contexts/ShelfContext";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { SwapContext } from "@/lib/client/contexts";
import { useContext, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import cc from "classcat";

/**
 * SwappingShelfs Component
 *
 * React component that display of tokens swapping shelves.
 *
 * @return The rendered SwappingShelfs component.
 */
export const SwappingShelfs = () => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { isActiveTab, setTheirTokensList, setYourTokensList } =
    useContext(ShelfContext);
  const {
    setAuthenticatedUserTokensList,
    setSearchedUserTokensList,
    setInputAddress,
    setValidatedAddressToSwap,
    lastWalletConnected,
  } = useContext(SwapContext);

  const [lastChain, setLastChain] = useState<number | undefined>(chain?.id);

  useEffect(() => {
    if (chain && chain.id !== lastChain) {
      setTheirTokensList([]);
      setYourTokensList([]);
      setValidatedAddressToSwap(null);
      setAuthenticatedUserTokensList([]);
      setSearchedUserTokensList([]);
      setInputAddress("");
      setLastChain(chain.id);
    }
  }, [chain]);

  useEffect(() => {
    if (
      !isConnected ||
      (address && address?.toLowerCase() !== lastWalletConnected.toLowerCase())
    ) {
      setTheirTokensList([]);
      setYourTokensList([]);
      setValidatedAddressToSwap(null);
      setAuthenticatedUserTokensList([]);
      setSearchedUserTokensList([]);
      setInputAddress("");
    }
  }, [isConnected]);

  useEffect(() => {
    if (
      authenticatedUserAddress &&
      authenticatedUserAddress.address.toLowerCase() !==
        lastWalletConnected.toLowerCase()
    ) {
      setAuthenticatedUserTokensList([]);
      setSearchedUserTokensList([]);
    }
  }),
    [authenticatedUserAddress, lastWalletConnected];

  return (
    <div className="w-full h-full dark:bg-[#212322] dark:border-[#353836] border border-[#D6D5D5] rounded-2xl dark:shadow-swap-station shadow-swap-station-light">
      <div className="flex items-center justify-between max-h-[48px] border-b dark:border-[#313131] pr-2">
        <div className="flex max-w-[224px]">
          <TokensShelfTab />
        </div>
        <div>
          <SearchItemsShelf />
        </div>
      </div>
      <div className="p-5">
        <div className={cc([isActiveTab ? "hidden" : "block"])}>
          <TokensShelf variant={ForWhom.Their} />
        </div>
        <div className={cc([isActiveTab ? "block" : "hidden"])}>
          <TokensShelf variant={ForWhom.Yours} />
        </div>
      </div>
    </div>
  );
};

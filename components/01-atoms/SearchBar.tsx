/* eslint-disable import/no-named-as-default */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-named-as-default-member */
import { MagnifyingGlassIcon } from "@/components/01-atoms";
import { EthereumAddress } from "@/lib/shared/types";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import { normalizeENSName } from "@/lib/client/blockchain-utils";
import { SwapContext } from "@/lib/client/contexts";
import { useContext, useEffect } from "react";
import { ENS } from "web3-eth-ens";
import Web3 from "web3";
import toast from "react-hot-toast";

export const SearchBar = () => {
  if (!process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_HTTP) {
    throw new Error(
      "Cannot get the ENS primary name`s address without an Alchemy API Key",
    );
  }
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_HTTP,
  );
  const ens = new ENS(undefined, provider);

  const {
    lastWalletConnected,
    inputAddress,
    setInputAddress,
    setValidatedAddressToSwap,
    setUserJustValidatedInput,
    setAnyUserToSwap,
  } = useContext(SwapContext);

  useEffect(() => {
    const requestDelay = setTimeout(() => {
      setUserJustValidatedInput(false);
      getUserAddress();
    }, 1000);
    return () => clearTimeout(requestDelay);
  }, [inputAddress]);

  const validateAddressToSwap = (searchedENSAddress: string) => {
    if (searchedENSAddress === ADDRESS_ZERO) {
      toast.error("Non-existent Ethereum Address");
      setUserJustValidatedInput(true);
      setValidatedAddressToSwap(null);
      return;
    }

    try {
      new EthereumAddress(searchedENSAddress);
    } catch (error) {
      toast.error(
        `Please enter a ${
          searchedENSAddress.includes(".eth")
            ? "valid ENS name"
            : "valid EVM-format address"
        }`,
      );
      setUserJustValidatedInput(true);
      setValidatedAddressToSwap(null);
      return;
    }

    const _inputAddress = new EthereumAddress(searchedENSAddress);
    setValidatedAddressToSwap(_inputAddress);
    setUserJustValidatedInput(true);
    setAnyUserToSwap(false);
    toast.success("Searching for address...");
  };

  const getUserAddress = async () => {
    if (lastWalletConnected && inputAddress.length > 2) {
      const _inputAddress = inputAddress;
      const formattedAddress = normalizeENSName(inputAddress);

      try {
        const address: unknown = await ens.getOwner(formattedAddress);
        if (typeof address !== "string") {
          toast.error(
            "Wrong type of address returned by provider. Please contact the team",
          );
          return;
        }
        validateAddressToSwap(
          address === ADDRESS_ZERO ? _inputAddress : address,
        );
      } catch (error) {
        toast.error("Invalid Ethereum Address");
        setValidatedAddressToSwap(null);
      } finally {
        setUserJustValidatedInput(true);
      }
    } else if (inputAddress.length > 2) {
      toast.error("You must connect your wallet to search for an address");
      setUserJustValidatedInput(true);
      setValidatedAddressToSwap(null);
    } else if (inputAddress.length === 0) {
      setUserJustValidatedInput(true);
      setValidatedAddressToSwap(null);
    }
  };

  return (
    <div className="w-full flex items-center border-l dark:border-[#353836]">
      <div className="flex w-full items-center  rounded-2xl pl-4 pr-3 gap-4 bg-[#F6F6F6] hover:bg-[#F0EEEE75]  dark:bg-[#212322] border-[#D6D5D5] hover:border-[#AABE13] dark:border-[#353836] focus:border-[#FFFFFF] dark:hover:border-[#edff6259] transition duration-300 ease-in-out">
        <div className="justify-center items-center">
          <MagnifyingGlassIcon className="w-5 text-[#A3A9A5] dark:text-[#353836]" />
        </div>
        <input
          id="search"
          name="search"
          type="search"
          className={
            "h-11 w-full border-gray-100 focus:ring-0 focus:ring-transparent focus:outline-none focus-visible:border-gray-300 placeholder:p-small text-ellipsis border-none bg-transparent dark:border-none dark:bg-transparent contrast-50"
          }
          placeholder="Search username, address or ENS"
          value={inputAddress}
          onChange={({ target }) => setInputAddress(target.value)}
        />
      </div>
    </div>
  );
};

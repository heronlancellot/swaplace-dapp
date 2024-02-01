import { useContext, useEffect, useState } from "react";
import {
  ChainInfo,
  NFTsQueryStatus,
  ERC20,
  ERC721,
  ERC721Token,
  ERC20Token,
} from "@/lib/client/constants";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useNetwork } from "wagmi";
import { getNftsFrom, getTokensFrom } from "@/lib/client/blockchain-data";
import { useTheme } from "next-themes";
import { EthereumAddress } from "@/lib/shared/types";
import { SwapContext } from "@/components/01-atoms";
import { SelectUserIcon } from "@/components/01-atoms/icons";
import { TokensList } from "@/components/02-molecules";

interface ITokensShelfProps {
  address: string | null;
}

/**
 *
 * The Shelf component display the NFTs of given address.
 * @param address
 *
 * @returns Shelf Nfts based in status of given address
 */
export const TokensShelf = ({ address }: ITokensShelfProps) => {
  const { chain } = useNetwork();
  const [erc721Tokens, setErc721Tokens] = useState<ERC721[]>([]);
  const [erc20Tokens, setErc20Tokens] = useState<ERC20[]>([]);
  const [nftsQueryStatus, setNftsQueryStatus] = useState<NFTsQueryStatus>(
    NFTsQueryStatus.EMPTY_QUERY,
  );
  const { theme } = useTheme();

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { validatedAddressToSwap, inputAddress, destinyChain } =
    useContext(SwapContext);

  useEffect(() => {
    const chainId =
      address === authenticatedUserAddress?.address
        ? chain?.id
        : ChainInfo[destinyChain].id;

    if (address && chainId) {
      getNftsFrom(address, chainId, setNftsQueryStatus)
        .then((erc721Tokens) => {
          setErc721Tokens(erc721Tokens);
        })
        .catch(() => {
          setErc721Tokens([]);
        });

      getTokensFrom(address, chainId)
        .then((erc20Tokens) => {
          setErc20Tokens(erc20Tokens);
        })
        .catch(() => {
          setErc20Tokens([]);
        });
    }
  }, [address, chain, destinyChain]);

  useEffect(() => {
    if (
      authenticatedUserAddress &&
      address &&
      authenticatedUserAddress.equals(new EthereumAddress(address))
    ) {
      setErc721Tokens([]);
      setErc20Tokens([]);
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [destinyChain]);

  useEffect(() => {
    if (address !== authenticatedUserAddress?.address) {
      setErc721Tokens([]);
      setErc20Tokens([]);
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [chain]);

  useEffect(() => {
    if (
      address !== authenticatedUserAddress?.address &&
      validatedAddressToSwap !== authenticatedUserAddress?.address
    ) {
      setErc721Tokens([]);
      setErc20Tokens([]);
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [inputAddress]);

  useEffect(() => {
    if (!validatedAddressToSwap) {
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [validatedAddressToSwap]);

  const erc721List: ERC721Token = {
    data: erc721Tokens,
    ownerAddress: address,
  };

  const erc20List: ERC20Token = {
    data: erc20Tokens,
    ownerAddress: address,
  };

  return (
    <div className="w-full  flex border-1 border-gray-200 border-t-0 rounded-2xl rounded-t-none overflow-auto bg-[#f8f8f8] dark:bg-[#212322] lg:max-w-[580px] md:h-[540px]">
      {nftsQueryStatus == NFTsQueryStatus.WITH_RESULTS && erc721Tokens ? (
        <div className="w-full h-full">
          <TokensList fungibleToken={erc20List} nonFungibleToken={erc721List} />
        </div>
      ) : nftsQueryStatus == NFTsQueryStatus.EMPTY_QUERY || !address ? (
        <div className="flex w-full h-full bg-[#f8f8f8] dark:bg-[#212322] p-4 justify-center items-center ">
          <div className="flex-col flex  items-center space-y-4">
            <div className="w-[80px] h-[80px] flex items-center border-[3px] rounded-full dark:border-[#DDF23D] border-[#A3A9A5] ">
              <SelectUserIcon
                className="w-[100px]"
                fill={theme == "dark" ? "#DDF23D" : "#A3A9A5"}
              />
            </div>
            <p className="dark:text-[#F6F6F6] font-onest font-medium text-[16px] leading-[20px]">
              No user selected yet
            </p>
            <p className="dark:text-[#A3A9A5] font-onest font-normal text-[14px] leading-[20px]">
              Search for a user to start swapping items
            </p>
          </div>
        </div>
      ) : nftsQueryStatus == NFTsQueryStatus.NO_RESULTS ? (
        <div className="flex justify-center w-full h-[450px] bg-[#f8f8f8] dark:bg-[#212322] p-4">
          <div className="flex items-center">
            <p className="dark:text-[#F6F6F6] font-onest font-medium text-[16px] leading-[20px]">
              Given address has no NFTs associated in the given network
            </p>
          </div>
        </div>
      ) : nftsQueryStatus == NFTsQueryStatus.LOADING ? (
        <div className="flex justify-center w-full h-[450px] bg-[#f8f8f8] dark:bg-[#212322] p-4">
          <div className="flex items-center">
            <p className="dark:text-[#F6F6F6] font-onest font-medium text-[16px] leading-[20px]">
              Loading NFTs of{" "}
              {new EthereumAddress(address).getEllipsedAddress()}...
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

import { SwapModalLayout } from "@/components/01-atoms";
import { TokenType } from "@/lib/shared/types";
import {
  SwapUserConfiguration,
  mintTokensMocked,
} from "@/lib/service/mintTokensMocked";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useState } from "react";
import cc from "classcat";
import { type WalletClient, useNetwork, useWalletClient } from "wagmi";
import toast from "react-hot-toast";

export const BannerMintTokens = () => {
  const [tokenType, setTokenType] = useState<TokenType | null>(null);
  const [toggleManually, setToggleManually] = useState<boolean>(false);
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { authenticatedUserAddress } = useAuthenticatedUser();

  let chainId: number;
  let userWalletClient: WalletClient;

  const handleMint = async (tokenType: TokenType) => {
    if (typeof chain?.id != "undefined" && walletClient != undefined) {
      chainId = chain?.id;
      userWalletClient = walletClient;
    } else {
      throw new Error("Chain ID is undefined");
    }
    const configurations: SwapUserConfiguration = {
      walletClient: userWalletClient,
      chain: chainId,
    };

    (await mintTokensMocked(tokenType, configurations)).success
      ? toast.success("Token minted")
      : toast.error("Error minting token");
  };

  const MintTokenBody = (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-3 ">
        <button
          className={cc([
            "w-full border border-[#353836] rounded-lg py-3 pl-3 pr-4 text-start dark:bg-[#282B29]",
            tokenType === TokenType.ERC20
              ? "dark:bg-[#ddf23d] bg-[#ddf23d] p-medium-2"
              : "dark:p-medium-2-dark dark:hover:bg-[#353836] hover:bg-[#35383617]",
          ])}
          onClick={async () => {
            setTokenType(TokenType.ERC20);
            await handleMint(TokenType.ERC20);
          }}
        >
          ERC20
        </button>
        <button
          className={cc([
            "w-full  border border-[#353836] rounded-lg py-3 pl-3 pr-4 text-start dark:bg-[#282B29]",
            tokenType === TokenType.ERC721
              ? "dark:bg-[#ddf23d] bg-[#ddf23d] p-medium-2"
              : "dark:p-medium-2-dark dark:hover:bg-[#353836] hover:bg-[#35383617]",
          ])}
          onClick={async () => {
            setTokenType(TokenType.ERC721);
            await handleMint(TokenType.ERC721);
          }}
        >
          ERC721
        </button>
      </div>
    </div>
  );

  return !authenticatedUserAddress
    ? null
    : authenticatedUserAddress && (
        <div className="flex items-center">
          The alpha phase is live!
          <div className="flex flex-col gap-6 ml-2">
            <button
              className="p-medium-bold-variant-black bg-[#DDF23D] border rounded-[10px] py-2 px-4 h-[38px] dark:border-[#181a19] border-white"
              onClick={() => setToggleManually(!toggleManually)}
            >
              Mint your tokens 🔥
            </button>
            {toggleManually && (
              <SwapModalLayout
                toggleCloseButton={{
                  open: toggleManually,
                  onClose: () => setToggleManually(!toggleManually),
                }}
                body={MintTokenBody}
                text={{ title: "What kind of token you want to mint?" }}
              />
            )}
          </div>
        </div>
      );
};

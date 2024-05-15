import { SwapModalLayout } from "@/components/01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { EthereumAddress } from "@/lib/shared/types";
import { getSwap } from "@/lib/service/getSwap";
import { Swap } from "@/lib/client/swap-utils";
import { ADDRESS_ZERO } from "@/lib/client/constants";
import {
  decodeConfig,
  retrieveDataFromTokensArray,
} from "@/lib/client/blockchain-utils";
import { PopulatedSwapOfferCard } from "@/lib/client/offers-utils";
import { MarketplaceContext, PonderFilter } from "@/lib/client/contexts";
import { useContext, useState } from "react";
import { useNetwork } from "wagmi";
import toast from "react-hot-toast";

interface AddSwapManuallyModalMarketplaceProps {
  onClose: () => void;
  open: boolean;
}

const SwapBody = () => {
  const [swapId, setSwapId] = useState<bigint>(0n);
  const { chain } = useNetwork();
  let swapBelongsToAuthUser: boolean;
  const { setTokensList, tokensList } = useContext(MarketplaceContext);
  const { authenticatedUserAddress } = useAuthenticatedUser();

  if (!authenticatedUserAddress?.address) {
    return null;
  }

  let chainId: number | undefined = undefined;

  if (typeof chain?.id != "undefined") {
    chainId = chain?.id;
  }

  if (!chainId) {
    toast.error("Wallet not connected to any chain");
  }

  const verifySwapBelongsToAuthUser = async (swap: Swap): Promise<boolean> => {
    const bidingAddressAndExpiryData = await decodeConfig({
      config: BigInt(swap.config),
    });

    if (swap.owner === ADDRESS_ZERO) {
      toast.error("Swap ID doesn't exist. Please check the given ID");
    } else if (swap.owner !== ADDRESS_ZERO) {
      if (bidingAddressAndExpiryData.allowed === ADDRESS_ZERO) {
        toast.success("Searching for swap...");
        swapBelongsToAuthUser = true;
      } else {
        swapBelongsToAuthUser = false;
        toast.error("This swap doesn't have allowed 0. Try offers");
      }
    }
    return swapBelongsToAuthUser;
  };

  const addSwapToTokensList = async (swap: Swap) => {
    const askedTokensWithData = await retrieveDataFromTokensArray(swap.asking);
    const bidedTokensWithData = await retrieveDataFromTokensArray(swap.biding);

    const bidingAddressAndExpiryData = await decodeConfig({
      config: BigInt(swap.config),
    });

    const formattedTokens: PopulatedSwapOfferCard = {
      status: PonderFilter.ALL_OFFERS,
      id: swapId,
      expiryDate: BigInt(bidingAddressAndExpiryData.expiry),
      bidderTokens: {
        address: new EthereumAddress(bidingAddressAndExpiryData.allowed),
        tokens: bidedTokensWithData,
      },
      askerTokens: {
        address: new EthereumAddress(swap.owner),
        tokens: askedTokensWithData,
      },
    };

    const isSwapDuplicated = tokensList.some(
      (token) => BigInt(token.id) === BigInt(swapId),
    );

    isSwapDuplicated
      ? toast.error(
          "This swap is already in the list. Please choose another one.",
        )
      : (setTokensList([...tokensList, formattedTokens]),
        toast.success("Swap added successfully!"));

    return swap;
  };

  const addSwapId = async () => {
    if (!authenticatedUserAddress?.address) {
      toast.error("No wallet connected");
      return;
    }
    if (!swapId) {
      toast.error("No swap ID provided to be added");
      return;
    }
    if (!chain) {
      toast.error("Wallet not connected to any chain");
      return;
    }
    await getSwap(swapId, chain.id).then(async (swap: Swap) => {
      await verifySwapBelongsToAuthUser(swap).then(
        (swapBelongsToAuthUser: boolean) => {
          if (swapBelongsToAuthUser) {
            addSwapToTokensList(swap);
          }
        },
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <div className="dark:p-small-dark p-small-variant-black">Swap ID</div>
        <div>
          <input
            onChange={(e) => setSwapId(BigInt(e.target.value))}
            className="w-full p-3 dark:bg-[#282a29] border border-[#353836] focus-visible:outline-[#DDF23D] rounded-lg h-[44px]"
          />
        </div>
      </div>
      <div className="flex h-[36px]">
        <button
          onClick={addSwapId}
          className="bg-[#DDF23D] hover:bg-[#aabe13] w-full dark:shadow-add-manually-button py-2 px-4 rounded-[10px] p-medium-bold-variant-black"
        >
          Add Swap
        </button>
      </div>
    </div>
  );
};

export const AddSwapManuallyModalMarketplace = ({
  onClose,
  open,
}: AddSwapManuallyModalMarketplaceProps) => {
  return (
    <SwapModalLayout
      toggleCloseButton={{ open, onClose }}
      body={<SwapBody />}
      text={{ title: "Add swap manually" }}
    />
  );
};

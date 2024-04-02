import { MockERC20Abi, MockERC721Abi } from "../client/abi";
import { EthereumAddress, TokenType } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import toast from "react-hot-toast";
import { getContract } from "viem";

interface verifyTokensOwnershipProps {
  address: EthereumAddress;
  tokenType: TokenType;
  contractAddress: `0x${string}`;
  tokenId: string;
  chainId: number;
}

export async function verifyTokenOwnership({
  address,
  contractAddress,
  tokenId,
  tokenType,
  chainId,
}: verifyTokensOwnershipProps) {
  const [abi, args] =
    tokenType === TokenType.ERC20
      ? [MockERC20Abi, [address.address]]
      : [MockERC721Abi, [tokenId]];

  try {
    const contract = getContract({
      address: contractAddress,
      publicClient: publicClient({ chainId: chainId }),
      abi,
    });

    if (tokenType === TokenType.ERC721) {
      const tokenOwner = await contract.read.ownerOf(args);

      if (typeof tokenOwner === "string") {
        return {
          isOwner: tokenOwner.toUpperCase() !== address.address.toUpperCase(),
        };
      } else throw new Error("Invalid Token ownerOf response type");
    } else if (tokenType === TokenType.ERC20) {
      const tokenBalance = await contract.read.balanceOf(args);

      if (typeof tokenBalance === "bigint") {
        return {
          isOwner: tokenBalance > 0,
        };
      } else throw new Error("Invalid Token balance response type");
    }

    // onWalletConfirmation();
    // let txReceipt = {} as TransactionReceipt;
    // while (typeof txReceipt.blockHash === "undefined") {
    /*
          It is guaranteed that at some point we'll have a valid TransactionReceipt in here.
          If we had a valid transaction sent (which is confirmed at this point by the try/catch block),
          it is a matter of waiting the transaction to be mined in order to know whether it was successful or not.
          So why are we using a while loop here?
          - Because it is possible that the transaction was not yet mined by the time
          we reach this point. So we keep waiting until we have a valid TransactionReceipt.
        */
    //   const transactionReceipt = await publicClient({
    //     chainId,
    //   }).waitForTransactionReceipt({
    //     hash: transactionHash,
    //   });
    //   if (transactionReceipt) {
    //     txReceipt = transactionReceipt;
    //   }
    // }
    // return {
    //   success: true,
    //   receipt: txReceipt,
    //   errorMessage: null,
    // };
  } catch (error) {
    console.error(error);
    toast.error(
      "Transaction failed. Check the Contract address and the token chain",
    );
    return {
      receipt: null,
      success: false,
      errorMessage: String(error),
    };
  }
}

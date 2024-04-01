import { MockERC20Abi, MockERC721Abi } from "../client/abi";
import { EthereumAddress, TokenType } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";

interface verifyTokensOwnershipProps {
  address: EthereumAddress;
  tokenType: TokenType;
  contractAddress: `0x${string}`;
  tokenId: string;
  chainId: number;
}

enum functionNameByTokenType {
  ERC20 = "balanceOf",
  ERC721 = "ownerOf",
}

export async function verifyTokenOwnership({
  address,
  contractAddress,
  tokenId,
  tokenType,
  chainId,
}: verifyTokensOwnershipProps) {
  let owner: boolean;
  const [abi, functionName, args] =
    tokenType === TokenType.ERC20
      ? [MockERC20Abi, functionNameByTokenType.ERC20, [address.address]]
      : [MockERC721Abi, functionNameByTokenType.ERC721, [tokenId]];

  try {
    type ContractReturnType<T extends TokenType> = T extends TokenType.ERC721
      ? string
      : T extends TokenType.ERC20
      ? bigint
      : never;

    const data: ContractReturnType<TokenType> = (await publicClient({
      chainId: chainId,
    }).readContract({
      address: contractAddress,
      abi: abi,
      functionName: functionName,
      args: args,
    })) as ContractReturnType<TokenType>;

    typeof data === "string"
      ? data.toUpperCase() !== address.address.toUpperCase()
        ? (owner = false)
        : (owner = true)
      : data > 0
      ? (owner = true)
      : (owner = false);

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
    return {
      receipt: null,
      success: false,
      errorMessage: String(error),
    };
  }
  return { owner };
}

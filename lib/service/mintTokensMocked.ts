import { MockERC20Abi, MockERC721Abi } from "../client/abi";
import { SWAPLACE_MOCK_TOKENS } from "../client/constants";
import { TokenType } from "../shared/types";
import { publicClient } from "../wallet/wallet-config";
import { type Hash, type TransactionReceipt } from "viem";

export interface MintTokensResponse {
  receipt: TransactionReceipt | null;
  errorMessage: string | null;
  success: boolean;
}

export interface SwapUserConfiguration {
  walletClient: any;
  chain: number;
}

export async function mintTokensMocked(
  tokenType: TokenType,
  configurations: SwapUserConfiguration,
): Promise<MintTokensResponse> {
  const [abi, tokenContractAddress] =
    tokenType === TokenType.ERC20
      ? [MockERC20Abi, SWAPLACE_MOCK_TOKENS[configurations.chain].ERC20]
      : [MockERC721Abi, SWAPLACE_MOCK_TOKENS[configurations.chain].ERC721];

  const functionName = "mint";
  const tokenTotalSupply = await publicClient({
    chainId: configurations.chain,
  }).readContract({
    address: tokenContractAddress as `0x${string}`,
    abi: abi,
    functionName: "totalSupply",
  });
  const amountOrId =
    tokenType === TokenType.ERC721
      ? (tokenTotalSupply as bigint) + 1n
      : 10000000000000000000; //TO DO: check if need set amount to mint here

  try {
    const { request } = await publicClient({
      chainId: configurations.chain,
    }).simulateContract({
      account: configurations.walletClient.account.address as `0x${string}`,
      address: tokenContractAddress as `0x${string}`,
      args: [configurations.walletClient.account.address, amountOrId],
      functionName,
      abi,
    });

    const transactionHash: Hash =
      await configurations.walletClient.writeContract(request);

    let txReceipt = {} as TransactionReceipt;

    while (typeof txReceipt.blockHash === "undefined") {
      /*
        It is guaranteed that at some point we'll have a valid TransactionReceipt in here.
        If we had a valid transaction sent (which is confirmed at this point by the try/catch block),
        it is a matter of waiting the transaction to be mined in order to know whether it was successful or not.
        
        So why are we using a while loop here?
        - Because it is possible that the transaction was not yet mined by the time
        we reach this point. So we keep waiting until we have a valid TransactionReceipt.
      */

      const transactionReceipt = await publicClient({
        chainId: configurations.chain,
      }).waitForTransactionReceipt({
        hash: transactionHash,
      });

      if (transactionReceipt) {
        txReceipt = transactionReceipt;
      }
    }

    return {
      success: true,
      receipt: txReceipt,
      errorMessage: null,
    };
  } catch (error) {
    console.error(error);
    return {
      receipt: null,
      success: false,
      errorMessage: String(error),
    };
  }
}

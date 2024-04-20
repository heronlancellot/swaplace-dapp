/* eslint-disable react-hooks/exhaustive-deps */
import { ADDRESS_ZERO } from "../constants";
import { EthereumAddress } from "../../shared/types";
import { signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { SwapContext } from "@/components/01-atoms";

interface AuthenticatedUserHook {
  authenticatedUserAddress: EthereumAddress | null;
  disconnectUser: () => void;
}

export const useAuthenticatedUser = (): AuthenticatedUserHook => {
  const { disconnect } = useDisconnect();
  const { data: nextAuthUser } = useSession();
  const { address, isConnected } = useAccount();
  const [authenticatedAccountAddress, setAuthenticatedAccountAddress] =
    useState<EthereumAddress | null>(null);
  const [loadingAuthenticatedUser, setLoadingAuthenticatedUser] =
    useState(true);

  const { lastWalletConnected, setLastWalletConnected } =
    useContext(SwapContext);

  /*
    We always need to make sure not only the information
    that user is connected but ALSO that user has signed-in.
    Anyone can fake connecting their wallet as a wallet that isn't
    theirs but no one can fake signing in with a wallet that isn't theirs.

    'nextAuthUser' provides the information that user has signed-in.
    'isConnected' provides the information that user has connected his/her wallet.
  */

  useEffect(() => {
    if (
      !isConnected ||
      address?.toLowerCase() !== lastWalletConnected.toLowerCase()
    ) {
      setAuthenticatedAccountAddress(null);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (
      authenticatedAccountAddress?.address.toLowerCase() !==
      lastWalletConnected.toLowerCase()
    ) {
      const accountAuthenticated =
        !!nextAuthUser && nextAuthUser.user.id == address?.toLowerCase();

      setAuthenticatedAccountAddress(
        accountAuthenticated && address
          ? new EthereumAddress(address.toLowerCase())
          : null,
      );
      setLastWalletConnected(address ? address.toLowerCase() : "");
      setLoadingAuthenticatedUser(false);
    }
  }, [nextAuthUser, isConnected, address]);

  const disconnectUser = () => {
    signOut({ redirect: false }).then(() => {
      if (authenticatedAccountAddress) {
        disconnect();
      }
    });
  };

  useEffect(() => {
    window.addEventListener("load", () => {
      if (window.ethereum) {
        window.ethereum.on("disconnect", disconnectUser);
      }
    });
  }, []);

  return {
    authenticatedUserAddress: authenticatedAccountAddress,
    disconnectUser,
  };
};

/* eslint-disable react-hooks/exhaustive-deps */
import { EthereumAddress } from "../../shared/types";
import { SwapContext } from "@/components/01-atoms";
import { signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

interface AuthenticatedUserHook {
  authenticatedUserAddress: EthereumAddress | null;
  disconnectUser: () => void;
}

export const useAuthenticatedUser = (): AuthenticatedUserHook => {
  const { disconnect } = useDisconnect();
  const { data: nextAuthUser } = useSession();
  const { address, isConnected } = useAccount();
  const { lastWalletConnected, setLastWalletConnected } =
    useContext(SwapContext);
  const _lastWalletConnected = lastWalletConnected
    ? new EthereumAddress(lastWalletConnected)
    : null;
  const [authenticatedAccountAddress, setAuthenticatedAccountAddress] =
    useState<EthereumAddress | null>(_lastWalletConnected);

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
      address &&
      address.toLowerCase() !== lastWalletConnected.toLowerCase()
    ) {
      if (!nextAuthUser) {
        setAuthenticatedAccountAddress(
          new EthereumAddress(address.toLowerCase()),
        );
      }
      setLastWalletConnected(address.toLowerCase());
    } else if (
      address &&
      address.toLowerCase() === lastWalletConnected.toLowerCase()
    ) {
      setAuthenticatedAccountAddress(
        new EthereumAddress(address.toLowerCase()),
      );
    } else if (!isConnected) {
      setAuthenticatedAccountAddress(null);
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

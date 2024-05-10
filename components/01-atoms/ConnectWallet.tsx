import { WalletIcon } from "@/components/01-atoms";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface IConnectWallet {
  customStyle?: string;
  walletIcon?: boolean;
}

export const ConnectWallet = ({ customStyle, walletIcon }: IConnectWallet) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="w-full"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className={customStyle}
                    type="button"
                  >
                    {walletIcon ? <WalletIcon /> : <p>Connect Wallet</p>}
                  </button>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

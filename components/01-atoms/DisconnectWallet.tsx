import { OffersContext, PowerIcon, SwapContext } from "@/components/01-atoms";
import { useSidebar } from "@/lib/client/contexts/SidebarContext.tsx";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useDisconnect } from "wagmi";
import cc from "classcat";
import { useTheme } from "next-themes";
import { useContext } from "react";

export const DisconnectWallet = () => {
  const { disconnect } = useDisconnect();
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { toggleSidebar } = useSidebar();
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const { setInputAddress } = useContext(SwapContext);
  const { setTokensList } = useContext(OffersContext);

  const handleClick = () => {
    setTokensList([]);
    setInputAddress("");
    toggleSidebar();
    disconnect();
  };

  return (
    <button
      onClick={handleClick}
      className={cc([
        "flex gap-2 justify-center items-center",
        isDark ? "text-[#DDF23D]" : "text-[#AABE13]",
      ])}
    >
      <PowerIcon />
      <h3 className="text-sm">Disconnect</h3>
    </button>
  );
};

import { PowerIcon } from "@/components/01-atoms";
import { useSidebar } from "@/lib/client/contexts/SidebarContext";
import { OffersContext, SwapContext } from "@/lib/client/contexts";
import { useDisconnect } from "wagmi";
import cc from "classcat";
import { useTheme } from "next-themes";
import { useContext } from "react";
import toast from "react-hot-toast";

export const DisconnectWallet = () => {
  const { disconnect } = useDisconnect();
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { toggleSidebar } = useSidebar();
  const { setInputAddress } = useContext(SwapContext);
  const { setTokensList } = useContext(OffersContext);

  const handleClick = () => {
    setTokensList([]);
    setInputAddress("");
    toggleSidebar();
    disconnect();
    toast.success("Your wallet has disconnected!");
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

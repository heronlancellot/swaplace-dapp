import { useScreenSize } from "@/lib/client/hooks/useScreenSize";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  ConnectWallet,
  ENSAvatar,
  MoonIcon,
  NetworkDropdown,
  NetworkVariantPosition,
  SunIcon,
  SwaplaceIcon,
  SwappingIcons,
  Tooltip,
} from "@/components/01-atoms";
import { useSidebar } from "@/lib/client/contexts/SidebarContext";
import { WalletSidebarTemplate } from "@/components/03-organisms";
import { SWAPLACE_WEBSITE } from "@/lib/client/constants";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const TheHeader = () => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const { isWideScreen } = useScreenSize();
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const setThemeMode = (mode: "light" | "dark") => {
    const body = document.body;

    // Add the class to disable transitions
    body.classList.add("no-transition");

    setTheme(mode);

    // Use a timeout to re-enable transitions
    setTimeout(() => {
      body.classList.remove("no-transition");
    }, 0);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  return (
    <>
      <header className="bg-[#F6F6F6] dark:bg-[#212322] dark:border-[#353836] border-[#D6D5D5] border rounded-2xl z-40 w-full h-auto xl:w-[62px] py-4 flex xl:flex-col justify-between items-center xl:px-0 px-8  xl:pb-4 font-medium dark:shadow-swap-station shadow-swap-station-light">
        <div className="flex">
          <Link href={SWAPLACE_WEBSITE}>
            <SwaplaceIcon className="w-10 text-[#AABE13] dark:text-[#DDF23D]" />
          </Link>
        </div>
        <div className="xl:flex-col flex-row flex w-full">
          <SwappingIcons />
        </div>
        <div className="flex xl:flex-col gap-[16px]">
          <div className="flex justify-center">
            {isDark ? (
              <Tooltip position={"right"} content={"Light Mode"}>
                <button
                  className="cursor-pointer bg-black-500 hover:bg-[#353836] transition-colors duration-200 rounded-[10px] group"
                  onClick={() => {
                    setThemeMode("light");
                  }}
                >
                  <SunIcon className="w-10 p-2 dark:text-[#767777] group-hover:text-[#F6F6F6]" />
                </button>
              </Tooltip>
            ) : (
              <Tooltip position={"right"} content={"Dark Mode"}>
                <button
                  className="bg-black-500 outline-none hover:bg-[#E4E4E4] transition-colors duration-200 rounded-[10px]"
                  onClick={() => {
                    setThemeMode("dark");
                  }}
                >
                  <MoonIcon className="w-10 p-2 text-[#A3A9A5]" />
                </button>
              </Tooltip>
            )}
          </div>
          <NetworkDropdown
            forAuthedUser={true}
            variant={NetworkVariantPosition.VERTICAL}
          />
          <div className="h-10 w-10">
            <>
              {!!authenticatedUserAddress ? (
                <Tooltip position={"right"} content={"Your wallet"}>
                  <button
                    onClick={() => toggleSidebar()}
                    className="rounded-[10px] flex items-center justify-center"
                  >
                    <ENSAvatar avatarENSAddress={authenticatedUserAddress} />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip position={"right"} content={"Connect a Wallet"}>
                  <ConnectWallet
                    customStyle="w-full flex justify-center items-center h-10 w-10 rounded-[10px] bg-[#DDF23D]"
                    walletIcon={true}
                  />
                </Tooltip>
              )}
            </>
          </div>
        </div>
      </header>
      <WalletSidebarTemplate isOpen={isSidebarOpen} isMobile={!isWideScreen} />
    </>
  );
};

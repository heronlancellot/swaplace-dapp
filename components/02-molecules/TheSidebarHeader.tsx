import { CloseCTA, DisconnectWallet } from "@/components/01-atoms";
import { useSidebar } from "@/lib/client/contexts/SidebarContext";
import React from "react";
import cc from "classcat";
import { useTheme } from "next-themes";

export const TheSidebarHeader = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { toggleSidebar } = useSidebar();

  return (
    <div className="w-full gap-5 flex flex-col">
      <div
        className={cc([
          "rounded-full w-7 h-7 flex items-center justify-center",
          isDark
            ? "border-darkGray bg-darkGreen"
            : "border-[#D6D6D6] bg-offWhite",
        ])}
      >
        <CloseCTA
          onClick={() => toggleSidebar()}
          className={cc([isDark ? "text-frostWhite" : "text-sageGray"])}
        />
      </div>
      <div className="w-full flex justify-between">
        <h3
          className={cc([
            "text-xl",
            isDark ? "text-offWhite" : "text-blackGreen",
          ])}
        >
          Your wallet
        </h3>
        <DisconnectWallet />
      </div>
    </div>
  );
};

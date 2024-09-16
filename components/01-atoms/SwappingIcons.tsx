import {
  LeaderboardIcon,
  MarketplaceIcon,
  NotificationsIcon,
  OffersIcon,
  SwappingIcon,
  Tooltip,
} from "@/components/01-atoms";
import { useScreenSize } from "@/lib/client/hooks/useScreenSize";
import { useTheme } from "next-themes";
import { NextRouter, useRouter } from "next/router";
import { SVGProps, useState } from "react";
import cc from "classcat";

export interface IconSwap {
  id: number;
  name: string;
  href: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  disabled?: boolean;
}

export enum SwappingIconsID {
  "SWAPLACE_STATION",
  "OFFERS",
  "CHAT",
  "NOTIFICATIONS",
  "MARKETPLACE",
  "LEADERBOARD",
}

const findInitialActiveTab = (
  swappingTabs: Array<IconSwap>,
  router: NextRouter,
) => {
  const matchingTab = swappingTabs.find((tab) => router.pathname === tab.href);
  return matchingTab ? matchingTab.id : SwappingIconsID.SWAPLACE_STATION;
};

export const SwappingIcons = () => {
  const { theme } = useTheme();
  const { isWideScreen } = useScreenSize();

  const swappingTabs: Array<IconSwap> = [
    {
      id: SwappingIconsID.SWAPLACE_STATION,
      name: "Swaplace Station",
      href: "/",
      icon: SwappingIcon,
    },
    {
      id: SwappingIconsID.OFFERS,
      name: "Offers",
      href: "/offers",
      icon: OffersIcon,
    },
    {
      id: SwappingIconsID.MARKETPLACE,
      name: "Marketplace",
      href: "/marketplace",
      icon: MarketplaceIcon,
    },
    {
      id: SwappingIconsID.LEADERBOARD,
      name: "Leaderboard",
      href: "/leaderboard",
      icon: LeaderboardIcon,
    },
    // {
    //   id: SwappingIconsID.CHAT,
    //   name: "Chat",
    //   href: "/",
    //   icon: ChatIcon,
    //   disabled: true,
    // },
    {
      id: SwappingIconsID.NOTIFICATIONS,
      name: "Notifications",
      href: "/",
      icon: NotificationsIcon,
      disabled: true,
    },
  ];

  const router = useRouter();

  const [activeTab, setActiveTab] = useState(
    findInitialActiveTab(swappingTabs, router),
  );

  const handleClick = async (e: IconSwap) => {
    setActiveTab(e.id);
    router.push(e.href);
  };

  return swappingTabs.map((swappingTab) => {
    const IconComponent = swappingTab.icon;
    const isSelected = activeTab == swappingTab.id;
    const isDisabled = swappingTab.disabled;

    return (
      <div key={swappingTab.id}>
        {isWideScreen ? (
          <Tooltip position={"right"} content={swappingTab.name}>
            <div
              key={swappingTab.id}
              className={cc([
                isSelected
                  ? "dark:p-medium-bold-dark p-medium-bold border-l dark:border-yellowGreen border-limeYellow hover:dark:bg-[#333534]"
                  : "dark:p-medium-bold p-medium-bold",
                `flex-1 md:p-4 cursor-pointer ${
                  !isDisabled && "hover:dark:bg-[#343635] hover:bg-[#EFF3CF]"
                } group`,
                isDisabled && "disabled hover:cursor-not-allowed hover:none",
              ])}
              onClick={() => {
                !isDisabled && handleClick(swappingTab);
              }}
            >
              <div className="flex items-center justify-center w-full">
                <IconComponent
                  className={cc([
                    "w-5 h-5",
                    theme === "dark"
                      ? isSelected
                        ? "text-yellowGreen"
                        : "text-[#747474] group-hover:text-white"
                      : isSelected
                      ? "text-limeYellow"
                      : "text-[#c1c3c2] group-hover:text-[#4F4F4F]",
                    isDisabled && "disabled cursor-not-allowed",
                  ])}
                />
              </div>
            </div>
          </Tooltip>
        ) : (
          <Tooltip position={"bottom"} content={swappingTab.name}>
            <div
              key={swappingTab.id}
              className={cc([
                activeTab == swappingTab.id
                  ? "dark:p-medium-bold-dark p-medium-bold border-l dark:border-yellowGreen border-black hover:dark:bg-[#333534]"
                  : "dark:p-medium-bold p-medium-bold opacity-50 border-l dark:border-[#313131]",
                "flex-1 md:p-4 cursor-pointer hover:dark:bg-[#343635] hover:bg-[#EFF3CF]",
              ])}
              onClick={() => {
                handleClick(swappingTab);
              }}
            >
              <div className="flex items-center justify-center w-full">
                <IconComponent
                  className="w-8 h-8 mx-2"
                  fill={cc([theme == "dark" ? "#DDF23D" : "#4F4F4F"])}
                />
              </div>
            </div>
          </Tooltip>
        )}
      </div>
    );
  });
};

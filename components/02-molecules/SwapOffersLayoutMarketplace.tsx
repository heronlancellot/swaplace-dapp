import { AddTokenOrSwapManuallyModalMarketplace } from "./AddTokenOrSwapManuallyModalMarketplace";
import { ForWhom } from "../03-organisms";
import { ErrorIcon, NoSwapsIcon } from "@/components/01-atoms";
import { AddTokenOrSwapManuallyModalVariant } from "@/components/02-molecules";
import { useState } from "react";
import { useRouter } from "next/router";

interface EmptyLayoutOffersProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  button?: React.ReactNode;
}

export enum SwapOffersDisplayVariant {
  ERROR,
  NO_SWAPS_CREATED,
  NO_USER_AUTHENTICATED,
}

const EmptyLayoutOffers = ({
  icon,
  title,
  description,
  button,
}: EmptyLayoutOffersProps) => (
  <div className="md:w-[676px] xl:h-[656px] w-[95%] h-full p-5 dark:bg-midnightGreen bg-offWhite border rounded-2xl dark:border-darkGray border-softGray flex flex-col justify-center items-center gap-5 dark:shadow-swap-station shadow-swap-station-light">
    <div className="flex ">{icon}</div>
    <div className="flex flex-col text-center items-center">
      <p className="dark:p-medium-bold-2-dark p-medium-bold-2-dark-variant-black ">
        {title}
      </p>
      <p className="p-small dark:!text-sageGray !text-midnightGreen ">
        {description}
      </p>
    </div>
    <div className="flex">{button}</div>
  </div>
);

// Copy of SwapOffersLayout.tsx
export const SwapOffersLayoutMarketplace = ({
  variant,
}: {
  variant: SwapOffersDisplayVariant;
}) => {
  const [toggleManually, setToggleManually] = useState<boolean>(false);
  const router = useRouter();

  const handleToggleManually = () =>
    setToggleManually((prevState) => !prevState);

  const SwapOffersLayoutError = () => (
    <EmptyLayoutOffers
      icon={<ErrorIcon />}
      title={"Sorry, we couldn't load your swaps"}
      description={"Please try again later or add your swaps manually"}
      button={
        <>
          <button
            className="p-medium-bold-variant-black bg-yellowGreen border border-yellowGreen rounded-[10px] py-2 px-4 h-[38px]"
            onClick={handleToggleManually}
          >
            Add swap manually
          </button>
          {toggleManually && (
            <AddTokenOrSwapManuallyModalMarketplace
              open={toggleManually}
              forWhom={ForWhom.Yours}
              onClose={handleToggleManually}
              variant={AddTokenOrSwapManuallyModalVariant.SWAP}
            />
          )}
        </>
      }
    />
  );

  const SwapOffersLayoutErrorNoAuthenticatedUser = () => (
    <EmptyLayoutOffers
      icon={<ErrorIcon />}
      title={"No wallet connected"}
      description={"Connect a wallet to see your swap offers"}
    />
  );

  const SwapOffersLayoutNoSwapsCreated = () => (
    <EmptyLayoutOffers
      icon={<NoSwapsIcon className="dark:text-yellowGreen " />}
      title={"No swaps here. Let's fill it up!"}
      description={
        "You haven't made or received any proposals. Time to jump in and start trading."
      }
      button={
        <button
          className="p-medium-bold-variant-black bg-yellowGreen border border-yellowGreen rounded-[10px] py-2 px-4 h-[38px]"
          onClick={() => router.push("/")}
        >
          Start swapping
        </button>
      }
    />
  );

  const SwapOffersConfigLayout: Record<
    SwapOffersDisplayVariant,
    React.ReactNode
  > = {
    [SwapOffersDisplayVariant.ERROR]: <SwapOffersLayoutError />,
    [SwapOffersDisplayVariant.NO_SWAPS_CREATED]: (
      <SwapOffersLayoutNoSwapsCreated />
    ),
    [SwapOffersDisplayVariant.NO_USER_AUTHENTICATED]: (
      <SwapOffersLayoutErrorNoAuthenticatedUser />
    ),
  };

  return SwapOffersConfigLayout[variant];
};

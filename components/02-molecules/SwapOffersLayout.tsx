import { ErrorIcon, NoSwapsIcon } from "@/components/01-atoms";
import {
  AddTokenOrSwapManuallyModal,
  AddTokenOrSwapManuallyModalVariant,
} from "@/components/02-molecules";
import { ForWhom } from "@/lib/client/constants";
import { SwapDisplayScreenVariant } from "@/lib/client/ui-utils";
import { useState } from "react";
import { useRouter } from "next/router";

interface EmptyLayoutOffersProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  button?: React.ReactNode;
}

const EmptyLayoutOffers = ({
  icon,
  title,
  description,
  button,
}: EmptyLayoutOffersProps) => (
  <div className="md:w-[676px] md:h-[656px] w-[95%] h-full py-10 px-5 dark:bg-[#212322] bg-[#F6F6F6] border rounded-2xl dark:border-[#353836] border-[#D6D5D5] flex flex-col justify-center items-center gap-5 dark:shadow-swap-station shadow-swap-station-light">
    <div className="flex ">{icon}</div>
    <div className="flex flex-col text-center items-center">
      <p className="dark:p-medium-bold-2-dark p-medium-bold-2-dark-variant-black ">
        {title}
      </p>
      <p className="p-small dark:!text-[#A3A9A5] !text-[#212322] ">
        {description}
      </p>
    </div>
    <div className="flex">{button}</div>
  </div>
);

export const SwapOffersLayout = ({
  variant,
}: {
  variant: SwapDisplayScreenVariant;
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
            className="p-medium-bold-variant-black bg-[#DDF23D] border border-[#DDF23D] rounded-[10px] py-2 px-4 h-[38px]"
            onClick={handleToggleManually}
          >
            Add swap manually
          </button>
          {toggleManually && (
            <AddTokenOrSwapManuallyModal
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
      icon={<NoSwapsIcon className="dark:text-[#DDF23D] " />}
      title={"No swaps here. Let's fill it up!"}
      description={
        "You haven't made or received any proposals. Time to jump in and start trading."
      }
      button={
        <button
          className="p-medium-bold-variant-black bg-[#DDF23D] border border-[#DDF23D] rounded-[10px] py-2 px-4 h-[38px]"
          onClick={() => router.push("/")}
        >
          Start swapping
        </button>
      }
    />
  );

  const SwapOffersConfigLayout: Record<
    SwapDisplayScreenVariant,
    React.ReactNode
  > = {
    [SwapDisplayScreenVariant.ERROR]: <SwapOffersLayoutError />,
    [SwapDisplayScreenVariant.NO_SWAPS_CREATED]: (
      <SwapOffersLayoutNoSwapsCreated />
    ),
    [SwapDisplayScreenVariant.NO_USER_AUTHENTICATED]: (
      <SwapOffersLayoutErrorNoAuthenticatedUser />
    ),
  };

  return SwapOffersConfigLayout[variant];
};

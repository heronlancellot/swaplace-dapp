import { SwapContext } from "@/components/01-atoms";
import { PonderFilter, usePonder } from "@/lib/client/hooks/usePonder";
import { useState, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import cc from "classcat";

export enum DisplayFilterOptions {
  ALL_OFFERS = "All Offers",
  CREATED = "Created",
  RECEIVED = "Received",
  ACCEPTED = "Accepted",
  CANCELED = "Canceled",
  EXPIRED = "Expired",
}

export const StatusOffers = () => {
  const { setPonderFilterStatus } = useContext(SwapContext);
  const [offerIsActive, setOfferIsActive] = useState<number>(0);

  const handleFilterClick = (
    filterOption: DisplayFilterOptions,
    index: number,
  ) => {
    setOfferIsActive(index);

    switch (filterOption) {
      case DisplayFilterOptions.CREATED:
        setPonderFilterStatus(PonderFilter.CREATED);
        break;

      case DisplayFilterOptions.RECEIVED:
        setPonderFilterStatus(PonderFilter.RECEIVED);
        break;

      case DisplayFilterOptions.ACCEPTED:
        setPonderFilterStatus(PonderFilter.ACCEPTED);
        break;

      case DisplayFilterOptions.CANCELED:
        setPonderFilterStatus(PonderFilter.CANCELED);
        break;

      case DisplayFilterOptions.EXPIRED:
        setPonderFilterStatus(PonderFilter.EXPIRED);
        break;

      default:
        setPonderFilterStatus(PonderFilter.ALL_OFFERS);
        break;
    }
  };

  return (
    <>
      {Object.keys(DisplayFilterOptions).map((key, index) => {
        return (
          <button
            className={cc([
              "h-11 w-full dark:shadow-swap-station border border-solid border-[#353836] flex justify-between items-center px-3 bg-[#F2F2F2] group rounded-[10px] dark:bg-[#212322] mb-3 font-onest leading-5",
              offerIsActive === index
                ? "dark:shadow-[0px_0px_8px_1px_#83980026] dark:border-[#505150] dark:bg-[#212322]"
                : "dark:hover:bg-[#282B29]",
            ])}
            key={index}
            onClick={() =>
              handleFilterClick(key as DisplayFilterOptions, index)
            }
          >
            <div
              className={cc([
                offerIsActive === index
                  ? "dark:text-[#DDF23D]"
                  : "dark:text-[#A3A9A5] dark:group-hover:text-[#F6F6F6]",
              ])}
            >
              {DisplayFilterOptions[key as keyof typeof DisplayFilterOptions]}
            </div>
          </button>
        );
      })}
      {/* Temporary button to fetch more  */}
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? "Loading..." : "Load More"}
      </button>
    </>
  );
};

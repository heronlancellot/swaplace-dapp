import { SwapContext } from "@/components/01-atoms";
import { PonderFilter, usePonder } from "@/lib/client/hooks/usePonderRq";
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
  const {
    /*allSwaps*/ data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = usePonder();
  console.log(
    "AllSwaps Ponder Status Filter = ",
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
  );
  interface IFilterOffers {
    id: number;
    name: DisplayFilterOptions;
  }

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const OffersFilter: Record<DisplayFilterOptions, IFilterOffers> = {
    [DisplayFilterOptions.ALL_OFFERS]: {
      id: 1,
      name: DisplayFilterOptions.ALL_OFFERS,
    },
    [DisplayFilterOptions.CREATED]: {
      id: 2,
      name: DisplayFilterOptions.CREATED,
    },
    [DisplayFilterOptions.RECEIVED]: {
      id: 3,
      name: DisplayFilterOptions.RECEIVED,
    },
    [DisplayFilterOptions.ACCEPTED]: {
      id: 4,
      name: DisplayFilterOptions.ACCEPTED,
    },
    [DisplayFilterOptions.CANCELED]: {
      id: 5,
      name: DisplayFilterOptions.CANCELED,
    },
    [DisplayFilterOptions.EXPIRED]: {
      id: 6,
      name: DisplayFilterOptions.EXPIRED,
    },
  };

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

      default:
        setPonderFilterStatus(PonderFilter.ALL_OFFERS);
        break;
    }
  };

  return (
    <>
      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        error && <div>{error.message}</div> // Check if error is not null
      ) : (
        data && ( // Check if data is not undefined
          <div className="flex flex-col gap-2">
            {data.pages.map((page) => (
              <div
                key={page.pageInfo.endCursor}
                className="flex flex-col gap-2"
              >
                {page.items.map((item) => (
                  <div
                    key={item.swapId}
                    className="rounded-md bg-grayscale-700 p-4"
                  >
                    {item.status}, {item.swapId}
                  </div>
                ))}
              </div>
            ))}
            <div ref={ref}>{isFetchingNextPage && "Loading..."}</div>
          </div>
        )
      )}

      {Object.keys(OffersFilter).map((key, index) => {
        const filterOption = key as DisplayFilterOptions;
        const { id, name } = OffersFilter[filterOption];

        return (
          <div
            className={cc([
              "h-11 dark:shadow-swap-station border border-solid border-[#353836] flex justify-between items-center px-3 bg-[#F2F2F2] group rounded-[10px] dark:bg-[#212322] mb-3 font-onest leading-5",
              offerIsActive === index
                ? "dark:shadow-[0px_0px_8px_1px_#83980026] dark:border-[#505150] dark:bg-[#212322]"
                : "dark:hover:bg-[#282B29]",
            ])}
            key={index}
            onClick={() => handleFilterClick(filterOption, index)}
          >
            <div
              className={cc([
                offerIsActive === index
                  ? "dark:text-[#DDF23D]"
                  : "dark:text-[#A3A9A5] dark:group-hover:text-[#F6F6F6]",
              ])}
            >
              {name}
            </div>
            <div
              className={cc([
                "bg-[#c7c7c7] rounded px-2 w-9 h-6 flex justify-center items-center dark:p-small-dark p-small dark:group-hover:bg-[#353836]",
                offerIsActive === index
                  ? "dark:bg-[#353836]"
                  : "dark:bg-[#282B29]",
              ])}
            >
              {id}
            </div>
          </div>
        );
      })}
    </>
  );
};

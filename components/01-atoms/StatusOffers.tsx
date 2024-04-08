import { OffersContext, PonderFilter } from "@/components/01-atoms";
import { useState, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import cc from "classcat";

export const StatusOffers = () => {
  const [offerIsActive, setOfferIsActive] = useState<number>(0);
  const { setOffersFilter, fetchNextPage } = useContext(OffersContext);

  const { inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleFilterClick = (filterOption: PonderFilter, index: number) => {
    setOfferIsActive(index);

    switch (filterOption) {
      case PonderFilter.CREATED:
        setOffersFilter(PonderFilter.CREATED);
        break;

      case PonderFilter.RECEIVED:
        setOffersFilter(PonderFilter.RECEIVED);
        break;

      case PonderFilter.ACCEPTED:
        setOffersFilter(PonderFilter.ACCEPTED);
        break;

      case PonderFilter.CANCELED:
        setOffersFilter(PonderFilter.CANCELED);
        break;

      case PonderFilter.EXPIRED:
        setOffersFilter(PonderFilter.EXPIRED);
        break;

      default:
        setOffersFilter(PonderFilter.ALL_OFFERS);
        break;
    }
  };

  return (
    <>
      {Object.values(PonderFilter).map((filter, index) => {
        return (
          <button
            className={cc([
              "h-11 w-full dark:shadow-swap-station border border-solid border-[#353836] flex justify-between items-center px-3 bg-[#F2F2F2] group rounded-[10px] dark:bg-[#212322] mb-3 font-onest leading-5",
              offerIsActive === index
                ? "dark:shadow-[0px_0px_8px_1px_#83980026] dark:border-[#505150] dark:bg-[#212322]"
                : "dark:hover:bg-[#282B29]",
            ])}
            key={index}
            onClick={() => handleFilterClick(filter, index)}
          >
            <div
              className={cc([
                offerIsActive === index
                  ? "dark:text-[#DDF23D]"
                  : "dark:text-[#A3A9A5] dark:group-hover:text-[#F6F6F6]",
              ])}
            >
              {filter}
            </div>
          </button>
        );
      })}
    </>
  );
};

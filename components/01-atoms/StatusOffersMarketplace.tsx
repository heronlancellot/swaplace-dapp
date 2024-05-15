import { PonderFilter, MarketplaceContext } from "@/lib/client/contexts";
import { useState, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import cc from "classcat";

export const StatusOffersMarketplace = () => {
  const [offerIsActive, setOfferIsActive] = useState<number>(0);
  const { setOffersFilter, fetchNextPage } = useContext(MarketplaceContext);

  const { inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleFilterClick = (filterOption: PonderFilter, index: number) => {
    setOfferIsActive(index);

    switch (filterOption) {
      default:
        setOffersFilter(PonderFilter.ALL_OFFERS);
        break;
    }
  };

  return (
    <>
      <button
        className={cc([
          "h-11 w-full border border-solid border-[#D6D5D5] dark:border-[#353836] flex justify-between items-center px-3 bg-[#F6F6F6] group rounded-[10px] dark:bg-[#212322] mb-3 font-onest leading-5 dark:shadow-swap-station shadow-swap-station-light",
          offerIsActive === 0
            ? "dark:shadow-[0px_0px_8px_1px_#83980026] dark:border-[#505150] dark:bg-[#212322]"
            : "dark:hover:bg-[#282B29]",
        ])}
        onClick={() => handleFilterClick(PonderFilter.ALL_OFFERS, 0)}
      >
        <div
          className={cc([
            offerIsActive === 0
              ? "dark:text-[#DDF23D]"
              : "dark:text-[#A3A9A5] dark:group-hover:text-[#F6F6F6]",
          ])}
        >
          {PonderFilter.ALL_OFFERS}
        </div>
      </button>
    </>
  );
};

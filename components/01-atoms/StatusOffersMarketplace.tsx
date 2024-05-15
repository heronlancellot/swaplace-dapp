import { PonderFilter, MarketplaceContext } from "@/lib/client/contexts";
import { useState, useContext } from "react";
import cc from "classcat";

/**
 * StatusOffersMarketplace component is a reusable component that displays the status of the offers in the marketplace.
 *  - The component is used to filter the offers based on All Offers.
 */
export const StatusOffersMarketplace = () => {
  const [offerIsActive, setOfferIsActive] = useState<number>(0);
  const { setOffersFilterMarketplace } = useContext(MarketplaceContext);

  const handleFilterClick = (filterOption: PonderFilter, index: number) => {
    setOfferIsActive(index);

    switch (filterOption) {
      default:
        setOffersFilterMarketplace(PonderFilter.ALL_OFFERS);
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

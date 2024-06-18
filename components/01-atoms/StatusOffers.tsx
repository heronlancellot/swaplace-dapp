/* eslint-disable react-hooks/exhaustive-deps */
import { FilterVariant } from "../02-molecules";
import { OffersContext, PonderFilter } from "@/lib/client/contexts";
import { OffersContextMarketplace } from "@/lib/client/contexts/OffersContextMarketplace";
import { useState, useContext, useEffect } from "react";

import cc from "classcat";

export const StatusOffers = ({ variant }: { variant: FilterVariant }) => {
  const OffersBody = () => {
    const [offerIsActive, setOfferIsActive] = useState<number>(1);
    const { setOffersFilter } = useContext(OffersContext);

    useEffect(() => {
      if (offerIsActive === 1) {
        setOffersFilter(PonderFilter.CREATED);
      }
    }, []);

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
                "h-11 w-full border border-solid border-[#D6D5D5] dark:border-[#353836] flex justify-between items-center px-3 bg-[#F6F6F6] group rounded-[10px] dark:bg-[#212322] mb-3 font-onest leading-5 dark:shadow-swap-station shadow-swap-station-light",
                offerIsActive === index
                  ? "dark:shadow-[0px_0px_8px_1px_#83980026] dark:border-[#505150] dark:bg-[#212322]"
                  : "dark:hover:bg-[#282B29]",
              ])}
              key={index}
              onClick={() => handleFilterClick(filter, index)}
              value={PonderFilter.ALL_OFFERS}
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
  const MarketplaceBody = () => {
    const [offerIsActive, setOfferIsActive] = useState<number>(0);
    const { setOffersFilter } = useContext(OffersContextMarketplace);

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

  const StatusOffersConfig: Record<FilterVariant, JSX.Element> = {
    [FilterVariant.OFFERS]: <OffersBody />,
    [FilterVariant.MARKETPLACE]: <MarketplaceBody />,
  };

  return StatusOffersConfig[variant];
};

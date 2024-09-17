import { SwapOffersMarketplace } from "../03-organisms/SwapOffersMarketplace";
import {
  FilterOffers,
  FilterVariant,
  TheHeader,
} from "@/components/02-molecules";

export const OffersSectionMarketplace = () => {
  return (
    <div className="max-w-[1280px] max-h-[720px] w-full flex xl:flex-row flex-col xl:justify-center h-full">
      <TheHeader />
      <section className="flex items-center xl:px-[60px] pt-[32px] xl:flex-row flex-col">
        <div className="flex flex-row h-full xl:w-[1098px] w-[95%] justify-between xl:items-start md:items-center">
          <div className="flex flex-row w-full h-full gap-4">
            <FilterOffers variant={FilterVariant.MARKETPLACE} />
            <div className="flex xl:flex-col w-full items-center h-full overflow-auto no-scrollbar">
              <SwapOffersMarketplace />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

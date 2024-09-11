import { StatusOffers } from "@/components/01-atoms";

export enum FilterVariant {
  MARKETPLACE = "MARKETPLACE",
  OFFERS = "OFFERS",
}
export const FilterOffers = ({ variant }: { variant: FilterVariant }) => {
  const FilterOffersConfig: Record<FilterVariant, JSX.Element> = {
    [FilterVariant.OFFERS]: (
      <div className="flex">
        <div className="xl:w-[342px] w-[200px] xl:h-[656px] gap-6 flex flex-col">
          <div className="dark:title-h2-medium-dark title-h2-medium ">
            <h2>Offers</h2>
          </div>
          <div>
            <StatusOffers variant={variant} />
          </div>
        </div>
      </div>
    ),
    [FilterVariant.MARKETPLACE]: (
      <div className="flex">
        <div className="xl:w-[342px] w-[200px] xl:h-[656px] gap-6 flex flex-col">
          <div className="dark:title-h2-medium-dark title-h2-medium ">
            <h2>Marketplace</h2>
          </div>
          <div>
            <StatusOffers variant={variant} />
          </div>
        </div>
      </div>
    ),
  };

  return FilterOffersConfig[variant];
};

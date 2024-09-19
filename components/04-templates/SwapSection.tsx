import { TheHeader } from "@/components/02-molecules";
import {
  SwapConnection,
  SwapStation,
  SwappingShelfs,
} from "@/components/03-organisms";

export const SwapSection = () => {
  return (
    <div className="max-w-[1280px] xl:max-h-[720px] w-full flex xl:flex-row flex-col lg:justify-center">
      <TheHeader />
      <section className="flex items-center xl:px-[60px] pt-8 xl:flex-row flex-col">
        <div className="flex lg:flex-row flex-col xl:h-[656px] xl:w-[1098px] lg:gap-[20px] w-[95%] gap-2 xl:pt-0">
          <div className="flex flex-col lg:w-[600px] gap-8">
            <SwapConnection />
            <SwappingShelfs />
          </div>
          <div className="flex xl:w-[478px] lg:w-full ">
            <SwapStation />
          </div>
        </div>
      </section>
    </div>
  );
};

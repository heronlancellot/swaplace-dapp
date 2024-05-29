import { SwapContext } from "@/lib/client/contexts";
import { useContext } from "react";

/**
 * OfferExpiryConfirmSwap copy component
 * This componente use the SwapContext to get the timeDate value
 */
export const OfferExpiryConfirmSwapStation = () => {
  const { timeDate } = useContext(SwapContext);

  let formattedSwapExpiryDate = null;
  let isDateValid = true;

  const swapExpiryDate = new Date(Number(timeDate) * 1000);

  if (isNaN(swapExpiryDate.getTime())) {
    isDateValid = false;
  }

  const day = swapExpiryDate.getDate(); // Day of the month
  const month = swapExpiryDate.toLocaleString("default", { month: "short" }); // Month abbreviation
  const year = swapExpiryDate.getFullYear(); // Year

  formattedSwapExpiryDate = isDateValid ? `${day} ${month} ${year}` : null;

  return (
    <div className="flex justify-between items-center self-stretch px-3 py-2 h-10 border rounded-lg border-solid dark:border-[#353836] border-[#353836] dark:bg-[#282B29] bg-[#DDF23D]">
      <p className="text-sm font-onest font-normal dark:text-[#A3A9A5] text-[#505150]">
        Offer expires in
      </p>
      <p className="text-sm font-onest font-normal dark:text-[#F6F6F6] text-[#707572]">
        {formattedSwapExpiryDate}
      </p>
    </div>
  );
};

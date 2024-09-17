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
  // 31 Dec 1969 means the timeDate is equals 0n
  if (timeDate === 0n) formattedSwapExpiryDate = "dd/mm/yyyy";
  return (
    <div className="flex justify-between items-center self-stretch px-3 py-2 h-10 border rounded-lg border-solid dark:border-darkGray border-darkGray dark:bg-darkGreen bg-yellowGreen">
      <p className="text-sm font-onest font-normal dark:text-sageGray text-smokeGray">
        Offer expires in
      </p>
      <p className="text-sm font-onest font-normal dark:text-offWhite text-mediumGray">
        {formattedSwapExpiryDate}
      </p>
    </div>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { SwapContext } from "@/components/01-atoms";
import { useContext, useEffect, useState } from "react";
import cc from "classcat";
import { useTheme } from "next-themes";

export const SwapExpireTime = () => {
  const { setTimeDate } = useContext(SwapContext);
  const [dateTimestamp, setDateTimestamp] = useState<number>(0);
  const { theme } = useTheme();

  const fetchData = async (dateTimestamp: number) => {
    try {
      const dateTimestampBigInt = BigInt(dateTimestamp / 1000);
      setTimeDate(dateTimestampBigInt);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchData(dateTimestamp);
  }, [dateTimestamp]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    const timestamp = new Date(selectedDate).getTime();
    setDateTimestamp(timestamp);
    fetchData(dateTimestamp);
  };

  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const inputType = isFirefox || isSafari ? "date" : "datetime-local";

  return (
    <div className="flex">
      <input
        type={inputType}
        className={cc([
          "rounded-lg border flex items-center xl:py-2 xl:px-3 p-small-variant-black-2 dark:p-small-dark-variant-grey focus:outline-none  focus:bg-transparent px-2  opacity-80 transition duration-300 ease-in-out focus:outline-none",
          theme == "light"
            ? "bg-[#F6F6F6] border-[#E4E4E4] hover:border-[#AABE13] hover:shadow-[0_0_6px_1px_#00000014] focus:shadow-[0_0_6px_1px_#00000014] focus:border-opacity-100"
            : "dark:bg-[#282B29] bg-[#E4E4E4] dark:border-[#353836] border-[#E4E4E4] dark:hover:border-[#edff6259] hover:dark:shadow-[0_0_6px_1px_#00000066] focus:dark:shadow-[0_0_6px_1px_#00000066]",
        ])}
        onChange={handleDateChange}
      />
    </div>
  );
};

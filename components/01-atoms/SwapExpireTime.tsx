/* eslint-disable react-hooks/exhaustive-deps */
import { SwapContext } from "@/lib/client/contexts";
import { useContext, useEffect, useState } from "react";
import cc from "classcat";

export const SwapExpireTime = () => {
  const { setTimeDate } = useContext(SwapContext);
  const [dateTimestamp, setDateTimestamp] = useState<number>(0);

  const fetchData = async (dateTimestamp: number) => {
    try {
      const dateTimestampBigInt = BigInt(dateTimestamp / 1000); // Transform the timestamp to seconds to send to contract
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
    const selectedUTCTimestamp = new Date(selectedDate).getTime(); // Time in UTC
    const timezoneOffsetUtcLocalDifference =
      new Date().getTimezoneOffset() * 60000; // Offset in milliseconds
    const localTimestamp =
      selectedUTCTimestamp + timezoneOffsetUtcLocalDifference; // Adds the offset to get local time
    setDateTimestamp(localTimestamp); // Sets the UTC timestamp
    fetchData(localTimestamp); // Sends the local timestamp to the fetchData function
  };

  return (
    <div className="flex">
      <input
        type={"date"}
        className={cc([
          "rounded-lg border flex items-center xl:py-2 xl:px-3 p-small-variant-black-2 dark:p-small-dark-variant-grey focus:outline-none  focus:bg-transparent px-2  opacity-80 transition duration-300 ease-in-out ",
          "bg-[#F6F6F6] border-[#E4E4E4] hover:border-[#AABE13] hover:shadow-[0_0_6px_1px_#00000014] focus:shadow-[0_0_6px_1px_#00000014] focus:border-opacity-100 dark:bg-[#282B29] dark:border-[#353836] dark:hover:border-[#edff6259] dark:hover:dark:shadow-[0_0_6px_1px_#00000066] dark:focus:dark:shadow-[0_0_6px_1px_#00000066]",
        ])}
        onChange={handleDateChange}
      />
    </div>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { SwapContext } from "@/components/01-atoms";
import { useContext, useEffect, useState } from "react";

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
    const timestamp = new Date(selectedDate).getTime();
    setDateTimestamp(timestamp);
    fetchData(dateTimestamp);
  };

  return (
    <div className="flex">
      <input
        type="date"
        className={
          "appearance-none  dark:bg-[#353836] bg-[#E4E4E4] rounded-l-lg border dark:border-[#353836] border-[#E4E4E4] flex items-center xl:py-2 xl:px-3 p-small-variant-black-2 dark:p-small-dark-variant-grey focus:outline-none active:bg-current focus:bg-transparent px-2"
        }
        onChange={handleDateChange}
      />
    </div>
  );
};

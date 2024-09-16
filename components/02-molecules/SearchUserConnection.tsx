import { SearchBar, SwappingSearchTab } from "@/components/01-atoms";

export const SearchUserConnection = () => {
  return (
    <div className="gap-2 xl:w-full max-h-[72px] flex flex-col rounded">
      <div className="w-full flex justify-between space-x-6">
        <h2 className="p-normal-2-light dark:p-normal-2-dark contrast-50">
          Who are you swapping with today?
        </h2>
      </div>
      <div className="flex w-full items-center border rounded-2xl pl-4 pr-3 gap-4 bg-offWhite hover:bg-lightFrost hover:shadow-[0_0_6px_1px_#00000014] dark:bg-midnightGreen border-softGray hover:border-limeYellow dark:border-darkGray focus:border-white dark:hover:border-softLemon dark:shadow-swap-station shadow-swap-connection-light transition duration-300 ease-in-out">
        <SwappingSearchTab />
        <SearchBar />
      </div>
    </div>
  );
};

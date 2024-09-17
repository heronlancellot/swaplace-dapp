import { LeaderboardTable } from "../01-atoms/LeaderboardTable";
import { TheHeader } from "@/components/02-molecules";

export const LeaderboardSection = () => {
  return (
    <div className="max-w-[1280px] max-h-[720px] w-full flex xl:flex-row flex-col xl:justify-center h-full">
      <TheHeader />
      <section className="flex items-center xl:px-[60px] xl:pt-0 pt-[32px] xl:flex-row flex-col">
        <div className="flex xl:flex-row flex-col h-full xl:w-[1098px] w-[95%] justify-between xl:items-start md:items-center">
          <LeaderboardTable />
        </div>
      </section>
    </div>
  );
};

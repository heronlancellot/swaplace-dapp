import React from "react";
import cc from "classcat";

export const ApproveTokenCardSkeleton = () => {
  return (
    <div
      className={cc([
        "flex p-4 items-center gap-4 max-h-[68px] animate-pulse",
        "dark:bg-forestGray bg-lightGray p-medium dark:p-medium-dark dark:hover:p-medium dark:hover:text-midnightGreen dark:hover:bg-yellowGreen hover:bg-yellowGreen transition rounded-xl border border-darkGray",
      ])}
      role="button"
    >
      <div className="flex gap-4 w-[75%] items-center">
        <div className="bg-mediumGray h-12 w-12 rounded-[8px]"></div>
        <div className="flex flex-col gap-1">
          <div className="flex">
            <p className="bg-mediumGray rounded-[4px] min-h-4 items-center flex w-10" />
          </div>
          <div className="flex p-semibold-dark">
            <p className="bg-mediumGray dark:bg-smokeGray p-1.5 rounded-[4px] min-h-6 items-center flex w-20" />
          </div>
        </div>
      </div>
      <div
        role="button"
        className="flex pointer-events-auto items-center"
        onClick={(event) => event.stopPropagation()}
      ></div>
    </div>
  );
};

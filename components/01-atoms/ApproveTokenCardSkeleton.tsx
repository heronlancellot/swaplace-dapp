import React from "react";
import cc from "classcat";

export const ApproveTokenCardSkeleton = () => {
  return (
    <div
      className={cc([
        "flex p-4 items-center gap-4 max-h-[68px] animate-pulse",
        "dark:bg-[#363836] bg-[#e0e0e0] p-medium dark:p-medium-dark dark:hover:p-medium dark:hover:text-[#212322] dark:hover:bg-[#DDF23D] hover:bg-[#DDF23D] transition rounded-xl border border-[#353836]",
      ])}
      role="button"
    >
      <div className="flex gap-4 w-[75%] items-center">
        <div className="bg-[#707572] h-12 w-12 rounded-[8px]"></div>
        <div className="flex flex-col gap-1">
          <div className="flex">
            <p className="bg-[#707572] rounded-[4px] min-h-4 items-center flex w-10" />
          </div>
          <div className="flex p-semibold-dark">
            <p className="bg-[#707572] dark:bg-[#505150] p-1.5 rounded-[4px] min-h-6 items-center flex w-20" />
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

import React from "react";

export const TokenOfferDetailsSkeleton = () => {
  return (
    <div className="flex justify-between px-3 p-2">
      <div className="flex p-small dark:!text-sageGray items-center gap-2">
        <div className="w-[80px] !bg-yellowGreen opacity-40 rounded-lg h-6" />
        <div className="w-[160px] !bg-yellowGreen opacity-40 rounded-lg h-4" />
        <div className="w-[100px] !bg-yellowGreen opacity-40 rounded-lg h-4" />
      </div>
      <div className="flex gap-2 justify-center items-center">
        <div className="w-[90px] bg-yellowGreen opacity-40 h-6 rounded-full" />
        <div className="w-[12px] bg-yellowGreen opacity-40 h-6 rounded-full" />
      </div>
    </div>
  );
};

export const TokenCardSkeleton = () => {
  return (
    <div className="w-[326px] h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="ens-avatar-small bg-yellowGreen opacity-40" />
        <div className="w-40 h-4 bg-yellowGreen opacity-40 rounded-full" />
      </div>
      <div className="flex gap-4">
        <div className="card-token-medium !mx-0 !bg-yellowGreen opacity-40" />
        <div className="card-token-medium !mx-0 !bg-yellowGreen opacity-40" />
        <div className="card-token-medium !mx-0 !bg-yellowGreen opacity-40" />
        <div className="card-token-medium !mx-0 !bg-yellowGreen opacity-40" />
      </div>
      <div className="flex justify-between py-1 px-2">
        <div className="w-[60px] h-[20px] bg-yellowGreen opacity-40 rounded-full" />
        <div className="w-[135px] h-[20px] bg-yellowGreen opacity-40 rounded-full" />
      </div>
    </div>
  );
};

export const TokensOfferSkeleton = () => {
  return (
    <div className="flex flex-col border border-[#35383640] shadow-swap-connection-light dark:bg-darkGreen rounded-lg w-[716px] h-full animate-pulse">
      <div className="flex border-b border-[#35383640]">
        <div className="border-r p-4 dark:border-darkGray">
          <TokenCardSkeleton />
        </div>
        <div className="flex p-4">
          <TokenCardSkeleton />
        </div>
      </div>
      <TokenOfferDetailsSkeleton />
    </div>
  );
};

import { HTMLProps } from "react";

export const LoadingIndicator = (props: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    className="animate-spin rounded-full h-4 w-4 border-t-2 dark:border-[#212322] border-[#212322]"
  />
);

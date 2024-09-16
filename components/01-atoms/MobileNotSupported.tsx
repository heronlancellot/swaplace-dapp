import { ErrorIcon, SwaplaceIcon } from "@/components/01-atoms";
import { useScreenSize } from "@/lib/client/hooks/useScreenSize";

export const WarningScreenSizeNotSupported = () => {
  const { isMobile, isTablet } = useScreenSize();
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center py-8 px-6 gap-6">
      <div className="flex gap-1">
        <SwaplaceIcon className="w-9 text-limeYellow dark:text-yellowGreen" />
        <p>swaplace</p>
      </div>
      <div className="w-full h-full px-5 border border-darkGray dark:bg-midnightGreen bg-offWhite rounded-lg flex flex-col justify-center items-center gap-6">
        <div className="flex ">
          <ErrorIcon />
        </div>
        <div className="flex flex-col text-center items-center">
          <div className="dark:p-medium-bold-2-dark p-medium-bold-2-dark-variant-black ">
            {isTablet ? (
              <p>Oh no, tablet isn&apos;t available yet!</p>
            ) : isMobile ? (
              <p>Oh no, mobile isn&apos;t available yet!</p>
            ) : null}
          </div>
          <p className="p-small dark:!text-sageGray !text-midnightGreen ">
            Please try our desktop version to get a better experience
          </p>
        </div>
      </div>
    </div>
  );
};

import cc from "classcat";

interface ProgressBarProps {
  currentStep: number;
  numberOfItems: number;
}

export const ProgressBar = ({
  currentStep,
  numberOfItems,
}: ProgressBarProps) => {
  return (
    <div className="w-full flex items-center rounded-lg overflow-hidden">
      {Array(numberOfItems)
        .fill(0)
        .map((_, index) => {
          return (
            <div
              key={index}
              className={cc([
                "h-2 w-full",
                {
                  "bg-yellowGreen": currentStep > index,
                  "bg-darkGray": currentStep <= index,
                },
              ])}
            />
          );
        })}
    </div>
  );
};

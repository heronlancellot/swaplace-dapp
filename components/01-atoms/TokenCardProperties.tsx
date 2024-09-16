interface PropertiesInfo {
  amount: number;
  value?: number;
}

interface TokenCardPropertiesProps {
  properties: PropertiesInfo;
}

export const TokenCardProperties = ({
  properties,
}: TokenCardPropertiesProps) => {
  return (
    <div>
      <div className="flex justify-between items-center py-1 px-2 dark:bg-darkGray bg-lightSilver rounded-lg">
        <div className="dark:p-small-dark">{properties.amount} item(s)</div>

        {properties.value && (
          <div className="flex">
            <p className="dark:p-small-dark p-small-variant-black">
              {properties.value} ETH
            </p>
            <p className="dark:p-small-dark dark:!text-sageGray p-small-variant-black">
              &nbsp; (${properties.value})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

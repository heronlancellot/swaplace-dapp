import { ADDRESS_ZERO } from "@/lib/client/constants";
import { SwapContext } from "@/lib/client/contexts";
import { EthereumAddress } from "@/lib/shared/types";
import { useContext, useState } from "react";

/**
 * This component is a checkbox that allows the user to select any user to swap tokens with.
 *  This is useful when the user doesn't have a specific address to swap with.
 *  It sets the validated address to swap to the zero address. ( Allowed = 0 )
 *
 */
export const SelectAnyUserToSwap = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { setValidatedAddressToSwap } = useContext(SwapContext);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setValidatedAddressToSwap(new EthereumAddress(ADDRESS_ZERO));
    } else {
      setValidatedAddressToSwap(null);
    }
  };

  return (
    <div className="flex gap-1">
      <label
        htmlFor="toggle"
        className="flex items-center cursor-pointer p-small-variant-black-3 dark:p-small-variant-light-2 contrast-50"
      >
        Public Swap
      </label>
      <input
        type="checkbox"
        id="toggle"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </div>
  );
};

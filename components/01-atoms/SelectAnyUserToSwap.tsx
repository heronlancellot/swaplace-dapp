import { ADDRESS_ZERO } from "@/lib/client/constants";
import { SwapContext } from "@/lib/client/contexts";
import { EthereumAddress } from "@/lib/shared/types";
import { useContext, useState } from "react";

export const SelectAnyUserToSwap = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { setValidatedAddressToSwap } = useContext(SwapContext);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setValidatedAddressToSwap(new EthereumAddress(ADDRESS_ZERO));
    }
  };

  return (
    <div className="flex">
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        Any User
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

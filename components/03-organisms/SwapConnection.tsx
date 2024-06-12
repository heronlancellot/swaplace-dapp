import {
  SearchUserConnection,
  SelectChainNetwork,
} from "@/components/02-molecules";

export const SwapConnection = () => {
  return (
    <div className="lg:max-h-[184px] flex flex-col gap-5">
      <SearchUserConnection />
      <SelectChainNetwork />
    </div>
  );
};

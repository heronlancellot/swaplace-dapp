import { ForWhom } from "../03-organisms";
import {
  AddTokenOrSwapManuallyModal,
  AddTokenOrSwapManuallyModalVariant,
} from "@/components/02-molecules";
import { PlusIcon, Tooltip } from "@/components/01-atoms";
import { useState } from "react";
interface AddTokenCardManuallyProps {
  forWhom: ForWhom;
}

export const AddTokenCardManually = ({
  forWhom,
}: AddTokenCardManuallyProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip position="top" content="Add Token">
        <button
          onClick={() => setOpen(!open)}
          className="relative flex flex-col items-center justify-center shadow-inner w-[80px] h-[80px] rounded-xl border-2 border-[#E0E0E0] dark:border-[#212322] bg-[#DDF23D10] hover:bg-[#DDF23D20] transition-all duration-200 cursor-pointer"
        >
          <PlusIcon />
        </button>
      </Tooltip>

      <AddTokenOrSwapManuallyModal
        variant={AddTokenOrSwapManuallyModalVariant.TOKEN}
        onClose={() => setOpen(false)}
        forWhom={forWhom}
        open={open}
      />
    </>
  );
};

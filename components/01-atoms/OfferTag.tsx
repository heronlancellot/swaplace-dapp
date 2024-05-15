import { PonderFilter } from "@/lib/client/contexts/OffersContext";

enum SwapStatus {
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
}

export const OfferTag = ({ status }: { status: PonderFilter }) => {
  const PonderTagFilters: Record<PonderFilter, React.JSX.Element> = {
    [PonderFilter.ACCEPTED]: (
      <div className="bg-[#10584C] p-1 rounded">{SwapStatus.ACCEPTED}</div>
    ),
    [PonderFilter.CANCELED]: (
      <div className="bg-[#D7544E] p-1 rounded">{SwapStatus.CANCELED}</div>
    ),
    [PonderFilter.EXPIRED]: (
      <div className="bg-[#4A4F80] p-1 rounded">{SwapStatus.EXPIRED}</div>
    ),
    [PonderFilter.RECEIVED]: (
      <div className="bg-[#DE7B30] p-1 rounded">{SwapStatus.PENDING}</div>
    ),
    [PonderFilter.ALL_OFFERS]: (
      <div className="bg-[#DE7B30] p-1 rounded">{SwapStatus.PENDING}</div>
    ),
    [PonderFilter.CREATED]: (
      <div className="bg-[#DE7B30] p-1 rounded">{SwapStatus.PENDING}</div>
    ),
  };

  return (
    <div className="shadow-tag p-semibold-dark flex items-center">
      {PonderTagFilters[status]}
    </div>
  );
};

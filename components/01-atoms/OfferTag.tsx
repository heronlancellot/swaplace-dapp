import { PonderFilter } from "@/lib/client/contexts/OffersContext";

export const OfferTag = ({ status }: { status: PonderFilter }) => {
  interface PonderFilterConfig {
    body: React.ReactNode;
  }

  enum SwapStatus {
    ACCEPTED = "ACCEPTED",
    CANCELED = "CANCELED",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING",
  }

  const PonderTagFilters: Record<PonderFilter, PonderFilterConfig> = {
    [PonderFilter.ACCEPTED]: {
      body: (
        <div className="bg-[#10584C] p-1 rounded">{SwapStatus.ACCEPTED}</div>
      ),
    },
    [PonderFilter.CANCELED]: {
      body: (
        <div className="bg-[#D7544E] p-1 rounded">{SwapStatus.CANCELED}</div>
      ),
    },
    [PonderFilter.EXPIRED]: {
      body: (
        <div className="bg-[#4A4F80] p-1 rounded">{SwapStatus.EXPIRED}</div>
      ),
    },
    [PonderFilter.RECEIVED]: {
      body: (
        <div className="bg-vividTangerine p-1 rounded">
          {SwapStatus.PENDING}
        </div>
      ),
    },
    [PonderFilter.ALL_OFFERS]: {
      body: (
        <div className="bg-vividTangerine p-1 rounded">
          {SwapStatus.PENDING}
        </div>
      ),
    },
    [PonderFilter.CREATED]: {
      body: (
        <div className="bg-vividTangerine p-1 rounded">
          {SwapStatus.PENDING}
        </div>
      ),
    },
    [PonderFilter.MARKETPLACE]: {
      body: (
        <div className="bg-vividTangerine p-1 rounded">
          {SwapStatus.PENDING}
        </div>
      ),
    },
  };

  return (
    <div className="shadow-tag p-semibold-dark flex items-center">
      {PonderTagFilters[status].body}
    </div>
  );
};

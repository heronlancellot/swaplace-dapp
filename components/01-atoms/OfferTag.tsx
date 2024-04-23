import { PonderFilter } from "./OffersContext";

export const OfferTag = ({ status }: { status: PonderFilter }) => {
  interface PonderFilterConfig {
    body: React.ReactNode;
  }

  const PonderTagFilters: Record<PonderFilter, PonderFilterConfig> = {
    [PonderFilter.ACCEPTED]: {
      body: (
        <div className="bg-[#10584C] p-1 rounded">{PonderFilter.ACCEPTED}</div>
      ),
    },
    [PonderFilter.CANCELED]: {
      body: (
        <div className="bg-[#D7544E] p-1 rounded">{PonderFilter.CANCELED}</div>
      ),
    },
    [PonderFilter.EXPIRED]: {
      body: (
        <div className="bg-[#4A4F80] p-1 rounded">{PonderFilter.EXPIRED}</div>
      ),
    },
    // Todo: Check the color of received && compare if the auth user is the owner of the swap
    [PonderFilter.RECEIVED]: {
      body: (
        <div className="bg-[#DE7B30] p-1 rounded">{PonderFilter.RECEIVED}</div>
      ),
    },
    // Todo: Check the color of All Offers
    [PonderFilter.ALL_OFFERS]: {
      body: (
        <div className="bg-[#DE7B30] p-1 rounded">
          {PonderFilter.ALL_OFFERS}
        </div>
      ),
    },
    [PonderFilter.CREATED]: {
      body: (
        <div className="bg-[#DE7B30] p-1 rounded">{PonderFilter.CREATED}</div>
      ),
    },
  };

  return (
    <div className="shadow-tag p-semibold-dark flex items-center">
      {PonderTagFilters[status].body}
    </div>
  );
};

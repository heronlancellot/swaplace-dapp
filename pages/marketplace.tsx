import { Layout } from "@/components/04-templates";
import { OffersSectionMarketplace } from "@/components/04-templates/OffersSectionMarketplace";

export default function Offers() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col xl:justify-center justify-start items-center">
        <OffersSectionMarketplace />
      </div>
    </Layout>
  );
}

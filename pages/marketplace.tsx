import { Layout, MarketplaceSection } from "@/components/04-templates";

export default function Marketplace() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <MarketplaceSection />
      </div>
    </Layout>
  );
}

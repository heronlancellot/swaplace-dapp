import { Layout, OfferSection } from "@/components/04-templates";

export default function Offers() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col xl:justify-center justify-start items-center">
        <OfferSection />
      </div>
    </Layout>
  );
}

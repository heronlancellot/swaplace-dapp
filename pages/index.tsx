import { BannerMintTokens } from "@/components/01-atoms";
import { Layout, SwapSection } from "@/components/04-templates";

export default function IndexPage() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <SwapSection />
        <div className="flex xl:flex-row flex-col lg:justify-center ">
          <BannerMintTokens />
        </div>
      </div>
    </Layout>
  );
}

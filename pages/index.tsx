import { TheHeader } from "@/components/02-molecules";
import { Layout, SwapSection } from "@/components/04-templates";
import cc from "classcat";

export default function IndexPage() {
  return (
    <Layout>
        <div
          className={cc([
            "w-full h-full mt-32 md:mt-40 xl:mt-16 flex flex-col justify-center items-center",
          ])}
        >
          <TheHeader />
          <SwapSection />
        </div>
    </Layout>
  );
}

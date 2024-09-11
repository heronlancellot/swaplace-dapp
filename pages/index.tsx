import { Layout, SwapSection } from "@/components/04-templates";
// import { BannerMintTokens, DocsIcon, GithubLogo } from "@/components/01-atoms";
// import Link from "next/link";

export default function IndexPage() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <SwapSection />
        {/**
         * This is the Token Mint component.
         *
         * @deprecated This component is currently deprecated as the token mint functionality is not in use in Swaplace.
         */}
        {/* <div className="flex xl:flex-row flex-col lg:justify-center gap-2 ">
          <BannerMintTokens />
          <div className="flex items-center gap-1">
            <Link href={"https://blockful.gitbook.io/swaplace"} target="_blank">
              <DocsIcon className="dark:text-[#DDF23D] text-[#A3A9A5]" />
            </Link>
            <Link
              href={"https://github.com/blockful-io/swaplace-contracts"}
              target="_blank"
            >
              <GithubLogo className="dark:text-[#DDF23D] text-[#A3A9A5]" />
            </Link>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}

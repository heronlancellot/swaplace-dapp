import { Layout, SwapSection } from "@/components/04-templates";

export default function IndexPage() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col xl:justify-center justify-start items-center">
        <SwapSection />
        {/**
         * This is the Token Mint component.
         *
         * @deprecated This feature is currently deprecated.
         */}
        {/* <div className="flex xl:flex-row flex-col lg:justify-center gap-2 ">
          <BannerMintTokens />
          <div className="flex items-center gap-1">
            <Link href={"https://blockful.gitbook.io/swaplace"} target="_blank">
              <DocsIcon className="dark:text-yellowGreen text-sageGray" />
            </Link>
            <Link
              href={"https://github.com/blockful-io/swaplace-contracts"}
              target="_blank"
            >
              <GithubLogo className="dark:text-yellowGreen text-sageGray" />
            </Link>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}

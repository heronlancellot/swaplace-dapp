import { Layout, LeaderboardSection } from "@/components/04-templates";

export default function Leaderboard() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col xl:justify-center justify-start items-center">
        <LeaderboardSection />
      </div>
    </Layout>
  );
}

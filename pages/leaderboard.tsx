import { Layout, LeaderboardSection } from "@/components/04-templates";

export default function Leaderboard() {
  return (
    <Layout>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <LeaderboardSection />
      </div>
    </Layout>
  );
}

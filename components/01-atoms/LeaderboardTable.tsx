import {
  LeaderboardRankingIcon,
  Ranking,
} from "./icons/LeaderboardRankingIcon";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  LeaderboardDataResponse,
  fetchLeaderboard,
} from "@/lib/service/fetchLeaderboard";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";

interface LeaderboardData {
  Rank: number;
  Address: string;
  Points: bigint;
}

enum Leaderboard {
  Rank = "Rank",
  Address = "Address",
  Points = "Points",
}

export const LeaderboardTable = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const userAddress = authenticatedUserAddress?.address;
  const { chain } = useNetwork();

  let chainId: number;

  if (typeof chain?.id !== "undefined") {
    chainId = chain?.id;
  }

  if (typeof chain?.id !== "undefined") {
    chainId = chain?.id;
  }

  useEffect(() => {
    fetchData();
  }, [leaderboardData]);

  const parseLeaderboardData = (
    data: LeaderboardDataResponse,
  ): LeaderboardData[] => {
    const leaderboardDataResponse: LeaderboardData[] = data.profileData.map(
      (data, index) => {
        return {
          Rank: index + 1,
          Address: data.id,
          Points: data.totalScore,
        };
      },
    );
    return leaderboardDataResponse;
  };

  const fetchData = async () => {
    try {
      const data = await fetchLeaderboard({
        pageParam: "",
        userAddress: userAddress,
        chainId: chainId,
      });
      const parsedLedboardData = parseLeaderboardData(data);
      setLeaderboardData(parsedLedboardData);
    } catch (error) {
      console.log(error);
    }
  };

  const LeaderboardData: Leaderboard[] = [
    Leaderboard.Rank,
    Leaderboard.Address,
    Leaderboard.Points,
  ];

  const dataBody: typeof BodyData = leaderboardData.map((data) => ({
    [Leaderboard.Rank]: String(data.Rank),
    [Leaderboard.Address]: String(data.Address),
    [Leaderboard.Points]: String(data.Points),
  }));

  const BodyData: Record<Leaderboard, string | React.JSX.Element>[] = dataBody;

  return (
    <div className="w-full border border-[#282B29] rounded-lg bg-[#282B29]">
      <table className="w-full text-left table-auto ">
        <thead className="border-b border-[#353836]">
          <tr>
            {LeaderboardData.map((header, index) => (
              <th className="px-4 py-3 p-small-dark-variant-grey" key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {BodyData.map((data, rowIndex) => (
            <tr key={rowIndex}>
              {LeaderboardData.map((header, colIndex) => (
                <td
                  className="px-4 py-3 p-small-dark-variant-grey"
                  key={colIndex}
                >
                  {header === Leaderboard.Rank &&
                  data[header] === Ranking.FIRST ? (
                    <LeaderboardRankingIcon variant={Ranking.FIRST} />
                  ) : header === Leaderboard.Rank &&
                    data[header] === Ranking.SECOND ? (
                    <LeaderboardRankingIcon variant={Ranking.SECOND} />
                  ) : header === Leaderboard.Rank &&
                    data[header] === Ranking.THIRD ? (
                    <LeaderboardRankingIcon variant={Ranking.THIRD} />
                  ) : (
                    data[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

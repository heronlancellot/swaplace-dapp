/* eslint-disable react-hooks/exhaustive-deps */
import {
  LeaderboardRankingIcon,
  Ranking,
} from "./icons/LeaderboardRankingIcon";
import { LeaderboardContext } from "@/lib/client/contexts/LeaderboardContext";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import {
  LeaderboardDataResponse,
  fetchLeaderboard,
} from "@/lib/service/fetchLeaderboard";
import { Leaderboard, LeaderboardData } from "@/lib/client/leaderboard-utils";
import { collapseAddress } from "@/lib/client/utils";
import { useContext, useEffect } from "react";
import { useNetwork } from "wagmi";
import cc from "classcat";

export const LeaderboardTable = () => {
  const { leaderboardData, setLeaderboardData } =
    useContext(LeaderboardContext);
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const userAddress = authenticatedUserAddress?.address;
  const { chain } = useNetwork();
  let chainId: number;

  if (typeof chain?.id !== "undefined") {
    chainId = chain?.id;
  }

  useEffect(() => {
    fetchData();
  }, [authenticatedUserAddress]);

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
    [Leaderboard.Address]: collapseAddress(String(data.Address)),
    [Leaderboard.Points]: String(data.Points),
  }));

  const BodyData: Record<Leaderboard, string | React.JSX.Element>[] = dataBody;

  return (
    <div className="w-full border border-[#282B29] rounded-lg bg-[#282B29]">
      <table className="w-full text-left table-fixed ">
        <thead className="border-b border-[#353836]">
          <tr>
            {LeaderboardData.map((header, index) => (
              <th
                className={cc([
                  header === Leaderboard.Points && "text-end",
                  header === Leaderboard.Rank && "flex justify-start",
                  "px-4 py-3 p-small-dark-variant-grey",
                ])}
                key={index}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="items-center">
          {BodyData.map((data, rowIndex) => (
            <tr key={rowIndex}>
              {LeaderboardData.map((header, colIndex) => (
                <td
                  className={cc([
                    data[header] === Ranking.FIRST ||
                    data[header] === Ranking.SECOND ||
                    data[header] === Ranking.THIRD
                      ? "flex items-start justify-start px-3"
                      : "px-4 py-3 p-small-dark-variant-grey",
                    data[header] === Ranking.FIRST ||
                    data[header] === Ranking.SECOND ||
                    data[header] === Ranking.THIRD
                      ? cc([
                          data[header] === Ranking.FIRST &&
                            "p-small-dark-variant-grey",
                          data[header] === Ranking.SECOND &&
                            "p-small-dark-variant-grey",
                          data[header] === Ranking.THIRD &&
                            "p-small-dark-variant-grey",
                        ])
                      : header === Leaderboard.Rank &&
                        data[header] !== Ranking.FIRST &&
                        "text-start px-[26px]", // padding 26px to fill in the center. The SVG icon and path have different values.
                    header === Leaderboard.Address && "text-start",
                    header === Leaderboard.Points && "text-end",
                  ])}
                  key={colIndex}
                >
                  {header === Leaderboard.Rank &&
                  (data[header] === Ranking.FIRST ||
                    data[header] === Ranking.SECOND ||
                    data[header] === Ranking.THIRD) ? (
                    <LeaderboardRankingIcon
                      props={{ className: "" }}
                      variant={data[header] as Ranking}
                    />
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

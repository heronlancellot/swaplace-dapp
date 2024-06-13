/* eslint-disable react-hooks/exhaustive-deps */
import {
  LeaderboardRankingIcon,
  Ranking,
} from "./icons/LeaderboardRankingIcon";
import { StarIcon } from "./icons/StarIcon";
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

  const userData = leaderboardData.find(
    (data) => data.Address.toLowerCase() === userAddress?.toLowerCase(),
  );

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
                    data.Rank === Ranking.FIRST && "!text-[#AABE13]",
                    data.Rank === Ranking.SECOND && "!text-[#A3A9A5]",
                    data.Rank === Ranking.THIRD && "!text-[#DE7B30]",

                    data[header] === Ranking.FIRST ||
                    data[header] === Ranking.SECOND ||
                    data[header] === Ranking.THIRD
                      ? "flex items-start justify-start px-3" // That padding will fill the center of the cell
                      : "px-4 py-3 p-small-dark",
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
                    <LeaderboardRankingIcon variant={data[header] as Ranking} />
                  ) : (
                    data[header]
                  )}
                </td>
              ))}
            </tr>
          ))}

          {userData && (
            <tr>
              <td
                colSpan={LeaderboardData.length}
                className="border-t border-[#353836] "
              ></td>
            </tr>
          )}

          {userData && (
            <tr>
              <td className="px-6 py-3 text-[#ddf23d] text-sm">
                {userData.Rank}
              </td>
              <td className="px-0 py-3 text-[#ddf23d] text-sm flex items-center pr-5">
                {" "}
                {/* Increase paddingLeft to move content to the right */}
                <StarIcon className="ml-[-5px] mr-2" />
                {collapseAddress(userData.Address)}
              </td>
              <td className="px-4 py-3 text-end text-[#ddf23d] text-sm">
                {userData.Points.toString()}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

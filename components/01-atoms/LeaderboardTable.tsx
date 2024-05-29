import {
  LeaderboardRankingIcon,
  Ranking,
} from "./icons/LeaderboardRankingIcon";

export const LeaderboardTable = () => {
  enum Leaderboard {
    Rank = "Rank",
    Address = "Address",
    Points = "Points",
  }

  const LeaderboardData: Leaderboard[] = [
    Leaderboard.Rank,
    Leaderboard.Address,
    Leaderboard.Points,
  ];

  const dataBody: typeof BodyData = [
    {
      [Leaderboard.Rank]: "1",
      [Leaderboard.Address]: "0x1234567890",
      [Leaderboard.Points]: "100",
    },
    {
      [Leaderboard.Rank]: "2",
      [Leaderboard.Address]: "0x0987654321",
      [Leaderboard.Points]: "90",
    },
    {
      [Leaderboard.Rank]: "3",
      [Leaderboard.Address]: "0x5678901234",
      [Leaderboard.Points]: "80",
    },
    {
      [Leaderboard.Rank]: "4",
      [Leaderboard.Address]: "0x5678901234",
      [Leaderboard.Points]: "80",
    },
  ];

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

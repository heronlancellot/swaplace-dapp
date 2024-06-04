/* eslint-disable @typescript-eslint/no-empty-function */
import { LeaderboardData } from "../leaderboard-utils";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface LeaderboardContextProps {
  leaderboardData: LeaderboardData[];
  setLeaderboardData: Dispatch<SetStateAction<LeaderboardData[]>>;
}

export const LeaderboardContextProvider = ({ children }: any) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    setLeaderboardContextData({
      leaderboardData,
      setLeaderboardData,
    });
  }, [leaderboardData]);

  // Exportable data
  const [leaderboardContextData, setLeaderboardContextData] =
    useState<LeaderboardContextProps>({
      leaderboardData,
      setLeaderboardData,
    });

  return (
    <LeaderboardContext.Provider value={leaderboardContextData}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const LeaderboardContext = createContext<LeaderboardContextProps>({
  leaderboardData: [],
  setLeaderboardData: () => {},
});

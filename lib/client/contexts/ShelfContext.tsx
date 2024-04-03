import { Token } from "@/lib/shared/types";
import React, { Dispatch, useEffect, useState } from "react";

interface ShelfContext {
  yourTokensList: Token[];
  setYourTokensList: Dispatch<React.SetStateAction<Token[]>>;
  theirTokensList: Token[];
  setTheirTokensList: Dispatch<React.SetStateAction<Token[]>>;
}

export const ShelfContextProvider = ({ children }: any) => {
  const [yourTokensList, setYourTokensList] = useState<Token[]>([]);
  const [theirTokensList, setTheirTokensList] = useState<Token[]>([]);

  useEffect(() => {
    setShelfData({
      yourTokensList,
      setYourTokensList,
      theirTokensList,
      setTheirTokensList,
    });
  }, [yourTokensList, theirTokensList]);

  const [shelfData, setShelfData] = useState<ShelfContext>({
    yourTokensList,
    setYourTokensList,
    theirTokensList,
    setTheirTokensList,
  });

  return (
    <ShelfContext.Provider value={shelfData}>{children}</ShelfContext.Provider>
  );
};

export const ShelfContext = React.createContext<ShelfContext>({
  yourTokensList: [],
  setYourTokensList: () => {
    [];
  },
  setTheirTokensList: () => {
    [];
  },
  theirTokensList: [],
});

import { Token } from "@/lib/shared/types";
import React, { Dispatch, useEffect, useState } from "react";

interface ShelfContext {
  yourTokensList: Token[];
  setYourTokensList: Dispatch<React.SetStateAction<Token[]>>;
  theirTokensList: Token[];
  setTheirTokensList: Dispatch<React.SetStateAction<Token[]>>;
  yourManuallyAddedTokensList: Token[];
  setYourManuallyAddedTokensList: Dispatch<React.SetStateAction<Token[]>>;
  theirManuallyAddedTokensList: Token[];
  setTheirManuallyAddedTokensList: Dispatch<React.SetStateAction<Token[]>>;
}

export const ShelfContextProvider = ({ children }: any) => {
  const [yourTokensList, setYourTokensList] = useState<Token[]>([]);
  const [yourManuallyAddedTokensList, setYourManuallyAddedTokensList] =
    useState<Token[]>([]);
  const [theirTokensList, setTheirTokensList] = useState<Token[]>([]);
  const [theirManuallyAddedTokensList, setTheirManuallyAddedTokensList] =
    useState<Token[]>([]);

  useEffect(() => {
    setShelfData({
      yourTokensList,
      setYourTokensList,
      theirTokensList,
      setTheirTokensList,
      theirManuallyAddedTokensList,
      setTheirManuallyAddedTokensList,
      yourManuallyAddedTokensList,
      setYourManuallyAddedTokensList,
    });
  }, [
    yourTokensList,
    theirTokensList,
    theirManuallyAddedTokensList,
    yourManuallyAddedTokensList,
  ]);

  const [shelfData, setShelfData] = useState<ShelfContext>({
    yourTokensList,
    setYourTokensList,
    theirTokensList,
    setTheirTokensList,
    theirManuallyAddedTokensList,
    setTheirManuallyAddedTokensList,
    yourManuallyAddedTokensList,
    setYourManuallyAddedTokensList,
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
  yourManuallyAddedTokensList: [],
  setYourManuallyAddedTokensList: () => {
    [];
  },
  theirManuallyAddedTokensList: [],
  setTheirManuallyAddedTokensList: () => {
    [];
  },
});

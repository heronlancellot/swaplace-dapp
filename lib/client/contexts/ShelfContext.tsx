/* eslint-disable @typescript-eslint/no-empty-function */
import { Token } from "@/lib/shared/types";
import React, { Dispatch, useEffect, useState } from "react";

interface ShelfContext {
  isActiveTab: number;
  setActiveTab: (tabId: number) => void;
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
  const [isActiveTab, setActiveTab] = useState<number>(0);
  const [yourTokensList, setYourTokensList] = useState<Token[]>([]);
  const [yourManuallyAddedTokensList, setYourManuallyAddedTokensList] =
    useState<Token[]>([]);
  const [theirTokensList, setTheirTokensList] = useState<Token[]>([]);
  const [theirManuallyAddedTokensList, setTheirManuallyAddedTokensList] =
    useState<Token[]>([]);

  useEffect(() => {
    setShelfData({
      setActiveTab,
      isActiveTab,
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
    isActiveTab,
    yourTokensList,
    theirTokensList,
    theirManuallyAddedTokensList,
    yourManuallyAddedTokensList,
  ]);

  const [shelfData, setShelfData] = useState<ShelfContext>({
    setActiveTab,
    isActiveTab,
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
  isActiveTab: 0,
  setActiveTab: (tabId: Number) => {},
  yourTokensList: [],
  setYourTokensList: () => {},
  setTheirTokensList: () => {},
  theirTokensList: [],
  yourManuallyAddedTokensList: [],
  setYourManuallyAddedTokensList: () => {},
  theirManuallyAddedTokensList: [],
  setTheirManuallyAddedTokensList: () => {},
});

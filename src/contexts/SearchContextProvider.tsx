"use client";

import { ChangeEvent, createContext, useState } from "react";

type TSearchContext = {
  searchText: string;
  handleChangeSearchText: (e: ChangeEvent<HTMLInputElement>) => void;
};

type TSearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: TSearchContextProviderProps) {
  const [searchText, setSearchText] = useState("");

  function handleChangeSearchText(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  return (
    <SearchContext.Provider value={{ searchText, handleChangeSearchText }}>
      {children}
    </SearchContext.Provider>
  );
}

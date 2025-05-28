import { SearchContext } from "@/contexts/SearchContextProvider";
import { useContext } from "react";

export default function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "You are trying to consume SearchContext inside a component that is not wrapped under the SearchContexProvider component"
    );
  }

  return context;
}

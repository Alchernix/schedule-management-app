import { create } from "zustand";
import createSelectors from "./createSelectors";

type SearchBoxState = {
  isSearchBoxOpen: boolean;
  handleToggleSearchBoxOpen: () => void;
};

const useSearchBoxBase = create<SearchBoxState>()((set) => ({
  isSearchBoxOpen: false,
  handleToggleSearchBoxOpen: () =>
    set((state) => ({ isSearchBoxOpen: !state.isSearchBoxOpen })),
}));

export const useSearchBoxStore = createSelectors(useSearchBoxBase);

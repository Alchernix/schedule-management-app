import { create } from "zustand";
import createSelectors from "./createSelectors";

type View = "Month" | "Week" | "Day";

type ViewState = {
  currentView: View;
  handleChangeView: (newView: View) => void;
};

const useViewStoreBase = create<ViewState>()((set) => ({
  currentView: "Month",
  handleChangeView: (newView) => set({ currentView: newView }),
}));

export const useViewStore = createSelectors(useViewStoreBase);

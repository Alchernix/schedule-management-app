import { create } from "zustand";
import createSelectors from "./createSelectors";

type MobileSidebarState = {
  isSidebarOpen: boolean;
  handleToggleSidebarOpen: () => void;
};

const useMobileSidebarBase = create<MobileSidebarState>()((set) => ({
  isSidebarOpen: false,
  handleToggleSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export const useMobileSidebarStore = createSelectors(useMobileSidebarBase);

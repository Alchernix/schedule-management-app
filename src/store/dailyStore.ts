import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DailyData } from "../types/types";
import createSelectors from "./createSelectors";
import { save, load } from "../utils";
import { useEffect } from "react";

type DailyStore = {
  entries: Record<string, DailyData>; // = { [isoDate: string]: DailyData }
  loadEntries: (entries: Record<string, DailyData>) => void;
  addMemo: (date: Date, content: string) => void;
};

const useDailyStoreBase = create<DailyStore>()(
  immer((set) => ({
    entries: {},
    loadEntries: (entries) =>
      set((state) => {
        state.entries = entries;
      }),
    addMemo: (date, content) =>
      set((state) => {
        const dateString = date.toISOString();
        state.entries[dateString] ||= { memo: "", schedules: [], todos: [] };
        state.entries[dateString].memo = content;
      }),
  }))
);

export const useDailyStore = createSelectors(useDailyStoreBase);

export function useLoadData() {
  const loadEntries = useDailyStoreBase((state) => state.loadEntries);
  useEffect(() => {
    const entries = JSON.parse(load() || "{}");
    loadEntries(entries);
  }, [loadEntries]);
}

export function addMemo(data: Date, content: string) {
  const { addMemo } = useDailyStore.getState();
  addMemo(data, content);
  save();
}

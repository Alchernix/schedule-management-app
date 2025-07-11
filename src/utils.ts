import { useDailyStore } from "./store/dailyStore";

export function save() {
  const { entries } = useDailyStore.getState();
  const dailyEntries = JSON.stringify(entries);
  localStorage.setItem("dailyData", dailyEntries);
}

export function load() {
  return localStorage.getItem("dailyData");
}

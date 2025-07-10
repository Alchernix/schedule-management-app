import { create } from "zustand";
import { isSameMonth } from "date-fns";
import createSelectors from "./createSelectors";

type currentDateState = {
  currentDate: Date;
  handleChangeMonth: (date: Date) => void;
  handleChangeDate: (date: Date) => void;
};

const useCurrentDateStoreBase = create<currentDateState>((set) => ({
  currentDate: new Date(),
  handleChangeMonth: (date) =>
    set(() => {
      const today = new Date();
      if (isSameMonth(today, date)) {
        return { currentDate: today };
      } else {
        return { currentDate: date };
      }
    }),
  handleChangeDate: (date) => set(() => ({ currentDate: date })),
}));

export const useCurrentDateStore = createSelectors(useCurrentDateStoreBase);

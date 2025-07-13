import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DailyData, Schedule, Todo } from "../types/types";
import createSelectors from "./createSelectors";
import { save, load } from "../utils";
import { useEffect } from "react";

type DailyStore = {
  entries: Record<string, DailyData>; // = { [isoDate: string]: DailyData }
  loadEntries: (entries: Record<string, DailyData>) => void;
  addMemo: (date: Date, content: string) => void;
  addSchedule: (date: Date, schedule: Schedule) => void;
  editSchedule: (date: Date, newSchedule: Schedule) => void;
  deleteSchedule: (date: Date, id: number) => void;
  addTodo: (date: Date, todo: Todo) => void;
  editTodo: (date: Date, newTodo: Todo) => void;
  deleteTodo: (date: Date, id: number) => void;
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
    addSchedule: (date, schedule) =>
      set((state) => {
        const dateString = date.toISOString();
        state.entries[dateString] ||= { memo: "", schedules: [], todos: [] };
        state.entries[dateString].schedules.push(schedule);
      }),
    editSchedule: (date, newSchedule) =>
      set((state) => {
        const dateString = date.toISOString();
        const idx = state.entries[dateString].schedules.findIndex(
          (s) => s.id === newSchedule.id
        );
        state.entries[dateString].schedules[idx] = newSchedule;
      }),
    deleteSchedule: (date, id) =>
      set((state) => {
        const dateString = date.toISOString();
        const idx = state.entries[dateString].schedules.findIndex(
          (s) => s.id === id
        );
        state.entries[dateString].schedules.splice(idx, 1);
      }),
    addTodo: (date, todo) =>
      set((state) => {
        const dateString = date.toISOString();
        state.entries[dateString] ||= { memo: "", schedules: [], todos: [] };
        state.entries[dateString].todos.push(todo);
      }),
    editTodo: (date, newTodo) =>
      set((state) => {
        const dateString = date.toISOString();
        const idx = state.entries[dateString].todos.findIndex(
          (s) => s.id === newTodo.id
        );
        state.entries[dateString].todos[idx] = newTodo;
      }),
    deleteTodo: (date, id) =>
      set((state) => {
        const dateString = date.toISOString();
        const idx = state.entries[dateString].todos.findIndex(
          (s) => s.id === id
        );
        state.entries[dateString].todos.splice(idx, 1);
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

export function addSchedule(data: Date, content: Schedule) {
  const { addSchedule } = useDailyStore.getState();
  addSchedule(data, content);
  save();
}

export function editSchedule(data: Date, newSchedule: Schedule) {
  const { editSchedule } = useDailyStore.getState();
  editSchedule(data, newSchedule);
  save();
}

export function deleteSchedule(data: Date, id: number) {
  const { deleteSchedule } = useDailyStore.getState();
  deleteSchedule(data, id);
  save();
}

export function addTodo(data: Date, content: Todo) {
  const { addTodo } = useDailyStore.getState();
  addTodo(data, content);
  save();
}

export function editTodo(data: Date, newTodo: Todo) {
  const { editTodo } = useDailyStore.getState();
  editTodo(data, newTodo);
  save();
}

export function deleteTodo(data: Date, id: number) {
  const { deleteTodo } = useDailyStore.getState();
  deleteTodo(data, id);
  save();
}

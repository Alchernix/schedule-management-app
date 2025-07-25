export type Schedule = {
  id: number;
  title: string;
  color: string;
  description: string | null;
  startTime: Date | null;
  endTime: Date | null;
};

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  isDone: boolean;
};

export type DailyData = {
  memo: string;
  schedules: Schedule[];
  todos: Todo[];
};

export type SidebarComponentProps = {
  dailyInfo: DailyData;
};

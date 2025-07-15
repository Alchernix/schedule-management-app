import {
  startOfMonth,
  startOfWeek,
  startOfDay,
  addDays,
  isSunday,
  isSaturday,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { useCurrentDateStore } from "../store/currentDateStore";
import { useDailyStore } from "../store/dailyStore";
import CalendarHeader from "./CalendarHeader";

export default function Calendar() {
  return (
    <main className="flex flex-col h-full px-7 pb-2">
      <CalendarHeader />
      <div className="flex flex-1 flex-col border-2 border-slate-100">
        <CalendarDays />
        <CalendarCells />
      </div>
    </main>
  );
}

function CalendarDays() {
  return (
    <div className="grid grid-cols-7 text-center divide-x-2 divide-slate-100 border-b-2 border-b-slate-100 bg-slate-50">
      {["일", "월", "화", "수", "목", "금", "토"].map((day) => {
        let classes = "font-bold";
        if (day === "일") {
          classes += " text-rose-500";
        } else if (day === "토") {
          classes += " text-sky-500";
        }
        return (
          <div className={classes} key={day}>
            {day}
          </div>
        );
      })}
    </div>
  );
}

function CalendarCells() {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const dailyEntries = useDailyStore.use.entries();
  const onChangeDate = useCurrentDateStore.use.handleChangeDate();
  const today = new Date();
  const calendarCells: Date[] = [];
  const start = startOfWeek(startOfMonth(currentDate));
  for (let i = 0; i < 42; i++) {
    calendarCells.push(addDays(start, i));
  }

  return (
    <div className="flex-1 grid grid-cols-7 auto-rows-fr text-center w-full divide-x-2 divide-y-2 divide-slate-100">
      {calendarCells.map((date) => {
        const dailyInfo = dailyEntries[date.toISOString()] ?? {
          memo: "",
          schedules: [],
          todos: [],
        };
        let classes = "relative font-bold cursor-pointer hover:brightness-98";

        if (isSunday(date)) {
          classes += " text-rose-500";
        } else if (isSaturday(date)) {
          classes += " text-sky-500";
        }

        if (isSameDay(date, currentDate)) {
          classes += " border border-blue-400";
        }
        let streakColor = "white";
        if (dailyInfo.todos.length > 0) {
          const totalTodos = dailyInfo.todos.length;
          const doneTodos = dailyInfo.todos.reduce((acc, todo) => {
            if (todo.isDone) {
              return acc + 1;
            } else {
              return acc;
            }
          }, 0);
          const completeRate = doneTodos / totalTodos;
          if (completeRate === 1) {
            streakColor = "emerald-200";
          } else if (completeRate >= 0.5) {
            streakColor = "emerald-100";
          } else if (completeRate > 0) {
            streakColor = "emerald-50";
          }
        }

        return (
          <div
            className={classes}
            key={date.toISOString()}
            onClick={() => onChangeDate(date)}
          >
            <div
              className={`h-full px-0.5 py-0.5 bg-${streakColor} ${
                !isSameMonth(currentDate, date) ? "opacity-25" : ""
              }`}
            >
              <span
                className={`px-0.5 ${
                  isSameDay(today, date)
                    ? "bg-blue-400 text-white rounded-sm"
                    : ""
                }`}
              >
                {date.getDate()}
              </span>
              <div className="flex flex-col gap-0.5 mt-0.5">
                {dailyInfo.schedules.slice(0, 2).map((schedule) => (
                  <p
                    key={schedule.id}
                    className={`text-sm font-normal text-white bg-${schedule.color} rounded-sm truncate`}
                  >
                    {schedule.title}
                  </p>
                ))}
                {dailyInfo.schedules.length > 2 && (
                  <p className="text-xs font-normal text-slate-800">
                    +{dailyInfo.schedules.length - 2}
                  </p>
                )}
              </div>

              {dailyInfo.memo && (
                <i className="fa-regular fa-note-sticky absolute bottom-0 right-0 text-slate-400"></i>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

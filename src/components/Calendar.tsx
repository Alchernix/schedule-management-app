import {
  startOfMonth,
  startOfWeek,
  startOfDay,
  addDays,
  isSunday,
  isSaturday,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
} from "date-fns";
import { useCurrentDateStore } from "../store/currentDateStore";
import { useDailyStore } from "../store/dailyStore";

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

function CalendarHeader() {
  const currentDate = useCurrentDateStore.use.currentDate();
  const onChangeMonth = useCurrentDateStore.use.handleChangeMonth();
  return (
    <div className="flex items-center justify-between py-3">
      <Button
        onClick={() => onChangeMonth(startOfMonth(addMonths(currentDate, -1)))}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </Button>
      <p className="font-bold text-xl">
        {format(currentDate, "MMMM")} {currentDate.getFullYear()}
      </p>
      <Button
        onClick={() => onChangeMonth(startOfMonth(addMonths(currentDate, 1)))}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </Button>
    </div>
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
        let classes = "relative font-bold hover:bg-blue-50 cursor-pointer";

        if (isSunday(date)) {
          classes += " text-rose-500";
        } else if (isSaturday(date)) {
          classes += " text-sky-500";
        }

        if (isSameDay(date, currentDate)) {
          classes += " border border-blue-400";
        }

        return (
          <div
            className={classes}
            key={date.toISOString()}
            onClick={() => onChangeDate(date)}
          >
            <div
              className={`px-1 py-0.5 ${
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
                {dailyInfo.schedules.length >= 2 && (
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

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className="shadow border-2 border-slate-100 text-slate-700 rounded-full cursor-pointer aspect-square w-7 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

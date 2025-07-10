import {
  startOfMonth,
  startOfWeek,
  addDays,
  isSunday,
  isSaturday,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
} from "date-fns";
import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  function handleChangeMonth(date: Date) {
    const today = new Date();
    if (isSameMonth(today, date)) {
      setCurrentDate(today);
    } else {
      setCurrentDate(date);
    }
  }

  function handleChangeDate(date: Date) {
    setCurrentDate(date);
  }

  return (
    <main className="flex flex-col h-full px-7 pb-3">
      <CalendarHeader
        currentDate={currentDate}
        onChangeMonth={handleChangeMonth}
      />
      <div className="flex flex-1 flex-col border-2 border-slate-100">
        <CalendarDays />
        <CalendarCells
          currentDate={currentDate}
          onChangeDate={handleChangeDate}
        />
      </div>
    </main>
  );
}

function CalendarHeader({
  currentDate,
  onChangeMonth,
}: {
  currentDate: Date;
  onChangeMonth: (date: Date) => void;
}) {
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

function CalendarCells({
  currentDate,
  onChangeDate,
}: {
  currentDate: Date;
  onChangeDate: (date: Date) => void;
}) {
  const today = new Date();
  const calendarCells: Date[] = [];
  const start = startOfWeek(startOfMonth(currentDate));
  for (let i = 0; i < 42; i++) {
    calendarCells.push(addDays(start, i));
  }

  return (
    <div className="flex-1 grid grid-cols-7 text-center w-full divide-x-2 divide-y-2 divide-slate-100">
      {calendarCells.map((date) => {
        let classes = "font-bold hover:bg-blue-50 cursor-pointer";

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
              className={!isSameMonth(currentDate, date) ? "opacity-25" : ""}
            >
              <span
                className={
                  isSameDay(today, date)
                    ? "bg-blue-400 text-white rounded-sm"
                    : ""
                }
              >
                {date.getDate()}
              </span>
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

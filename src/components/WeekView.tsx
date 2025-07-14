import { useCurrentDateStore } from "../store/currentDateStore";
import CalendarHeader from "./CalendarHeader";
import { startOfWeek, addDays, isSameDay } from "date-fns";

export default function WeekView() {
  const currentDate = useCurrentDateStore.use.currentDate();
  const days: Date[] = [];
  const start = startOfWeek(currentDate);
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  const times: number[] = [];
  for (let i = 0; i < 24; i++) {
    times.push(i);
  }

  return (
    <main className="flex flex-col h-full px-7 pb-2 overflow-y-scroll">
      <CalendarHeader />
      <div className="flex flex-1 flex-col border-2 border-slate-100">
        <div className="grid [grid-template-columns:0.3fr_repeat(7,_1fr)] text-center divide-x-2 divide-slate-100 border-b-2 border-b-slate-100">
          <TimeRow times={times} />
          {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => {
            const date = days[idx];
            return <DayRow times={times} day={day} date={date} />;
          })}
        </div>
      </div>
    </main>
  );
}

function TimeRow({ times }: { times: number[] }) {
  return (
    <div className="grid [grid-template-rows:50px_100px_repeat(24,_50px)] divide-y-2 divide-slate-100 text-center border-r-2 border-r-slate-100">
      <div className="bg-slate-50 flex items-center justify-center">
        <i className="fa-regular fa-clock"></i>
      </div>
      <div className="flex items-center justify-center">
        All
        <br />
        day
      </div>
      {times.map((time) => (
        <div key={time}>{time}</div>
      ))}
    </div>
  );
}

type DayRowsProps = {
  times: number[];
  day: string;
  date: Date;
};

function DayRow({ times, day, date }: DayRowsProps) {
  const currentDate = useCurrentDateStore.use.currentDate();
  const today = new Date();
  const onChangeDate = useCurrentDateStore.use.handleChangeDate();

  let classes =
    "font-bold bg-slate-50 flex flex-col items-center justify-center";
  if (day === "일") {
    classes += " text-rose-500";
  } else if (day === "토") {
    classes += " text-sky-500";
  }

  return (
    <div
      onClick={() => onChangeDate(date)}
      className={`grid [grid-template-rows:50px_100px_repeat(24,_50px)] divide-y-2 divide-slate-100 text-center cursor-pointer ${
        isSameDay(date, currentDate) ? "border border-blue-400" : ""
      }`}
    >
      <div className={classes} key={day}>
        <p>
          <span
            className={`px-1 ${
              isSameDay(today, date) ? "bg-blue-400 text-white rounded-sm" : ""
            }
                  
                `}
          >
            {date.getDate()}
          </span>
        </p>
        <p className="text-xs">{day}</p>
      </div>
      <div>Test</div>
      {times.map((time) => (
        <div key={time}>{time}</div>
      ))}
    </div>
  );
}

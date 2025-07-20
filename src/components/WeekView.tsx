import { useCurrentDateStore } from "../store/currentDateStore";
import { useDailyStore } from "../store/dailyStore";
import { useMobileSidebarStore } from "../store/Mobile";
import CalendarHeader from "./CalendarHeader";
import {
  startOfWeek,
  addDays,
  isSameDay,
  getHours,
  getMinutes,
  differenceInMinutes,
} from "date-fns";

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
    <main className="flex flex-col h-full px-2 md:px-7 pb-2 overflow-y-scroll">
      <CalendarHeader />
      <div className="flex flex-1 flex-col border-2 border-slate-100">
        <div className="grid [grid-template-columns:0.3fr_repeat(7,_minmax(0,_1fr))] text-center divide-x-2 divide-slate-100 border-b-2 border-b-slate-100">
          <TimeRow times={times} />
          {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => {
            const date = days[idx];
            return <DayRow key={day} times={times} day={day} date={date} />;
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
  const handleToggleSidebarOpen =
    useMobileSidebarStore.use.handleToggleSidebarOpen();

  let classes =
    "font-bold bg-slate-50 flex flex-col items-center justify-center min-w-0";
  if (day === "일") {
    classes += " text-rose-500";
  } else if (day === "토") {
    classes += " text-sky-500";
  }

  return (
    <div
      onClick={() => {
        onChangeDate(date);
        handleToggleSidebarOpen();
      }}
      className={`min-w-0 relative grid [grid-template-rows:50px_100px_repeat(24,_50px)] divide-y-2 divide-slate-100 text-center cursor-pointer ${
        isSameDay(date, currentDate) ? "border border-blue-400" : ""
      }`}
    >
      <div className={classes} key={day}>
        <p>
          <span
            className={`px-1 ${
              isSameDay(today, date) ? "bg-blue-400 text-white rounded-sm" : ""
            }`}
          >
            {date.getDate()}
          </span>
        </p>
        <p className="text-xs">{day}</p>
      </div>
      <AllDaySchedules date={date} />
      {times.map((time) => (
        <div key={time} className="min-w-0"></div>
      ))}
      <TimeSchedules date={date} />
    </div>
  );
}

function AllDaySchedules({ date }: { date: Date }) {
  const dailyEntries = useDailyStore.use.entries();
  const dailyInfo = dailyEntries[date.toISOString()] ?? {
    memo: "",
    schedules: [],
    todos: [],
  };
  const AllDaySchedulules = dailyInfo.schedules.filter(
    (schedule) => !schedule.startTime || !schedule.endTime
  );

  return (
    <div className={"flex flex-col gap-0.5 overflow-hidden min-w-0"}>
      {AllDaySchedulules.slice(0, 3).map((schedule) => (
        <div
          key={schedule.id}
          className={`flex-1 flex items-center justify-center bg-${schedule.color} text-white rounded-sm w-full min-w-0`}
        >
          <span className="truncate min-w-0 px-1 text-white text-left">
            {schedule.title}
          </span>
        </div>
      ))}
      {AllDaySchedulules.length > 3 && (
        <div className="text-xs">+{AllDaySchedulules.length - 3}</div>
      )}
    </div>
  );
}

type TimeSchedulesProps = {
  date: Date;
};

function TimeSchedules({ date }: TimeSchedulesProps) {
  const HOUR_HEIGHT = 50; // 50px
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // 1분당 px
  const dailyEntries = useDailyStore.use.entries();
  const dailyInfo = dailyEntries[date.toISOString()] ?? {
    memo: "",
    schedules: [],
    todos: [],
  };
  const schedules = dailyInfo.schedules.filter(
    (schedule) => schedule.startTime && schedule.endTime
  );

  function calculateTop(startDate: Date) {
    const HEADER_HEIGHT = 50 + 100; // 날짜 + 하루전체 할일
    return (
      HEADER_HEIGHT +
      getHours(startDate) * HOUR_HEIGHT +
      getMinutes(startDate) * MINUTE_HEIGHT
    );
  }

  function calculateHeight(startDate: Date, endDate: Date) {
    return differenceInMinutes(endDate, startDate) * MINUTE_HEIGHT;
  }

  return (
    <>
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`absolute bg-${schedule.color} text-white flex items-center justify-center w-full rounded-sm`}
          style={{
            top: `${calculateTop(schedule.startTime!)}px`,
            height: `${calculateHeight(
              schedule.startTime!,
              schedule.endTime!
            )}px`,
          }}
        >
          <span className="truncate min-w-0 px-1 text-white text-left">
            {schedule.title}
          </span>
        </div>
      ))}
    </>
  );
}

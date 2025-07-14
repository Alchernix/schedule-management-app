import { useViewStore } from "../store/ViewStore";
import { useCurrentDateStore } from "../store/currentDateStore";
import {
  startOfMonth,
  addMonths,
  format,
  startOfWeek,
  addWeeks,
} from "date-fns";

export default function CalendarHeader() {
  const currentDate = useCurrentDateStore.use.currentDate();
  const onChangeMonth = useCurrentDateStore.use.handleChangeMonth();
  const onChangeWeek = useCurrentDateStore.use.handleChangeWeek();
  const currentView = useViewStore.use.currentView();

  function handleBack() {
    if (currentView === "Month") {
      onChangeMonth(startOfMonth(addMonths(currentDate, -1)));
    } else {
      onChangeWeek(startOfWeek(addWeeks(currentDate, -1)));
    }
  }

  function handleNext() {
    if (currentView === "Month") {
      onChangeMonth(startOfMonth(addMonths(currentDate, 1)));
    } else {
      onChangeWeek(startOfWeek(addWeeks(currentDate, 1)));
    }
  }

  return (
    <div className="flex items-center justify-between py-3">
      <Button onClick={handleBack}>
        <i className="fa-solid fa-chevron-left"></i>
      </Button>
      <p className="font-bold text-xl">
        {format(currentDate, "MMMM")} {currentDate.getFullYear()}
      </p>
      <Button onClick={handleNext}>
        <i className="fa-solid fa-chevron-right"></i>
      </Button>
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

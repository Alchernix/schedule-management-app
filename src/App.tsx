// 전체 레이아웃 관리 - 뷰 상태에 따라서 뷰별로 렌더링
import { useEffect } from "react";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import { useLoadData } from "./store/dailyStore";
import { useCurrentDateStore } from "./store/currentDateStore";
import { useViewStore } from "./store/ViewStore";
import { useMobileSidebarStore } from "./store/Mobile";
import WeekView from "./components/WeekView";
import { addDays } from "date-fns";

function App() {
  const curerntView = useViewStore.use.currentView();
  const currentDate = useCurrentDateStore.use.currentDate();
  const handleChangeDate = useCurrentDateStore.use.handleChangeDate();

  // 모바일용
  const isMobileSidebarOpen = useMobileSidebarStore.use.isSidebarOpen();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
          handleChangeDate(addDays(currentDate, -1));
          break;
        case "ArrowRight":
          handleChangeDate(addDays(currentDate, 1));
          break;
        case "ArrowUp":
          handleChangeDate(addDays(currentDate, -7));
          break;
        case "ArrowDown":
          handleChangeDate(addDays(currentDate, 7));
          break;
        default:
          return;
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentDate, handleChangeDate]);

  useLoadData();
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1">
            {curerntView === "Month" && <Calendar />}
            {curerntView === "Week" && <WeekView />}
          </div>
          <div className="w-50 md:w-xs h-full overflow-y-auto border-l-2 border-l-slate-100 bg-slate-50 hidden md:block">
            <Sidebar />
          </div>
        </div>
      </div>
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-50">
          <Sidebar />
        </div>
      )}
    </>
  );
}

export default App;

// 전체 레이아웃 관리 - 뷰 상태에 따라서 뷰별로 렌더링
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import { useLoadData } from "./store/dailyStore";
import { useViewStore } from "./store/ViewStore";
import WeekView from "./components/WeekView";

function App() {
  const curerntView = useViewStore.use.currentView();

  useLoadData();
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          {curerntView === "Month" && <Calendar />}
          {curerntView === "Week" && <WeekView />}
        </div>
        <div className="w-50 md:w-xs h-full overflow-y-auto border-l-2 border-l-slate-100 bg-slate-50">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;

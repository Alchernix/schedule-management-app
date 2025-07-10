// 전체 레이아웃 관리 - 뷰 상태에 따라서 뷰별로 렌더링
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex flex-1">
        <div className="flex-1">
          <Calendar />
        </div>
        <div className="w-xs">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;

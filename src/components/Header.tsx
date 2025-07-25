import { useViewStore } from "../store/ViewStore";
import { useSearchBoxStore } from "../store/Search";

export default function Header() {
  const handleToggleSearchBoxOpen =
    useSearchBoxStore.use.handleToggleSearchBoxOpen();
  return (
    <header className="grid grid-cols-3 items-center px-5 md:px-7 h-13 border-b-2 border-slate-100">
      {/* <input
        className="border border-slate-300 rounded-md px-2 py-1 col-start-1 justify-self-start hidden md:block"
        type="text"
        placeholder="검색어 입력..."
      /> */}
      <button
        className="cursor-pointer justify-self-start"
        onClick={handleToggleSearchBoxOpen}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      <menu className="h-full flex gap-3 col-start-2 justify-self-center">
        <MenuItem
          label="Month"
          Icon={<i className="fa-solid fa-calendar-days"></i>}
        />
        <MenuItem
          label="Week"
          Icon={<i className="fa-solid fa-calendar-week"></i>}
        />
        {/* <MenuItem
          label="Day"
          Icon={<i className="fa-solid fa-calendar-day"></i>}
        /> */}
      </menu>
      <i className="col-start-3 justify-self-end fa-solid fa-gear cursor-pointer"></i>
    </header>
  );
}

interface MenuItemProps {
  label: "Month" | "Week" | "Day";
  Icon: React.ReactNode;
}

function MenuItem({ label, Icon }: MenuItemProps) {
  const currentView = useViewStore.use.currentView();
  const handleChangeView = useViewStore.use.handleChangeView();

  return (
    <li
      onClick={() => handleChangeView(label)}
      className={`flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 ${
        currentView === label ? "border-b-2 border-b-blue-400" : ""
      }`}
    >
      {Icon}
      <p>{label}</p>
    </li>
  );
}

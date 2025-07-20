import { useRef, useEffect, useState } from "react";
import { useSearchBoxStore } from "../store/Search";
import { useDailyStore } from "../store/dailyStore";
import { useCurrentDateStore } from "../store/currentDateStore";
import { useMobileSidebarStore } from "../store/Mobile";
import { useDebouncedCallback } from "use-debounce";

type SearchResult = {
  date: string;
  contents: string[];
};

export default function SearchBox() {
  const dailyEntries = useDailyStore.use.entries();
  const searchBox = useRef<HTMLDivElement>(null);
  const handleToggleSearchBoxOpen =
    useSearchBoxStore.use.handleToggleSearchBoxOpen();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const handleChangeDate = useCurrentDateStore.use.handleChangeDate();
  const handleToggleSidebarOpen =
    useMobileSidebarStore.use.handleToggleSidebarOpen();

  //검색창 닫기
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!searchBox.current?.contains(e.target as Node)) {
        handleToggleSearchBoxOpen();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [handleToggleSearchBoxOpen]);

  const handleSearch = useDebouncedCallback(function search(keyword: string) {
    if (keyword.trim() === "") {
      return [];
    }
    const result: SearchResult[] = [];
    for (const date in dailyEntries) {
      const entry = dailyEntries[date];
      const contents: string[] = [];
      if (entry.memo.includes(keyword)) {
        contents.push(`📝 메모: ${entry.memo}`);
      }
      const matchedSchedules = entry.schedules.filter((schedule) =>
        schedule.title.includes(keyword)
      );
      matchedSchedules.forEach((schedule) => {
        contents.push(`📅 일정: ${schedule.title}`);
      });
      const matchedTodos = entry.todos.filter((todo) =>
        todo.title.includes(keyword)
      );
      matchedTodos.forEach((todo) => {
        contents.push(`✅ 할일: ${todo.title}`);
      });

      if (contents.length > 0) {
        result.push({ date, contents });
      }
    }
    setSearchResults(result);
  }, 300);

  return (
    <div
      className="relative flex flex-col items-center px-7 py-15 gap-5 h-full"
      ref={searchBox}
    >
      <button
        className="fixed top-5 left-7 cursor-pointer text-base md:hidden"
        onClick={handleToggleSearchBoxOpen}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <input
        className="w-full border border-slate-300 rounded-md px-2 py-1 bg-white"
        type="text"
        placeholder="검색어 입력..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul className="w-full flex flex-col gap-3">
        {searchResults.length === 0 && (
          <li className="text-center">검색 결과가 없습니다.</li>
        )}
        {searchResults.map((searchResult) => (
          <li
            onClick={() => {
              handleChangeDate(new Date(searchResult.date));
              handleToggleSearchBoxOpen();
              handleToggleSidebarOpen();
            }}
            key={searchResult.date}
            className="cursor-pointer hover:bg-slate-100 rounded-md"
          >
            <p className="font-bold">{searchResult.date.split("T")[0]}</p>
            {searchResult.contents.map((content) => (
              <p key={content}>{content}</p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

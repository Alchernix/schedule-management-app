import { useRef, useState } from "react";
import { useCurrentDateStore } from "../store/currentDateStore";
import { useDailyStore } from "../store/dailyStore";
import type { DailyData } from "../types/types";
import { startOfDay } from "date-fns";
import { addMemo } from "../store/dailyStore";

type SidebarComponentProps = {
  currentDate: Date;
  dailyInfo: DailyData;
};

export default function Sidebar() {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const dailyEntries = useDailyStore.use.entries();
  const dailyInfo = dailyEntries[currentDate.toISOString()] ?? {
    memo: "",
    schedules: [],
    todos: [],
  };

  return (
    <aside className="flex flex-col h-full border-l-slate-100 border-l-2 px-7 py-5 bg-slate-100 gap-5">
      <div className="text-5xl font-bold text-center py-10">
        {currentDate.getMonth()}/{currentDate.getDate()}
      </div>
      <Memo currentDate={currentDate} dailyInfo={dailyInfo} />
      <div>
        <div className="flex justify-between items-center">
          <p>일정</p>
          <i className="fa-solid fa-plus"></i>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <p>할일</p>
          <i className="fa-solid fa-plus"></i>
        </div>
      </div>
    </aside>
  );
}

function Memo({ currentDate, dailyInfo }: SidebarComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const memo = useRef<HTMLTextAreaElement>(null);

  function handleAddMemo() {
    if (memo.current) {
      addMemo(currentDate, memo.current.value);
    }
    setIsEditing(false);
  }

  let memoContent;
  if (dailyInfo.memo && !isEditing) {
    memoContent = (
      <div className="flex-1" onClick={() => setIsEditing(true)}>
        {dailyInfo.memo}
      </div>
    );
  } else {
    memoContent = (
      <textarea
        ref={memo}
        className="flex-1 resize-none"
        placeholder="메모 추가..."
        defaultValue={dailyInfo.memo}
        onBlur={handleAddMemo}
      />
    );
  }

  return (
    <div className="flex px-2 py-1 bg-slate-50 border border-white rounded-md h-20">
      {memoContent}
    </div>
  );
}

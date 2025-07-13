// 수정/삭제 버튼 나오는 작은 메뉴창
import { startOfDay } from "date-fns";
import { useEffect } from "react";
import type { Schedule, Todo } from "../types/types";
import { useCurrentDateStore } from "../store/currentDateStore";
import { deleteSchedule } from "../store/dailyStore";

type MenuProps = {
  ref: React.Ref<HTMLDivElement>;
  onClickOutside: (e: MouseEvent) => void;
  content: Schedule | Todo;
  openModal: () => void;
};

export default function Menu({
  ref,
  onClickOutside,
  content,
  openModal,
}: MenuProps) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());

  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClickOutside]);

  return (
    <>
      <div
        ref={ref}
        className="bg-slate-100 z-10 w-[100px] flex flex-col gap-2 p-1 absolute top-6 right-1 shadow rounded-md"
      >
        <button
          className="cursor-pointer hover:bg-slate-200 rounded-md"
          onClick={openModal}
        >
          수정
        </button>
        <button
          className="cursor-pointer hover:bg-slate-200 rounded-md"
          onClick={() => deleteSchedule(currentDate, content.id)}
        >
          삭제
        </button>
      </div>
    </>
  );
}

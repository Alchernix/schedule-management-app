import { useState, useRef, useCallback } from "react";
import Modal from "./Modal";
import { useCurrentDateStore } from "../store/currentDateStore";
import type { SidebarComponentProps, Schedule } from "../types/types";
import { addSchedule, editSchedule } from "../store/dailyStore";
import { parse, startOfDay, format } from "date-fns";
import Input from "./Input";
import Menu from "./Menu";

export default function Schedules({ dailyInfo }: SidebarComponentProps) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const schedules = dailyInfo.schedules;

  function handleDone(newSchedule: Schedule) {
    addSchedule(currentDate, newSchedule);
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-3 border-2 bg-white border-white rounded-md px-2 py-1">
        <div className="flex justify-between items-center font-bold">
          <p>일정</p>
          <button
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        {schedules.length === 0 && (
          <p className="text-center text-slate-500 p-1">아직 일정이 없어요.</p>
        )}
        {schedules.length !== 0 && (
          <ul>
            {schedules.map((schedule) => (
              <ScheduleComponent key={schedule.id} schedule={schedule} />
            ))}
          </ul>
        )}
      </div>
      {/* 스케줄 생성 시 모달 오픈 */}
      <Modal open={isModalOpen}>
        <ScheduleForm
          formAction={(formData) =>
            formAction(formData, currentDate, null, handleDone)
          }
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}

function ScheduleComponent({ schedule }: { schedule: Schedule }) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  function handleDone(newSchedule: Schedule) {
    editSchedule(currentDate, newSchedule);
    setIsModalOpen(false);
  }

  const onClickOutside = useCallback(function onClickOutside(e: MouseEvent) {
    if (
      !button.current?.contains(e.target as Node) &&
      !menu.current?.contains(e.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  }, []);

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <li className="flex items-center gap-2 hover:bg-slate-100 relative p-1 rounded-md">
      <div
        className={`w-3 aspect-square rounded-full bg-${schedule.color}`}
      ></div>
      <div>
        <p>{schedule.title}</p>
        {schedule.startTime && schedule.endTime && (
          <p className="text-slate-500 text-xs">
            {format(schedule.startTime, "h:mm")} -{" "}
            {format(schedule.endTime, "h:mm a")}
          </p>
        )}
      </div>

      <button
        ref={button}
        className="cursor-pointer ml-auto"
        onClick={() => setIsMenuOpen(true)}
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {isMenuOpen && (
        <Menu
          ref={menu}
          onClickOutside={onClickOutside}
          content={schedule}
          openModal={openModal}
        />
      )}
      {/* 스케줄 수정 시 모달 오픈 */}
      {isModalOpen && (
        <Modal open={isModalOpen}>
          <ScheduleForm
            formAction={(formData) =>
              formAction(formData, currentDate, schedule.id, handleDone)
            }
            onClose={() => setIsModalOpen(false)}
            defaultValues={{
              title: schedule.title,
              color: schedule.color,
              description: schedule.description ?? "",
              startTime:
                schedule.startTime instanceof Date
                  ? schedule.startTime.toISOString()
                  : typeof schedule.startTime === "string"
                  ? schedule.startTime
                  : "",
              endTime:
                schedule.endTime instanceof Date
                  ? schedule.endTime.toISOString()
                  : typeof schedule.endTime === "string"
                  ? schedule.endTime
                  : "",
            }}
          />
        </Modal>
      )}
    </li>
  );
}

type ScheduleFormProps = {
  formAction: (formData: FormData) => void;
  onClose: () => void;
  defaultValues?: {
    title: string;
    color: string;
    description: string;
    startTime: string;
    endTime: string;
  };
};

function ScheduleForm({
  formAction,
  onClose,
  defaultValues = {
    title: "",
    color: "blue-400",
    description: "",
    startTime: "",
    endTime: "",
  },
}: ScheduleFormProps) {
  const [selectedColor, setSelectedColor] = useState(defaultValues.color);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Input
        id="title"
        label="제목"
        type="text"
        required={true}
        defaultValue={defaultValues.title}
      />
      <Input
        id="description"
        label="설명"
        type="textarea"
        defaultValue={defaultValues.description}
      />
      <div className="flex items-center justify-between">
        <Input
          id="startTime"
          label="시간"
          type="time"
          defaultValue={defaultValues.startTime}
        />
        <span className="font-bold text-xl mt-7">~</span>
        <Input
          id="endTime"
          label="ㅤ"
          type="time"
          defaultValue={defaultValues.endTime}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-bold">색깔</p>
        <div className="px-2 py-1 flex justify-between">
          {[
            "blue-400",
            "yellow-400",
            "red-400",
            "violet-400",
            "emerald-400",
          ].map((color) => (
            <button
              type="button"
              key={color}
              className={`w-7 flex justify-center items-center cursor-pointer rounded-full aspect-square bg-${color} text-white`}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && <i className="fa-solid fa-check"></i>}
            </button>
          ))}
        </div>
        <input type="hidden" name="color" value={selectedColor} />
      </div>

      <div className="flex gap-5 justify-end mt-5">
        <button
          type="button"
          className="font-bold cursor-pointer px-2 py-1"
          onClick={onClose}
        >
          취소
        </button>
        <button className="font-bold cursor-pointer bg-blue-400 text-white px-2 py-1 rounded-md">
          저장
        </button>
      </div>
    </form>
  );
}

function formAction(
  formData: FormData,
  currentDate: Date,
  existingId: number | null,
  onDone: (newSchedule: Schedule) => void
) {
  const title = String(formData.get("title") ?? "");
  const color = String(formData.get("color") ?? "blue-400");
  const description = String(formData.get("description") ?? "");
  const startTimeString = String(formData.get("startTime") ?? "");
  let startTime: Date | null = null;
  if (startTimeString) {
    startTime = parse(startTimeString, "HH:mm", currentDate);
  }
  const endTimeString = String(formData.get("endTime") ?? "");
  let endTime: Date | null = null;
  if (endTimeString) {
    endTime = parse(endTimeString, "HH:mm", currentDate);
  }

  const newSchedule: Schedule = {
    id: existingId ?? Date.now(),
    color,
    title,
    description,
    startTime,
    endTime,
  };

  onDone(newSchedule);
}

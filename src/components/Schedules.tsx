import { useEffect, useState, useRef, useCallback } from "react";
import Modal from "./Modal";
import { useCurrentDateStore } from "../store/currentDateStore";
import type { SidebarComponentProps, Schedule } from "../types/types";
import { addSchedule, editSchedule, deleteSchedule } from "../store/dailyStore";
import { parse, startOfDay, format } from "date-fns";

export default function Schedules({ dailyInfo }: SidebarComponentProps) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const schedules = dailyInfo.schedules;

  function formAction(formData: FormData) {
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const timeString = String(formData.get("time") ?? "");
    let time: Date | null = null;
    if (timeString) {
      time = parse(timeString, "HH:mm", currentDate);
    }

    const newSchedule: Schedule = {
      id: Date.now(),
      title,
      description,
      time,
    };

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
          <p className="text-center text-slate-600">아직 일정이 없어요.</p>
        )}
        {schedules.length !== 0 && (
          <ul>
            {schedules.map((schedule) => (
              <ScheduleComponent key={schedule.id} schedule={schedule} />
            ))}
          </ul>
        )}
      </div>
      <Modal open={isModalOpen}>
        <ScheduleForm
          formAction={formAction}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}

type InputProps = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
};

function Input({
  id,
  label,
  type,
  required = false,
  defaultValue = "",
}: InputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-bold" htmlFor={id}>
        {label}
      </label>
      {type !== "textarea" && (
        <input
          className="border border-slate-300 rounded-md px-2 py-1"
          id={id}
          name={id}
          type={type}
          required={required}
          defaultValue={
            type === "time" && defaultValue
              ? format(defaultValue, "HH:mm")
              : defaultValue
          }
        />
      )}
      {type === "textarea" && (
        <textarea
          className="border border-slate-300 rounded-md resize-none px-2 py-1"
          id={id}
          name={id}
          required={required}
          defaultValue={defaultValue}
        ></textarea>
      )}
    </div>
  );
}

function ScheduleComponent({ schedule }: { schedule: Schedule }) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  function formAction(formData: FormData) {
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const timeString = String(formData.get("time") ?? "");
    let time: Date | null = null;
    if (timeString) {
      time = parse(timeString, "HH:mm", currentDate);
    }

    const newSchedule: Schedule = {
      id: schedule.id,
      title,
      description,
      time,
    };

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
    <li className="flex justify-between hover:bg-slate-100 relative p-1 rounded-md">
      <div>
        <p>{schedule.title}</p>
      </div>
      <button
        ref={button}
        className="cursor-pointer"
        onClick={() => setIsMenuOpen(true)}
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {isMenuOpen && (
        <Menu
          ref={menu}
          onClickOutside={onClickOutside}
          schedule={schedule}
          openModal={openModal}
        />
      )}
      {isModalOpen && (
        <Modal open={isModalOpen}>
          <ScheduleForm
            formAction={formAction}
            onClose={() => setIsModalOpen(false)}
            defaultValues={{
              title: schedule.title,
              description: schedule.description ?? "",
              time: schedule.time?.toISOString() ?? "",
            }}
          />
        </Modal>
      )}
    </li>
  );
}

type MenuProps = {
  ref: React.Ref<HTMLDivElement>;
  onClickOutside: (e: MouseEvent) => void;
  schedule: Schedule;
  openModal: () => void;
};

function Menu({ ref, onClickOutside, schedule, openModal }: MenuProps) {
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
          onClick={() => deleteSchedule(currentDate, schedule.id)}
        >
          삭제
        </button>
      </div>
    </>
  );
}

type ScheduleFormProps = {
  formAction: (formData: FormData) => void;
  onClose: () => void;
  defaultValues?: {
    title: string;
    description: string;
    time: string;
  };
};

function ScheduleForm({
  formAction,
  onClose,
  defaultValues = { title: "", description: "", time: "" },
}: ScheduleFormProps) {
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
      <Input
        id="time"
        label="시간"
        type="time"
        defaultValue={defaultValues.time}
      />
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

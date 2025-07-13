import { useState, useRef, useCallback } from "react";
import Modal from "./Modal";
import { useCurrentDateStore } from "../store/currentDateStore";
import type { SidebarComponentProps, Todo } from "../types/types";
import { addTodo, editTodo } from "../store/dailyStore";
import { startOfDay } from "date-fns";
import Input from "./Input";
import Menu from "./Menu";

export default function Todos({ dailyInfo }: SidebarComponentProps) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const todos = dailyInfo.todos;

  function handleDone(newTodo: Todo) {
    addTodo(currentDate, newTodo);
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-3 border-2 bg-white border-white rounded-md px-2 py-1">
        <div className="flex justify-between items-center font-bold">
          <p>할일</p>
          <button
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        {todos.length === 0 && (
          <p className="text-center text-slate-500 p-1">아직 할일이 없어요.</p>
        )}
        {todos.length !== 0 && (
          <ul>
            {todos.map((todo) => (
              <TodoComponent key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
      {/* 할일 생성 시 모달 오픈 */}
      <Modal open={isModalOpen}>
        <TodoForm
          formAction={(formData) =>
            formAction(formData, null, false, handleDone)
          }
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}

function TodoComponent({ todo }: { todo: Todo }) {
  const currentDate = startOfDay(useCurrentDateStore.use.currentDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  function handleDone(newTodo: Todo) {
    editTodo(currentDate, newTodo);
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
      <input
        className="accent-blue-400"
        checked={todo.isDone}
        type="checkbox"
        onClick={() => editTodo(currentDate, { ...todo, isDone: !todo.isDone })}
      />
      <div>
        <p className={todo.isDone ? "line-through text-slate-500" : ""}>
          {todo.title}
        </p>
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
          content={todo}
          openModal={openModal}
        />
      )}
      {/* 스케줄 수정 시 모달 오픈 */}
      {isModalOpen && (
        <Modal open={isModalOpen}>
          <TodoForm
            formAction={(formData) =>
              formAction(formData, todo.id, todo.isDone, handleDone)
            }
            onClose={() => setIsModalOpen(false)}
            defaultValues={{
              title: todo.title,
              description: todo.description ?? "",
            }}
          />
        </Modal>
      )}
    </li>
  );
}

type TodoFormProps = {
  formAction: (formData: FormData) => void;
  onClose: () => void;
  defaultValues?: {
    title: string;
    description: string;
  };
};

function TodoForm({
  formAction,
  onClose,
  defaultValues = {
    title: "",
    description: "",
  },
}: TodoFormProps) {
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
  existingId: number | null,
  isDone: boolean,
  onDone: (newTodo: Todo) => void
) {
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");

  const newTodo: Todo = {
    id: existingId ?? Date.now(),
    title,
    isDone,
    description,
  };

  onDone(newTodo);
}

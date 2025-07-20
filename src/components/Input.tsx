// 스케줄/할일 생성/수정 창 입력 컴포넌트
import { format } from "date-fns";

type InputProps = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: string | Date;
};

export default function Input({
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

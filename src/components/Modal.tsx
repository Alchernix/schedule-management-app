import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  children: React.ReactNode;
};

export default function Modal({ open, children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-md p-10 rounded-xl"
    >
      <div>{children}</div>
    </dialog>,
    document.querySelector("#modal-root")!
  );
}

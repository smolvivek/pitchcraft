"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="
        backdrop:bg-black/60 backdrop:backdrop-blur-none
        bg-transparent p-0 m-auto
        max-w-[480px] w-[calc(100%-32px)]
        open:animate-[scale-up_250ms_ease-out]
      "
    >
      <div className="bg-surface rounded-[4px] p-[24px] border border-border">
        <div className="flex items-center justify-between mb-[16px]">
          <h2 className="font-heading text-[24px] font-semibold leading-[32px] text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              w-[32px] h-[32px] flex items-center justify-center
              rounded-[4px] text-text-secondary
              hover:bg-surface-hover hover:text-text-primary
              transition-colors duration-[200ms] ease-out
              cursor-pointer
            "
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export { Modal };
export type { ModalProps };

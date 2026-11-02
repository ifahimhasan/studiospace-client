"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Accessible modal built on daisyUI's <dialog class="modal">. Closes on Escape,
 * the backdrop and the close button. Never uses window.alert/confirm.
 */
export default function Modal({ open, onClose, title, eyebrow, children, size = "max-w-[520px]", labelledBy = "modal-title" }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" aria-labelledby={labelledBy} onClose={onClose} onCancel={onClose}>
      <div className={`modal-box w-full ${size} rounded-[26px] border border-ln bg-sf p-7 text-tx`}>
        <div className="mb-5 flex items-start gap-4">
          <div className="flex-1">
            {eyebrow && <div className="font-mono text-xs text-acct">{eyebrow}</div>}
            <h2 id={labelledBy} className="mt-1.5 font-display text-[26px] leading-tight font-bold">
              {title}
            </h2>
          </div>
          <button type="button" aria-label="Close dialog" onClick={onClose} className="icon-btn shrink-0">
            <X size={16} />
          </button>
        </div>
        {open && children}
      </div>
      <form method="dialog" className="modal-backdrop bg-[rgba(5,5,7,0.72)]">
        <button type="submit" aria-label="Close dialog" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
}

/** Confirmation dialog for destructive actions (delete listing, cancel booking). */
export function ConfirmModal({ open, onClose, onConfirm, title, text, confirmLabel = "Yes, continue", cancelLabel = "Keep it", busy = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="max-w-[440px]" labelledBy="confirm-title">
      <p className="leading-relaxed text-mu">{text}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2.5">
        <button type="button" onClick={onClose} className="btn-line h-[46px] px-5">
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-full bg-[#E5484D] px-5 font-semibold text-white disabled:opacity-60"
        >
          {busy && <span className="loading loading-spinner loading-sm" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

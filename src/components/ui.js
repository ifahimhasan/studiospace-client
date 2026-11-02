import Link from "next/link";
import { ApertureIcon } from "./icons";

export function SectionHeading({ eyebrow, title, lead, id, as: Tag = "h2", children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex max-w-[640px] flex-col gap-3.5">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <Tag id={id} className="h-section">
          {title}
        </Tag>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children}
    </div>
  );
}

/** Branded loader: spinning aperture + a line of copy. */
export function Spinner({ label = "Setting up the shot…", className = "" }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-3.5 ${className}`}>
      <span className="spin-slow text-acc">
        <ApertureIcon size={52} />
      </span>
      <span className="font-mono text-[13px] text-mu">{label}</span>
    </div>
  );
}

export function EmptyState({ icon, title, text, action, actionHref, onAction, secondary }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-ln px-6 py-[72px] text-center">
      <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-full bg-sf2 text-acct">{icon || <ApertureIcon size={32} />}</span>
      <h2 className="font-display text-[28px] font-bold">{title}</h2>
      {text && <p className="max-w-[440px] leading-relaxed text-mu">{text}</p>}
      <div className="flex flex-wrap justify-center gap-3">
        {action && actionHref && (
          <Link href={actionHref} className="btn-main">
            {action}
          </Link>
        )}
        {action && onAction && (
          <button type="button" onClick={onAction} className="btn-main">
            {action}
          </button>
        )}
        {secondary}
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  Pending: "text-pend border-pend",
  Confirmed: "text-conf border-conf",
  Completed: "text-ok border-ok",
  Cancelled: "text-canc border-canc",
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold ${STATUS_STYLES[status] || ""}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

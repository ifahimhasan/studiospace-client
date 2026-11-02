import StudioImage from "../StudioImage";

const IMG = "https://images.unsplash.com/photo-1632187981988-40f3cbaeef5e?auto=format&fit=crop&w=1400&q=80";

export default function AuthShell({ children }) {
  return (
    <div className="container-ss flex flex-wrap items-stretch gap-6 py-8">
      <div className="relative hidden min-h-[560px] flex-[1_1_420px] overflow-hidden rounded-[28px] border border-ln md:block">
        <StudioImage src={IMG} alt="Film crew setting up a camera on set" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <span className="flex items-center gap-2 self-start rounded-lg border border-ln bg-bg px-2.5 py-1.5 font-mono text-xs">
            <span className="rec-dot h-[7px] w-[7px] rounded-full bg-acc" />
            REC · ON SET
          </span>
          <div className="max-w-[440px] rounded-[20px] border border-ln bg-bg p-6">
            <div className="font-display text-[28px] leading-tight font-bold tracking-[-0.02em]">Studios for every kind of make.</div>
            <p className="mt-2.5 leading-relaxed text-mu">Sign in to book hours, track your requests and manage the spaces you host.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_1_440px] items-center justify-center py-6">
        <div className="flex w-full max-w-[460px] flex-col gap-5">{children}</div>
      </div>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-[13px] text-mu">
      <span className="h-px flex-1 bg-ln" />
      or
      <span className="h-px flex-1 bg-ln" />
    </div>
  );
}

/** Only allow same-site relative paths as redirect targets. */
export function safeRedirect(value) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/login") && !value.startsWith("/register")
    ? value
    : "/";
}

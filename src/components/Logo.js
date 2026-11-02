import Link from "next/link";
import { ApertureIcon } from "./icons";

export default function Logo({ small = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="StudioSpace home">
      <span className={`inline-flex items-center justify-center rounded-[10px] bg-acc text-on ${small ? "h-7 w-7 rounded-lg" : "h-9 w-9"}`}>
        <ApertureIcon size={small ? 16 : 22} />
      </span>
      <span className={`font-display font-extrabold tracking-[-0.02em] ${small ? "text-lg" : "text-[22px]"}`}>StudioSpace</span>
    </Link>
  );
}

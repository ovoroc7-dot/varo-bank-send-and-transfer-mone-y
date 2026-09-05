import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-4 pt-4 pb-2 text-[12px] font-bold tracking-[0.06em] text-[#6f7075] uppercase">
      {children}
    </p>
  );
}

export function Chevron() {
  return <ChevronRight className="size-[22px] shrink-0 text-black" strokeWidth={2.6} />;
}

export function LimeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 rounded-[7px] bg-lime px-2 py-1 text-[13px] font-medium text-black">
      {children}
    </span>
  );
}

export function DaysBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[7px] border border-border bg-card px-2 py-1 text-[13px] text-black">
      {children}
    </span>
  );
}

export function Divider() {
  return <div className="mx-4 h-px bg-border" />;
}

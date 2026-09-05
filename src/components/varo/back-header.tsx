import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function BackHeader({ title, right }: { title?: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="flex items-center gap-4 bg-white px-4 pt-5 pb-4">
      <button
        type="button"
        aria-label="Back"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
          else router.navigate({ to: "/my-varo", replace: true });
        }}
      >
        <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
      </button>
      {title ? <h1 className="flex-1 text-[18px] font-bold text-black">{title}</h1> : <span className="flex-1" />}
      {right}
    </header>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-[30px] w-[52px] shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-[#c9ccd1]"}`}
    >
      <span
        className={`absolute top-[3px] size-[24px] rounded-full bg-white transition-all ${on ? "left-[25px]" : "left-[3px]"}`}
      />
    </button>
  );
}

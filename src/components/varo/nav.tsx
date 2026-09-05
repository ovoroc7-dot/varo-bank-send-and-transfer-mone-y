import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.5 15.5 16 5.5l11.5 10M8 13.5v12h6v-7.5h4V25.5h6v-12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoveMoneyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11.2" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M19.2 12.1c-.7-1-1.9-1.6-3.4-1.6-2 0-3.4 1.1-3.4 2.7 0 1.6 1.2 2.3 3.4 2.7 2.3.5 3.6 1.1 3.6 2.8 0 1.7-1.5 2.8-3.6 2.8-1.7 0-3-.6-3.7-1.7M16 8.6v14.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CashbackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M12.6 9.6c-1.6 0-2.8-1-2.8-2.3S11 5 12.6 5c2.1 0 3.4 2.2 3.4 4.6m6.8 0c1.6 0 2.8-1 2.8-2.3S24.4 5 22.8 5c-2.1 0-3.4 2.2-3.4 4.6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4.6"
        y="9.8"
        width="22.8"
        height="6.2"
        rx="1"
        stroke="currentColor"
        strokeWidth="2.3"
      />
      <path d="M6.7 16v10.4h18.6V16" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M16 10v16.4" stroke="currentColor" strokeWidth="2.3" />
    </svg>
  );
}

function MyVaroIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11.2" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="16" cy="13.4" r="3.9" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M8.6 24.6c1.3-3 4-4.9 7.4-4.9s6.1 1.9 7.4 4.9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const tabs = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/move-money", label: "Move Money", icon: MoveMoneyIcon },
  { to: "/cashback", label: "Cashback", icon: CashbackIcon },
  { to: "/my-varo", label: "My Varo", icon: MyVaroIcon },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ "data-active": "true" }}
              className="group flex flex-col items-center gap-[5px] py-2.5 text-[#a5a6ab] data-[active=true]:text-black"
            >
              <Icon className="size-[30px]" />
              <span className="text-[13px] font-bold tracking-[-0.01em]">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function VaroHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-surface px-4 pt-5 pb-3">
      <span className="varo-wordmark text-[30px] text-primary">Varo</span>
      <Link
        to="/"
        className="rounded-[8px] border border-primary px-4 py-2 text-[14px] font-bold text-primary"
      >
        Get $100
      </Link>
    </header>
  );
}

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="bg-surface px-4 pt-3">
      <div className="flex justify-end">
        <Info className="size-6 text-black" strokeWidth={1.7} />
      </div>
      <h1 className="varo-title mt-6 mb-6 text-[27px]">{title}</h1>
    </header>
  );
}

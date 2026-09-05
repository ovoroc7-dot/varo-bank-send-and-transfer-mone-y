import { Link } from "@tanstack/react-router";
import { Home, CircleDollarSign, Gift, CircleUserRound, Info } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/move-money", label: "Move Money", icon: CircleDollarSign },
  { to: "/cashback", label: "Cashback", icon: Gift },
  { to: "/my-varo", label: "My Varo", icon: CircleUserRound },
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
              className="group flex flex-col items-center gap-[3px] py-2.5 text-[#8b8b90] data-[active=true]:text-black"
            >
              <Icon
                className="size-[26px] group-data-[active=true]:[stroke-width:2.4]"
                strokeWidth={1.9}
              />
              <span className="text-[12px] font-semibold group-data-[active=true]:font-bold">
                {label}
              </span>
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

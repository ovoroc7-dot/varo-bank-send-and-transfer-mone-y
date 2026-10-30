import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Settings, Info, User } from "lucide-react";
import coins from "@/assets/varo/coins.png.asset.json";
import { useBalance, useTransactions, usd, txnDate } from "@/lib/ledger";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Varo Bank Account — Balance & Activity" },
      {
        name: "description",
        content:
          "See your Varo Bank Account available balance, money in and money out insights, and recent transactions.",
      },
      { property: "og:title", content: "Varo Bank Account — Balance & Activity" },
      {
        property: "og:description",
        content:
          "See your Varo Bank Account available balance, money in and money out insights, and recent transactions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountScreen,
});

type Tab = "all" | "in" | "out";

function AccountScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center gap-4 px-4 pt-4 pb-3">
        <button type="button" aria-label="Back" onClick={() => navigate({ to: "/" })}>
          <ArrowLeft className="size-[26px] text-black" strokeWidth={2.6} />
        </button>
        <h1 className="flex-1 text-[20px] font-bold text-black">Varo Bank Account</h1>
        <button type="button" aria-label="Account settings">
          <Settings className="size-[26px] text-black" strokeWidth={1.9} />
        </button>
      </header>

      <div className="flex gap-3 px-4 pb-2">
        {(
          [
            ["all", "All"],
            ["in", "Money in"],
            ["out", "Money out"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              tab === key
                ? "rounded-full bg-[#111114] px-6 py-2.5 text-[16px] font-bold text-white"
                : "rounded-full border border-[#e2e3e6] px-6 py-2.5 text-[16px] font-bold text-black"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "all" ? <AllPanel /> : null}
      {tab === "in" ? <MoneyInPanel /> : null}
      {tab === "out" ? <MoneyOutPanel /> : null}

      <div className="h-2 bg-[#f1f4f8]" />

      <RecentTransactions tab={tab} />
    </div>
  );
}

function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function RecentTransactions({ tab }: { tab: Tab }) {
  const all = useTransactions();
  const txns = all.filter((t) =>
    tab === "in" ? t.amount > 0 : tab === "out" ? t.amount < 0 : true,
  );
  const groups: { month: string; items: typeof txns }[] = [];
  for (const t of txns) {
    const month = monthLabel(t.date);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.items.push(t);
    else groups.push({ month, items: [t] });
  }

  return (
    <section className="px-4 pt-5 pb-16">
      <h2 className="text-[16px] font-bold text-black">Transaction history</h2>
      {txns.length ? (
        <div className="pt-1">
          {groups.map((g) => (
            <div key={g.month}>
              <p className="pt-4 pb-1 text-[13px] font-bold tracking-[0.06em] text-[#6f7075] uppercase">
                {g.month}
              </p>
              <ul>
                {g.items.map((t) => (
                  <li key={t.id}>
                    <Link
                      to="/transaction/$id"
                      params={{ id: t.id }}
                      className="flex w-full items-center gap-3 border-b border-[#e2e3e6] py-4 text-left active:bg-[#f4f5f7]"
                    >
                      <span className="grid size-[38px] shrink-0 place-items-center rounded-full bg-[#ece4fb]">
                        <User className="size-[19px] text-primary" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] text-black">{t.name}</span>
                        <span className="flex items-center gap-2 truncate text-[14px] text-[#6f7075]">
                          {t.status === "pending" ? (
                            <span className="rounded-full bg-[#fdf0cf] px-2 py-[1px] text-[12px] font-bold text-[#8a6300]">
                              Pending
                            </span>
                          ) : null}
                          <span className="truncate">
                            {t.note ? `${t.note} \u00b7 ` : ""}
                            {txnDate(t.date)}
                          </span>
                        </span>
                      </span>
                      <span className="text-[17px] font-bold text-black">
                        {t.amount < 0 ? `-${usd(Math.abs(t.amount))}` : `+${usd(t.amount)}`}
                      </span>

                      <ChevronRight className="size-[20px] shrink-0 text-[#8b8b90]" strokeWidth={2.4} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center pt-16 pb-10">
          <img src={coins.url} alt="Stack of coins" className="w-[130px]" />
          <p className="mt-10 text-[17px] text-[#6f7075]">Your activity will be shown here</p>
        </div>
      )}
    </section>
  );
}

function AllPanel() {
  const navigate = useNavigate();
  const balance = useBalance();
  return (
    <section className="px-4 pt-5 pb-6">
      <p className="text-center text-[16px] font-bold text-black">Available balance</p>
      <p className="varo-title mt-2 text-center text-[40px] leading-none text-black">{usd(balance)}</p>
      <button
        type="button"
        onClick={() => navigate({ to: "/transfer" })}
        className="mt-7 h-[52px] w-full rounded-[8px] bg-primary text-[17px] font-bold text-white"
      >
        Add Money
      </button>
    </section>
  );
}

function Grid() {
  return (
    <div className="relative mt-6 h-[210px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute left-0 h-px w-full bg-[#e6e7ea]"
          style={{ top: `${i * 25}%` }}
        />
      ))}
      <span className="absolute -top-[9px] right-0 translate-x-full pl-2 text-[15px] text-[#6f7075]">
        $300
      </span>
      <span className="absolute right-0 top-[calc(50%-9px)] translate-x-full pl-2 text-[15px] text-[#6f7075]">
        $150
      </span>
      <span className="absolute right-0 bottom-[-9px] translate-x-full pl-2 text-[15px] text-[#6f7075]">
        $0
      </span>
    </div>
  );
}

function MoneyInPanel() {
  return (
    <section className="px-4 pt-5 pb-6">
      <p className="flex items-center justify-center gap-2 text-[16px] font-bold text-black">
        Total income so far this month
        <Info className="size-[17px] text-black" strokeWidth={1.8} />
      </p>
      <p className="varo-title mt-2 text-center text-[40px] leading-none text-black">$0.00</p>

      <div className="pr-12">
        <Grid />
        <div className="mt-2 flex justify-between px-2 text-[16px] text-[#6f7075]">
          <span>July</span>
          <span>August</span>
          <span>September</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-[8px] bg-[#f4f5f7] px-4 py-4">
        <DollarMark />
        <p className="flex-1 text-[16px] leading-[1.35] text-black">
          Fund your account or add direct deposit to start tracking insights.
        </p>
      </div>
    </section>
  );
}

function MoneyOutPanel() {
  const txns = useTransactions();
  const spent = txns.reduce((sum, t) => (t.amount < 0 ? sum + Math.abs(t.amount) : sum), 0);
  return (
    <section className="px-4 pt-5 pb-6">
      <p className="flex items-center justify-center gap-2 text-[16px] font-bold text-black">
        Total spend so far this month
        <Info className="size-[17px] text-black" strokeWidth={1.8} />
      </p>
      <p className="varo-title mt-2 text-center text-[40px] leading-none text-black">{usd(spent)}</p>

      <div className="pr-12">
        <Grid />
        <div className="relative -mt-px h-[3px] w-full rounded-full bg-[#8b8b90]">
          <div className="absolute left-0 h-[3px] w-[12%] rounded-full bg-primary" />
          <span className="absolute left-[10%] top-1/2 grid size-[22px] -translate-y-1/2 place-items-center rounded-full bg-primary/20">
            <span className="size-[11px] rounded-full bg-primary" />
          </span>
        </div>
        <div className="mt-2 flex justify-between text-[16px] text-[#6f7075]">
          <span>1st</span>
          <span>10th</span>
          <span>20th</span>
          <span>30th</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-6 text-[16px] text-[#6f7075]">
          <span className="flex items-center gap-2">
            <span className="size-[15px] rounded-full bg-[#8b8b90]" />
            August
          </span>
          <span className="flex items-center gap-2">
            <span className="size-[15px] rounded-full bg-primary" />
            September
          </span>
        </div>
      </div>

      <h3 className="mt-7 text-[16px] font-bold text-black">Spending by category</h3>
      <div className="-mr-4 mt-3 flex gap-3 overflow-x-auto pr-4">
        <div className="grid h-[68px] min-w-[130px] place-items-center rounded-[8px] border-2 border-black px-4 text-[16px] font-bold text-black">
          All spending
        </div>
        {[
          ["Transfers", "0% of total"],
          ["Food & Drinks", "0% of total"],
        ].map(([title, sub]) => (
          <div
            key={title}
            className="grid h-[68px] min-w-[160px] place-items-center rounded-[8px] border border-[#e2e3e6] px-4"
          >
            <p className="text-[16px] font-bold text-black">{title}</p>
            <p className="text-[15px] text-[#6f7075]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[8px] bg-[#f4f5f7] px-4 py-5">
        <p className="text-[16px] text-black">You haven't spent any money yet this month.</p>
      </div>
    </section>
  );
}

function DollarMark() {
  return (
    <span className="grid size-[34px] shrink-0 place-items-center rounded-full border-[1.6px] border-black text-[16px] font-bold text-black">
      $
    </span>
  );
}

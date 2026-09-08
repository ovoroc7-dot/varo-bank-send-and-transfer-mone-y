import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Delete,
  Landmark,
} from "lucide-react";
import fdic from "@/assets/varo/fdic.png.asset.json";
import varoTile from "@/assets/varo/varo-tile.png.asset.json";
import {
  bicFee,
  isPendingAmount,
  ledger,
  useBalance,
  useSavingsBalance,
  usd,
  type VaroAccount,
} from "@/lib/ledger";
import { useLinkedAccounts } from "@/lib/linked";

export const Route = createFileRoute("/transfer")({
  head: () => ({
    meta: [
      { title: "Transfer — Varo" },
      {
        name: "description",
        content:
          "Move money between your Varo Bank Account and Varo Savings Account, or send it to a linked external bank or card.",
      },
      { property: "og:title", content: "Transfer — Varo" },
      {
        property: "og:description",
        content: "Move money between your Varo accounts or out to a linked bank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TransferScreen,
});

type Target =
  | { kind: "varo"; account: VaroAccount; label: string; balance: number }
  | { kind: "external"; id: string; label: string };

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];

function TransferScreen() {
  const router = useRouter();
  const [sheet, setSheet] = useState<null | "from" | "to">(null);
  const [from, setFrom] = useState<Target | null>(null);
  const [to, setTo] = useState<Target | null>(null);
  const [cents, setCents] = useState("");
  const [step, setStep] = useState<"amount" | "review" | "done">("amount");
  const [error, setError] = useState("");
  const bankBalance = useBalance();
  const savingsBalance = useSavingsBalance();
  const linked = useLinkedAccounts();

  const varoTargets: Target[] = [
    { kind: "varo", account: "checking", label: "Varo Bank Account • 3046", balance: bankBalance },
    { kind: "varo", account: "savings", label: "Varo Savings Account • 2987", balance: savingsBalance },
  ];
  const externalTargets: Target[] = linked.map((l) => ({
    kind: "external",
    id: l.id,
    label: `${l.name} • ${l.last4}`,
  }));

  const value = Number(cents || "0") / 100;
  const amount = usd(value);
  const externalOut = from?.kind === "varo" && to?.kind === "external";
  const fee = externalOut ? bicFee(value) : 0;
  const pending = externalOut && isPendingAmount(value);
  const sourceBalance =
    from?.kind === "varo" ? (from.account === "checking" ? bankBalance : savingsBalance) : 0;
  const ready = !!from && !!to && value > 0;

  function press(k: string) {
    setError("");
    if (k === "del") setCents((c) => c.slice(0, -1));
    else setCents((c) => (c + k).replace(/^0+(?=\d)/, "").slice(0, 9));
  }

  function pick(t: Target) {
    setError("");
    if (sheet === "from") {
      setFrom(t);
      if (to && sameTarget(t, to)) setTo(null);
    } else {
      setTo(t);
      if (from && sameTarget(t, from)) setFrom(null);
    }
    setSheet(null);
  }

  function next() {
    if (!from || !to) return;
    if (to.kind === "external" && from.kind === "varo" && from.account === "savings") {
      setError(
        "Transfers to a linked bank or card have to come from your Varo Bank Account. Move the money to your Varo Bank Account first.",
      );
      return;
    }
    if (value <= 0) {
      setError("Enter an amount to transfer.");
      return;
    }
    if (value + fee > sourceBalance) {
      setError(`That's more than your available balance of ${usd(sourceBalance)}.`);
      return;
    }
    setStep("review");
  }

  function confirm() {
    if (!from || !to || from.kind !== "varo") return;
    if (to.kind === "varo") {
      ledger.transferBetweenAccounts({ from: from.account, to: to.account, amount: value });
    } else {
      ledger.addSent({ name: to.label, note: "Transfer to linked bank", amount: value });
    }
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="min-h-screen bg-white px-4 pt-16">
        <div className="mx-auto grid size-[74px] place-items-center rounded-full bg-[#e6f4ec]">
          <Check className="size-9 text-[#1d7a4f]" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-center text-[26px] font-bold text-black">
          {pending ? "Transfer submitted" : "Transfer complete"}
        </h1>
        <p className="mt-3 text-center text-[16px] leading-[1.45] text-[#5f6065]">
          {amount} from {from?.label} to {to?.label}.
          {pending ? " It's pending review and will settle shortly." : ""}
        </p>
        {fee ? (
          <p className="mt-2 text-center text-[15px] text-[#5f6065]">BIC fee {usd(fee)}</p>
        ) : null}
        <Link
          to="/account"
          className="mt-8 block w-full rounded-[8px] bg-primary py-4 text-center text-[17px] font-bold text-white"
        >
          View activity
        </Link>
        <Link to="/" className="mt-4 block w-full py-2 text-center text-[15px] font-bold text-primary">
          Done
        </Link>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="min-h-screen bg-white pb-10">
        <header className="flex items-center gap-4 px-4 pt-5 pb-2">
          <button type="button" aria-label="Back" onClick={() => setStep("amount")}>
            <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
          </button>
          <span className="text-[17px] font-bold text-black">Review transfer</span>
        </header>

        <p className="varo-title mt-8 text-center text-[48px] leading-none text-black">{amount}</p>

        <div className="mt-8 px-4">
          <Row label="From" value={from?.label ?? ""} />
          <Row label="To" value={to?.label ?? ""} />
          <Row label="BIC fee" value={fee ? usd(fee) : "None"} />
          <Row label="Total" value={usd(value + fee)} />
          <Row
            label="Arrives"
            value={
              to?.kind === "varo" ? "Instantly" : pending ? "Pending review" : "1–3 business days"
            }
          />
        </div>

        {pending ? (
          <p className="mx-4 mt-5 rounded-[8px] bg-[#fff5e5] px-4 py-3 text-[14px] leading-[1.45] text-[#7a5200]">
            Transfers of $1,000 or more are held for review before they settle.
          </p>
        ) : null}

        <button
          type="button"
          onClick={confirm}
          className="mx-4 mt-8 block w-[calc(100%-2rem)] rounded-[8px] bg-primary py-4 text-[17px] font-bold text-white"
        >
          Transfer {usd(value + fee)}
        </button>
        <button
          type="button"
          onClick={() => setStep("amount")}
          className="mx-4 mt-4 block w-[calc(100%-2rem)] py-2 text-[15px] font-bold text-primary"
        >
          Edit amount
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <header className="flex items-center gap-4 px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
            else router.navigate({ to: "/", replace: true });
          }}
          aria-label="Back"
        >
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Transfer</span>
      </header>

      {(
        [
          ["From:", from, "from"],
          ["To:", to, "to"],
        ] as const
      ).map(([label, target, key]) => (
        <div key={key} className="px-4">
          <button
            type="button"
            onClick={() => setSheet(key)}
            className="flex w-full items-center gap-4 border-b border-border py-4 text-left"
          >
            <span className="w-11 text-[13px] font-bold text-black">{label}</span>
            <span className="flex size-[42px] items-center justify-center rounded-[6px] bg-[#f1f1f4]">
              <Landmark className="size-6 text-black" strokeWidth={1.7} />
            </span>
            <span className="flex-1 text-[16px] text-black">
              {target?.label ?? "Select an account"}
            </span>
            <ChevronDown className="size-6 text-black" strokeWidth={2} />
          </button>
        </div>
      ))}

      <p className="varo-title mt-14 text-center text-[54px] leading-none text-black">{amount}</p>
      {from ? (
        <p className="mt-2 text-center text-[14px] text-[#6f7075]">
          Available {usd(sourceBalance)}
        </p>
      ) : null}
      {fee ? (
        <p className="mt-1 text-center text-[14px] text-[#6f7075]">BIC fee {usd(fee)}</p>
      ) : null}

      {error ? (
        <p className="mx-4 mt-4 rounded-[8px] bg-[#fdeceb] px-4 py-3 text-[14px] leading-[1.45] text-[#a4322a]">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex items-start gap-3 px-4">
        <img src={fdic.url} alt="" aria-hidden className="mt-[2px] h-[18px] w-auto" />
        <p className="text-[15px] leading-[1.35] text-black">
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government
        </p>
      </div>

      <div className="px-4 pt-8">
        <button
          type="button"
          onClick={next}
          disabled={!ready}
          className="h-[52px] w-full rounded-[8px] bg-[#e3e6ea] text-[16px] text-[#9a9ba0] enabled:bg-primary enabled:font-bold enabled:text-white"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-3 pt-4 pb-6">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className="flex h-[74px] items-center justify-center text-[24px] text-[#6f7075]"
          >
            {k === "del" ? <Delete className="size-7 text-[#4b4c50]" strokeWidth={1.6} /> : k}
          </button>
        ))}
      </div>

      {sheet ? (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col justify-end">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSheet(null)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-[18px] bg-white pb-8">
            <div className="flex justify-center pt-3">
              <span className="h-[5px] w-10 rounded-full bg-[#b9bac0]" />
            </div>
            <h2 className="varo-title px-4 pt-8 pb-4 text-[24px] text-black">
              Transfer {sheet === "from" ? "from" : "to"}
            </h2>
            <p className="px-4 pb-2 text-[13px] font-bold text-black">Varo Accounts</p>
            {varoTargets.map((a, i) => (
              <button
                key={a.label}
                type="button"
                onClick={() => pick(a)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <img src={varoTile.url} alt="" aria-hidden className="size-[46px] rounded-[8px]" />
                <span>
                  <span className="block text-[16px] text-black">{a.label}</span>
                  <span className="block text-[13px] text-[#8b8b90]">
                    Available: {a.kind === "varo" ? usd(a.balance) : ""}
                  </span>
                </span>
              </button>
            ))}

            {sheet === "to" ? (
              <>
                <p className="border-t border-border px-4 pt-5 pb-2 text-[13px] font-bold text-black">
                  Linked banks and cards
                </p>
                {externalTargets.length ? (
                  externalTargets.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => pick(a)}
                      className="flex w-full items-center gap-4 border-t border-border px-4 py-4 text-left"
                    >
                      <span className="grid size-[46px] place-items-center rounded-[8px] bg-[#f1f1f4]">
                        <Landmark className="size-6 text-black" strokeWidth={1.7} />
                      </span>
                      <span>
                        <span className="block text-[16px] text-black">{a.label}</span>
                        <span className="block text-[13px] text-[#8b8b90]">
                          From your Varo Bank Account only
                        </span>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 pb-2 text-[14px] text-[#6f7075]">
                    You haven't linked a bank or card yet.
                  </p>
                )}
              </>
            ) : null}

            <Link
              to="/linked-cards"
              className="flex items-center gap-4 border-t border-border px-4 py-5"
            >
              <CircleDollarSign className="size-7 text-black" strokeWidth={1.6} />
              <span className="flex-1 text-[16px] text-black">Link an account</span>
              <ChevronRight className="size-6 text-black" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function sameTarget(a: Target, b: Target) {
  return a.label === b.label;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between border-b border-border py-4">
      <span className="text-[15px] text-[#6f7075]">{label}</span>
      <span className="max-w-[62%] text-right text-[15px] text-black">{value}</span>
    </div>
  );
}

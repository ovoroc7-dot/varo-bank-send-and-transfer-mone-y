import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Landmark, Plus } from "lucide-react";
import { ledger, useBalance, usd } from "@/lib/ledger";
import { useLinkedAccounts } from "@/lib/linked";

export const Route = createFileRoute("/add-money")({
  head: () => ({
    meta: [
      { title: "Add money — Varo" },
      {
        name: "description",
        content:
          "Add money to your Varo Bank Account from a linked debit card or external bank account.",
      },
      { property: "og:title", content: "Add money — Varo" },
      {
        property: "og:description",
        content: "Move money into your Varo Bank Account from a linked card or bank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AddMoneyScreen,
});

const presets = [25, 50, 100, 250, 500, 1000];

function AddMoneyScreen() {
  const router = useRouter();
  const linked = useLinkedAccounts();
  const balance = useBalance();
  const [sourceId, setSourceId] = useState<string | null>(linked[0]?.id ?? null);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const source = linked.find((l) => l.id === sourceId) ?? null;
  const value = Number(raw || "0");

  if (done) {
    return (
      <div className="min-h-screen bg-white px-4 pt-16">
        <div className="mx-auto grid size-[74px] place-items-center rounded-full bg-[#e6f4ec]">
          <Check className="size-9 text-[#1d7a4f]" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-center text-[26px] font-bold text-black">Money added</h1>
        <p className="mt-3 text-center text-[16px] leading-[1.45] text-[#5f6065]">
          {usd(value)} was added to your Varo Bank Account from {source?.name} • {source?.last4}.
        </p>
        <p className="mt-2 text-center text-[15px] text-[#5f6065]">
          New balance {usd(balance)}
        </p>
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

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="flex items-center gap-4 px-4 pt-5 pb-2">
        <button
          type="button"
          aria-label="Back"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
            else router.navigate({ to: "/", replace: true });
          }}
        >
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Add money</span>
      </header>

      <div className="px-4 pt-4">
        <h1 className="text-[24px] font-bold text-black">Add money to your Varo Bank Account</h1>
        <p className="mt-2 text-[15px] leading-[1.45] text-[#5f6065]">
          Available balance {usd(balance)}
        </p>

        <p className="mt-6 text-[13px] font-bold text-black">Add from</p>
        {linked.length ? (
          <div className="mt-2 overflow-hidden rounded-[8px] border border-border">
            {linked.map((l, i) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSourceId(l.id)}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="grid size-[42px] place-items-center rounded-[6px] bg-[#f1f1f4]">
                  <Landmark className="size-5 text-black" strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-[16px] text-black">
                    {l.name} • {l.last4}
                  </span>
                  <span className="block text-[13px] text-[#8b8b90]">
                    {l.kind === "card" ? "Linked debit card" : "Linked bank account"}
                  </span>
                </span>
                <span
                  className={`grid size-6 place-items-center rounded-full ${
                    sourceId === l.id ? "bg-black" : "border border-[#b9bac0]"
                  }`}
                >
                  {sourceId === l.id ? <Check className="size-4 text-white" strokeWidth={3} /> : null}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Link
            to="/linked-cards"
            className="mt-2 flex items-center gap-3 rounded-[8px] border border-border px-4 py-4"
          >
            <span className="grid size-[42px] place-items-center rounded-[6px] bg-[#f1f1f4]">
              <Plus className="size-5 text-black" strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-[16px] text-black">Link a card or bank first</span>
            <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
          </Link>
        )}

        <p className="mt-6 text-[13px] font-bold text-black">Amount</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setRaw(String(p));
                setError("");
              }}
              className={`rounded-full px-5 py-2 text-[15px] font-bold ${
                raw === String(p) ? "bg-black text-white" : "border border-border text-black"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          inputMode="decimal"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value.replace(/[^\d.]/g, ""));
            setError("");
          }}
          placeholder="Other amount"
          aria-label="Amount to add"
          className="mt-4 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black outline-none focus:border-primary"
        />

        {error ? <p className="mt-3 text-[14px] text-[#a4322a]">{error}</p> : null}

        <button
          type="button"
          onClick={() => {
            if (!source) {
              setError("Link a debit card or bank account first.");
              return;
            }
            if (!(value >= 1)) {
              setError("Enter an amount of $1.00 or more.");
              return;
            }
            ledger.addReceived({
              name: `${source.name} • ${source.last4}`,
              note: "Added money",
              amount: value,
            });
            setDone(true);
          }}
          className="mt-8 w-full rounded-[8px] bg-primary py-4 text-[17px] font-bold text-white"
        >
          Add money
        </button>
        <p className="mt-4 text-[12px] leading-[1.45] text-[#6f7075]">
          Money added from a linked debit card is usually available right away. Bank transfers can
          take 1–3 business days.
        </p>
      </div>
    </div>
  );
}

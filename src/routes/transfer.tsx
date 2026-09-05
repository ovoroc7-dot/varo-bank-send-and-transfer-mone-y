import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, CircleDollarSign, Delete, Landmark } from "lucide-react";
import fdic from "@/assets/varo/fdic.png.asset.json";
import varoTile from "@/assets/varo/varo-tile.png.asset.json";

export const Route = createFileRoute("/transfer")({
  head: () => ({
    meta: [
      { title: "Transfer — Varo" },
      {
        name: "description",
        content: "Move money between your Varo Bank Account and Varo Savings Account.",
      },
      { property: "og:title", content: "Transfer — Varo" },
      { property: "og:description", content: "Move money between your Varo accounts." },
    ],
  }),
  component: TransferScreen,
});

const accounts = [
  { name: "Varo Bank Account", last4: "3046", balance: "$60,000.00" },
  { name: "Varo Savings Account", last4: "2987", balance: "$0.00" },
];

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];

function TransferScreen() {
  const router = useRouter();
  const [sheet, setSheet] = useState<null | "from" | "to">(null);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [cents, setCents] = useState("");

  const amount = (Number(cents || "0") / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  function press(k: string) {
    if (k === "del") setCents((c) => c.slice(0, -1));
    else setCents((c) => (c + k).replace(/^0+(?=\d)/, "").slice(0, 9));
  }

  return (
    <div className="relative min-h-screen bg-white">
      <header className="flex items-center gap-4 px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) router.history.back();
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
      ).map(([label, value, key]) => (
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
            <span className="flex-1 text-[16px] text-black">{value ?? "Select an account"}</span>
            <ChevronDown className="size-6 text-black" strokeWidth={2} />
          </button>
        </div>
      ))}

      <p className="varo-title mt-14 text-center text-[54px] leading-none text-black">{amount}</p>

      <div className="mt-6 flex items-start gap-3 px-4">
        <img src={fdic.url} alt="" aria-hidden className="mt-[2px] h-[18px] w-auto" />
        <p className="text-[15px] leading-[1.35] text-black">
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government
        </p>
      </div>

      <div className="px-4 pt-8">
        <button
          type="button"
          disabled
          className="h-[52px] w-full rounded-[8px] bg-[#e3e6ea] text-[16px] text-[#9a9ba0]"
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
          <div className="relative rounded-t-[18px] bg-white pb-8">
            <div className="flex justify-center pt-3">
              <span className="h-[5px] w-10 rounded-full bg-[#b9bac0]" />
            </div>
            <h2 className="varo-title px-4 pt-8 pb-4 text-[24px] text-black">
              Transfer {sheet === "from" ? "from" : "to"}
            </h2>
            <p className="px-4 pb-2 text-[13px] font-bold text-black">Varo Accounts</p>
            {accounts.map((a, i) => (
              <button
                key={a.last4}
                type="button"
                onClick={() => {
                  const label = `${a.name} • ${a.last4}`;
                  if (sheet === "from") setFrom(label);
                  else setTo(label);
                  setSheet(null);
                }}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <img src={varoTile.url} alt="" aria-hidden className="size-[46px] rounded-[8px]" />
                <span>
                  <span className="block text-[16px] text-[#6f7075]">
                    {a.name} • {a.last4}
                  </span>
                  <span className="block text-[13px] text-[#8b8b90]">Available: {a.balance}</span>
                </span>
              </button>
            ))}
            <div className="flex items-center gap-4 border-t border-border px-4 py-5">
              <CircleDollarSign className="size-7 text-black" strokeWidth={1.6} />
              <span className="flex-1 text-[16px] text-black">Link an account</span>
              <ChevronRight className="size-6 text-black" strokeWidth={2.2} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

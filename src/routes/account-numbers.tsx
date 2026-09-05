import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy } from "lucide-react";
import { BackHeader, Toggle } from "@/components/varo/back-header";

export const Route = createFileRoute("/account-numbers")({
  head: () => ({
    meta: [
      { title: "Account numbers — Varo" },
      {
        name: "description",
        content: "View and copy the account and routing numbers for your Varo Bank and Savings accounts.",
      },
      { property: "og:title", content: "Account numbers — Varo" },
      {
        property: "og:description",
        content: "Bank and savings account numbers, routing numbers and direct deposit.",
      },
    ],
  }),
  component: AccountNumbersScreen,
});

function AccountNumbersScreen() {
  const [show, setShow] = useState(true);

  return (
    <div className="min-h-screen bg-white pb-10">
      <BackHeader title="Account numbers" />

      <p className="px-4 pt-2 text-[15px] font-bold text-black">Varo Bank Account</p>
      <NumberRow label="Account number" value={show ? "****3046" : "••••••••"} />
      <NumberRow label="Routing number" value="124303201" />
      <button
        type="button"
        className="mx-4 mt-4 block w-[calc(100%-2rem)] rounded-[8px] border border-primary py-4 text-[15px] font-bold text-primary"
      >
        Manage direct deposit
      </button>

      <div className="mt-6 h-3 bg-surface" />

      <p className="px-4 pt-4 text-[15px] font-bold text-black">Varo Savings Account</p>
      <NumberRow label="Account number" value={show ? "****2987" : "••••••••"} />
      <NumberRow label="Routing number" value="124303201" />

      <div className="mt-4 h-3 bg-surface" />

      <div className="flex items-center px-4 py-5">
        <span className="flex-1 text-[17px] text-black">Show account numbers</span>
        <Toggle on={show} onChange={setShow} label="Show account numbers" />
      </div>
    </div>
  );
}

function NumberRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mx-4 flex items-center border-b border-border py-4">
      <div className="flex-1">
        <p className="text-[13px] text-[#5f6065]">{label}</p>
        <p className="mt-1 text-[17px] text-black">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        onClick={() => navigator.clipboard?.writeText(value)}
      >
        <Copy className="size-5 text-black" strokeWidth={1.8} />
      </button>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BackHeader } from "@/components/varo/back-header";
import bankIll from "@/assets/varo/bank-ill.png.asset.json";
import cardIll from "@/assets/varo/card-ill.png.asset.json";

export const Route = createFileRoute("/linked-cards")({
  head: () => ({
    meta: [
      { title: "Linked cards and accounts — Varo" },
      {
        name: "description",
        content: "Link an external debit card or bank account to move money in and out of your Varo account.",
      },
      { property: "og:title", content: "Linked cards and accounts — Varo" },
      {
        property: "og:description",
        content: "Your linked external cards and accounts, and how to link a new one.",
      },
    ],
  }),
  component: LinkedCardsScreen,
});

function LinkedCardsScreen() {
  const [tab, setTab] = useState<"cards" | "accounts">("cards");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white pb-8">
      <BackHeader title="Linked cards and accounts" />

      <div className="flex gap-3 px-4">
        {(["cards", "accounts"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-[15px] font-bold ${
              tab === t ? "bg-black text-white" : "border border-border bg-white text-black"
            }`}
          >
            {t === "cards" ? "Cards" : "Accounts"}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-start pt-14">
        <img
          src={tab === "cards" ? cardIll.url : bankIll.url}
          alt=""
          className="h-[86px] w-auto"
        />
        <p className="mt-4 text-[19px] font-bold text-black">
          {tab === "cards" ? "You haven't linked any cards yet" : "You haven't linked any accounts yet"}
        </p>
        <p className="mt-2 text-[15px] text-[#5f6065]">
          {tab === "cards" ? "Linked cards will be shown here." : "Linked external accounts will be shown here."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (tab === "cards") navigate({ to: "/add-debit-card" });
        }}
        className="mx-4 rounded-[8px] bg-primary py-4 text-[15px] font-bold text-white"
      >
        {tab === "cards" ? "Link a card" : "Link an account"}
      </button>
    </div>
  );
}

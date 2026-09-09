import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BackHeader } from "@/components/varo/back-header";
import { linkedStore } from "@/lib/linked";

export const Route = createFileRoute("/link-bank")({
  head: () => ({
    meta: [
      { title: "Link a bank account — Varo" },
      {
        name: "description",
        content:
          "Link an external bank account to move money in and out of your Varo Bank Account.",
      },
      { property: "og:title", content: "Link a bank account — Varo" },
      {
        property: "og:description",
        content: "Bank name, routing number and account number to link an external bank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LinkBankScreen,
});

function LinkBankScreen() {
  const navigate = useNavigate();
  const [bank, setBank] = useState("");
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  const ready = bank.trim() !== "" && routing.length === 9 && account.length >= 4;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <BackHeader title="Link a bank account" />

      <div className="flex-1 px-4">
        <h1 className="text-[24px] font-bold text-black">Link an external bank</h1>
        <p className="mt-3 text-[15px] leading-[1.4] text-black">
          Use a U.S. checking or savings account in your name. Money can be transferred out of your
          Varo Bank Account to this bank.
        </p>

        <label className="mt-6 block text-[13px] font-bold text-black" htmlFor="bank">
          Bank name
        </label>
        <input
          id="bank"
          value={bank}
          onChange={(e) => {
            setBank(e.target.value);
            setError("");
          }}
          placeholder="Bank name"
          className="mt-2 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black placeholder:text-[#8b8b90]"
        />

        <label className="mt-5 block text-[13px] font-bold text-black" htmlFor="routing">
          Routing number
        </label>
        <input
          id="routing"
          inputMode="numeric"
          value={routing}
          onChange={(e) => {
            setRouting(e.target.value.replace(/\D/g, "").slice(0, 9));
            setError("");
          }}
          placeholder="9 digits"
          className="mt-2 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black placeholder:text-[#8b8b90]"
        />

        <label className="mt-5 block text-[13px] font-bold text-black" htmlFor="acct">
          Account number
        </label>
        <input
          id="acct"
          inputMode="numeric"
          value={account}
          onChange={(e) => {
            setAccount(e.target.value.replace(/\D/g, "").slice(0, 17));
            setError("");
          }}
          placeholder="Account number"
          className="mt-2 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black placeholder:text-[#8b8b90]"
        />

        {error ? <p className="mt-4 text-[14px] text-[#a4322a]">{error}</p> : null}
      </div>

      <div className="border-t border-border px-4 pt-4 pb-6">
        <p className="text-[12px] leading-[1.4] text-[#5f6065]">
          Your bank details are stored securely and can be used for transfers in and out of your
          Varo Bank Account.
        </p>
        <button
          type="button"
          onClick={() => {
            if (!ready) {
              setError("Enter your bank name, a 9-digit routing number and your account number.");
              return;
            }
            linkedStore.add({
              kind: "bank",
              name: bank.trim(),
              last4: account.slice(-4),
            });
            navigate({ to: "/linked-cards", replace: true });
          }}
          className="mt-4 w-full rounded-[8px] bg-primary py-4 text-[15px] font-bold text-white"
        >
          Link bank account
        </button>
      </div>
    </div>
  );
}

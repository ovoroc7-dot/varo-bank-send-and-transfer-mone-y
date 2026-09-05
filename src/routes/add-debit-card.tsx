import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { BackHeader } from "@/components/varo/back-header";

export const Route = createFileRoute("/add-debit-card")({
  head: () => ({
    meta: [
      { title: "Add a debit card — Varo" },
      {
        name: "description",
        content: "Add a U.S. Visa or Mastercard debit card to your Varo account for transfers and payments.",
      },
      { property: "og:title", content: "Add a debit card — Varo" },
      {
        property: "og:description",
        content: "Name on card, card number, expiration, security code and billing address.",
      },
    ],
  }),
  component: AddDebitCardScreen,
});

const ADDRESS = "1720 Sandy Hollow Loop,  Middleburg, FL 320...";

function AddDebitCardScreen() {
  const [open, setOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <BackHeader />

      <div className="flex-1 px-4">
        <h1 className="text-[27px] font-bold text-black">Add a debit card</h1>
        <p className="mt-3 text-[15px] leading-[1.4] text-black">
          U.S. Visa/Mastercard debit and some prepaid cards accepted. Credit cards aren't accepted.
        </p>

        <label className="mt-6 block text-[13px] font-bold text-black" htmlFor="name">
          Name on card
        </label>
        <input
          id="name"
          defaultValue="Joann Juckett"
          className="mt-2 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black"
        />

        <label className="mt-5 block text-[13px] font-bold text-black" htmlFor="number">
          Debit card number
        </label>
        <input
          id="number"
          placeholder="Debit card number"
          className="mt-2 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black placeholder:text-[#8b8b90]"
        />

        <div className="mt-5 flex gap-4">
          <div className="flex-1">
            <label className="block text-[13px] font-bold text-black" htmlFor="exp">
              Expiration
            </label>
            <input
              id="exp"
              placeholder="MM/YY"
              className="mt-2 w-full rounded-[8px] border border-border px-4 py-4 text-[16px] text-black placeholder:text-[#8b8b90]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[13px] font-bold text-black" htmlFor="cvc">
              Security code
            </label>
            <div className="relative mt-2">
              <input
                id="cvc"
                type={showCode ? "text" : "password"}
                placeholder="Security code"
                className="w-full rounded-[8px] border border-border px-4 py-4 pr-11 text-[16px] text-black placeholder:text-[#8b8b90]"
              />
              <button
                type="button"
                aria-label="Show security code"
                onClick={() => setShowCode((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <Eye className="size-5 text-black" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-[13px] font-bold text-black">Card billing address</p>
        <div className="relative mt-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center rounded-[8px] border border-border px-4 py-4 text-left"
          >
            <span className="flex-1 text-[16px] text-black">{ADDRESS}</span>
            {open ? (
              <ChevronUp className="size-5 text-black" strokeWidth={2} />
            ) : (
              <ChevronDown className="size-5 text-black" strokeWidth={2} />
            )}
          </button>
          {open ? (
            <div className="absolute inset-x-0 top-[calc(100%+4px)] z-10 rounded-[8px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-black">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </span>
                <span className="text-[16px] text-black">1720 Sandy Hollow Loop,  Middleburg, FL 32...</span>
              </div>
              <button type="button" className="w-full px-4 py-4 text-left text-[16px] text-black">
                Add new address
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-border px-4 pt-4 pb-6">
        <p className="text-[12px] leading-[1.4] text-[#5f6065]">
          Your debit card information is stored securely and can be used for pre-authorized
          transfers and payments.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 w-full rounded-[8px] bg-[#e4e6ea] py-4 text-[15px] font-bold text-[#9a9ba0]"
        >
          Next
        </button>
      </div>
    </div>
  );
}

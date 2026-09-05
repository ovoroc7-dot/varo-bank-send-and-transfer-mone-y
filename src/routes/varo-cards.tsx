import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Mail, MessageSquare, X } from "lucide-react";
import { BackHeader, Toggle } from "@/components/varo/back-header";

export const Route = createFileRoute("/varo-cards")({
  head: () => ({
    meta: [
      { title: "Varo Debit Card — Varo" },
      {
        name: "description",
        content: "View your Varo Visa debit card number, freeze your card, change your PIN or report it lost or stolen.",
      },
      { property: "og:title", content: "Varo Debit Card — Varo" },
      {
        property: "og:description",
        content: "View card number, freeze card, change PIN, report lost or stolen, Apple Wallet.",
      },
    ],
  }),
  component: VaroCardsScreen,
});

function VaroCardsScreen() {
  const [frozen, setFrozen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-10">
      <BackHeader title="Varo Debit Card" />

      <div className="mx-auto mt-2 flex h-[330px] w-[210px] flex-col justify-between rounded-[12px] bg-primary p-4">
        <p className="varo-wordmark text-[30px] leading-none text-white">Varo</p>
        <div className="flex items-end justify-between">
          <p className="text-[13px] leading-[1.25] text-white">
            Joann
            <br />
            Juckett
          </p>
          <p className="text-right text-white">
            <span className="block text-[11px] leading-none">DEBIT</span>
            <span className="block text-[19px] leading-tight font-bold italic">VISA</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="mx-4 mt-6 block w-[calc(100%-2rem)] rounded-[8px] border border-primary py-4 text-[15px] font-bold text-primary"
      >
        View card number
      </button>

      <div className="mx-4 mt-6 flex items-center">
        <span className="flex-1 text-[17px] text-black">Freeze card</span>
        <Toggle on={frozen} onChange={setFrozen} label="Freeze card" />
      </div>
      <p className="mx-4 mt-3 border-b border-border pb-4 text-[12px] leading-[1.4] text-[#5f6065]">
        Freezing your card blocks new purchases and refunds but won't affect pre-authorized charges,
        recurring payments, direct deposits, or bill payments.
      </p>

      <LinkRow label="Change PIN" />
      <LinkRow label="Report lost or stolen card" />

      <button
        type="button"
        className="mx-4 mt-6 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-[8px] bg-black py-4 text-[17px] font-bold text-white"
      >
        <span className="grid h-[18px] w-[26px] place-items-center rounded-[3px] bg-[#f4a63a] text-[9px]">
          ▤
        </span>
        Add to Apple Wallet
      </button>

      <p className="mx-4 mt-6 text-[11px] leading-[1.45] text-[#5f6065]">
        Visa is registered trademark of Visa International Service Association. The Varo Visa® Debit
        Card is issued pursuant to a license from Visa U.S.A. Inc and may be used everywhere Visa
        debit cards are accepted.
      </p>

      {confirm ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-[430px]">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setConfirm(false)}
            className="absolute inset-0 bg-black/30"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[18px] bg-white px-4 pt-5 pb-10">
            <div className="flex justify-end">
              <button type="button" aria-label="Close" onClick={() => setConfirm(false)}>
                <X className="size-6 text-black" strokeWidth={2.2} />
              </button>
            </div>
            <h2 className="mt-2 text-[26px] font-bold text-black">Confirm your identity</h2>
            <p className="mt-3 text-[15px] leading-[1.45] text-black">
              It's for your security. Let us know if you prefer an email or text.
            </p>
            <button type="button" className="mt-6 flex w-full items-center gap-4 border-b border-border py-4">
              <Mail className="size-6 text-black" strokeWidth={1.8} />
              <span className="flex-1 text-left text-[17px] text-black">Email</span>
              <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
            </button>
            <button type="button" className="flex w-full items-center gap-4 py-4">
              <MessageSquare className="size-6 text-black" strokeWidth={1.8} />
              <span className="flex-1 text-left text-[17px] text-black">Text message</span>
              <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <button type="button" className="mx-4 flex w-[calc(100%-2rem)] items-center border-b border-border py-5 text-left">
      <span className="flex-1 text-[17px] text-black">{label}</span>
      <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
    </button>
  );
}

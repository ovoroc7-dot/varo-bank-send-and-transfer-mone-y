import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Eye, Zap } from "lucide-react";
import { ledger, usd } from "@/lib/ledger";

export const Route = createFileRoute("/fund-instantly")({
  head: () => ({
    meta: [
      { title: "Fund instantly — Varo" },
      {
        name: "description",
        content:
          "Add money to your Varo Bank Account instantly from a US Visa or Mastercard debit card. Pick an amount and fund in seconds.",
      },
      { property: "og:title", content: "Fund instantly — Varo" },
      {
        property: "og:description",
        content: "Add money instantly from a debit card — pick $20, $50, $75, $100 or any amount.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FundInstantlyScreen,
});

const presets = [20, 50, 75, 100];

function FundInstantlyScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [other, setOther] = useState(false);
  const [otherCents, setOtherCents] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [done, setDone] = useState(false);

  const value = other ? Number(otherCents || "0") / 100 : amount;
  const cardDigits = card.replace(/\D/g, "");
  const ready = value >= 1 && cardDigits.length >= 15 && exp.length >= 5 && cvv.length >= 3;

  function back() {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to: "/move-money", replace: true });
  }

  function addMoney() {
    if (!ready) return;
    ledger.addReceived({
      name: `Debit card ••${cardDigits.slice(-4)}`,
      note: "Instant funding",
      amount: value,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-white px-4 pt-5 pb-6">
        <button type="button" aria-label="Back" onClick={() => router.navigate({ to: "/account" })}>
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <div className="pt-16 text-center">
          <p className="varo-title text-[54px] leading-none text-black">{usd(value)}</p>
          <p className="mt-2 flex items-center justify-center gap-1 text-[14px] font-bold text-[#0f8a5f]">
            <Zap className="size-[14px]" strokeWidth={2.6} /> Added instantly
          </p>
          <p className="mt-6 text-[15px] text-[#6f7075]">
            New available balance {usd(ledger.getBalance())}
          </p>
        </div>
        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={() => router.navigate({ to: "/account" })}
            className="h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white"
          >
            View activity
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/move-money" })}
            className="h-[52px] w-full rounded-[8px] border border-primary text-[16px] font-bold text-primary"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="flex items-center gap-4 px-4 pt-5 pb-2">
        <button type="button" aria-label="Back" onClick={back}>
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Fund instantly</span>
      </header>

      <p className="varo-title pt-6 text-center text-[46px] leading-none text-black">
        {usd(value)}
      </p>
      <p className="flex items-center justify-center gap-1 pt-2 text-[13px] font-bold text-[#0f8a5f]">
        <Zap className="size-[13px]" strokeWidth={2.6} /> Instant
      </p>

      <div className="flex flex-wrap gap-3 px-4 pt-6">
        {presets.map((p) => {
          const on = !other && amount === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                setOther(false);
                setAmount(p);
              }}
              className={`h-[38px] min-w-[74px] rounded-full border px-4 text-[15px] font-medium ${
                on ? "border-black bg-black text-white" : "border-border bg-white text-black"
              }`}
            >
              ${p}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setOther(true);
            setAmount(0);
          }}
          className={`h-[38px] rounded-full border px-4 text-[15px] font-medium ${
            other ? "border-black bg-black text-white" : "border-border bg-white text-black"
          }`}
        >
          Other amount
        </button>
      </div>

      {other ? (
        <div className="px-4 pt-4">
          <label htmlFor="other" className="block text-[13px] font-bold text-black">
            Amount
          </label>
          <input
            id="other"
            inputMode="numeric"
            value={otherCents}
            onChange={(e) => setOtherCents(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="Enter amount in cents"
            className="mt-1 h-[52px] w-full rounded-[8px] border border-border px-4 text-[16px] text-black outline-none focus:border-primary"
          />
        </div>
      ) : null}

      <div className="px-4 pt-6">
        <label htmlFor="card" className="block text-[13px] font-bold text-black">
          Debit card number
        </label>
        <input
          id="card"
          inputMode="numeric"
          autoComplete="off"
          value={card}
          onChange={(e) => setCard(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))}
          placeholder="Debit card number"
          className="mt-1 h-[52px] w-full rounded-[8px] border border-border px-4 text-[16px] text-black outline-none focus:border-primary"
        />
        <p className="pt-2 text-[12px] leading-[1.35] text-[#6f7075]">
          U.S. Visa/Mastercard debit and some prepaid cards accepted. Credit cards aren't accepted.
        </p>

        <div className="flex gap-3 pt-4">
          <span className="flex-1">
            <label htmlFor="exp" className="block text-[13px] font-bold text-black">
              Expiration
            </label>
            <input
              id="exp"
              inputMode="numeric"
              value={exp}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
              }}
              placeholder="MM/YY"
              className="mt-1 h-[52px] w-full rounded-[8px] border border-border px-4 text-[16px] text-black outline-none focus:border-primary"
            />
          </span>
          <span className="flex-1">
            <label htmlFor="cvv" className="block text-[13px] font-bold text-black">
              Security code
            </label>
            <span className="relative mt-1 block">
              <input
                id="cvv"
                inputMode="numeric"
                type={showCvv ? "text" : "password"}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Security code"
                className="h-[52px] w-full rounded-[8px] border border-border pr-11 pl-4 text-[16px] text-black outline-none focus:border-primary"
              />
              <button
                type="button"
                aria-label="Show security code"
                onClick={() => setShowCvv((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <Eye className="size-[18px] text-black" strokeWidth={2} />
              </button>
            </span>
          </span>
        </div>

        <p className="pt-4 text-[13px] font-bold text-black">Card billing address</p>
        <button
          type="button"
          className="mt-1 flex h-[52px] w-full items-center justify-between rounded-[8px] border border-border px-4 text-left"
        >
          <span className="truncate text-[15px] text-black">
            1720 Sandy Hollow Loop, Middleburg, FL 320…
          </span>
          <ChevronDown className="size-5 shrink-0 text-black" strokeWidth={2.2} />
        </button>

        <p className="pt-5 text-[12px] leading-[1.35] text-[#6f7075]">
          Your card information is stored securely and may be used for payments and transfers per
          your authorization.
        </p>

        <button
          type="button"
          onClick={addMoney}
          disabled={!ready}
          className={`mt-5 h-[52px] w-full rounded-[8px] text-[16px] font-bold ${
            ready ? "bg-primary text-white active:opacity-90" : "bg-[#e3e6ea] text-[#9a9ba0]"
          }`}
        >
          Add money
        </button>
      </div>
    </div>
  );
}

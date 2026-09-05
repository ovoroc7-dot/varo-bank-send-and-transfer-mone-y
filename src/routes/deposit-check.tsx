import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { Art } from "@/components/varo/icon";
import { ledger, usd } from "@/lib/ledger";

export const Route = createFileRoute("/deposit-check")({
  head: () => ({
    meta: [
      { title: "Deposit check — Varo" },
      {
        name: "description",
        content:
          "Deposit a check into your Varo Bank Account by entering the amount and snapping a photo of the front and back.",
      },
      { property: "og:title", content: "Deposit check — Varo" },
      {
        property: "og:description",
        content: "Snap the front and back of your check to deposit it into your Varo account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DepositCheckScreen,
});

function DepositCheckScreen() {
  const router = useRouter();
  const [cents, setCents] = useState("");
  const [front, setFront] = useState(false);
  const [backSide, setBackSide] = useState(false);
  const [done, setDone] = useState(false);

  const value = Number(cents || "0") / 100;
  const ready = value >= 1 && front && backSide;

  return (
    <div className="flex min-h-screen flex-col bg-white pb-6">
      <header className="flex items-center gap-4 px-4 pt-5 pb-2">
        <button
          type="button"
          aria-label="Back"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
            else router.navigate({ to: "/move-money", replace: true });
          }}
        >
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Deposit check</span>
      </header>

      {done ? (
        <div className="flex flex-1 flex-col px-4">
          <div className="flex flex-col items-center pt-16 text-center">
            <span className="grid size-[72px] place-items-center rounded-full bg-[#fdf0cf]">
              <Check className="size-9 text-[#8a6300]" strokeWidth={3} />
            </span>
            <h1 className="varo-title mt-6 text-[26px] text-black">CHECK SUBMITTED</h1>
            <p className="mt-2 text-[17px] text-black">{usd(value)}</p>
            <p className="mt-4 px-2 text-[15px] leading-[1.4] text-[#6f7075]">
              Most checks are reviewed within 1 business day. We'll let you know when the money is
              available.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/account" })}
            className="mt-auto h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white"
          >
            View activity
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center pt-6">
            <Art name="depositCheck" size={90} />
          </div>
          <p className="varo-title pt-6 text-center text-[46px] leading-none text-black">
            {usd(value)}
          </p>

          <div className="px-4 pt-6">
            <label htmlFor="amt" className="block text-[13px] font-bold text-black">
              Check amount
            </label>
            <input
              id="amt"
              inputMode="numeric"
              value={cents}
              onChange={(e) => setCents(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="Enter amount in cents"
              className="mt-1 h-[52px] w-full rounded-[8px] border border-border px-4 text-[16px] text-black outline-none focus:border-primary"
            />

            {[
              { label: "Front of check", on: front, set: setFront },
              { label: "Back of check", on: backSide, set: setBackSide },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => s.set(!s.on)}
                className={`mt-4 flex h-[92px] w-full items-center gap-3 rounded-[10px] border border-dashed px-4 text-left ${
                  s.on ? "border-primary bg-[#f6f1fe]" : "border-border"
                }`}
              >
                {s.on ? (
                  <Check className="size-6 text-primary" strokeWidth={2.6} />
                ) : (
                  <Camera className="size-6 text-black" strokeWidth={2} />
                )}
                <span>
                  <span className="block text-[16px] text-black">{s.label}</span>
                  <span className="block text-[13px] text-[#6f7075]">
                    {s.on ? "Photo captured" : "Tap to take a photo"}
                  </span>
                </span>
              </button>
            ))}

            <p className="pt-5 text-[12px] leading-[1.35] text-[#6f7075]">
              Endorse the back of your check with your signature and “For mobile deposit at Varo
              Bank”.
            </p>

            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                ledger.addReceived({ name: "Mobile check deposit", amount: value });
                setDone(true);
              }}
              className={`mt-5 h-[52px] w-full rounded-[8px] text-[16px] font-bold ${
                ready ? "bg-primary text-white active:opacity-90" : "bg-[#e3e6ea] text-[#9a9ba0]"
              }`}
            >
              Submit deposit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

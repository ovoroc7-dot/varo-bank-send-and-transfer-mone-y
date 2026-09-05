import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, CalendarDays, RotateCcw, Sparkles, X } from "lucide-react";
import billsHero from "@/assets/varo/bills-hero.png.asset.json";
import detectBills from "@/assets/varo/detect-bills.png.asset.json";

export const Route = createFileRoute("/pay-bills")({
  head: () => ({
    meta: [
      { title: "Pay bills — Varo" },
      {
        name: "description",
        content:
          "Take control of your bills: switch phone, streaming and utility bills to Varo and manage everything in one place.",
      },
      { property: "og:title", content: "Pay bills — Varo" },
      {
        property: "og:description",
        content: "Move your bills to Varo and manage everything in one place.",
      },
    ],
  }),
  component: PayBillsScreen,
});

const perks = [
  { icon: CalendarDays, text: "Track everything in one calendar view" },
  { icon: Sparkles, text: "Cancel subscriptions you don't want" },
  { icon: Bell, text: "Get alerts before bills are paid" },
];

type Step = "intro" | "terms" | "detect" | "plaid";

function PayBillsScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [loading, setLoading] = useState(false);

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-white pb-28">
        <div className="relative">
          <img src={billsHero.url} alt="" aria-hidden className="w-full" />
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label="Back"
            className="absolute top-[10px] left-4 p-2"
          >
            <ArrowLeft className="size-6 text-[#241f21]" strokeWidth={2.2} />
          </button>
        </div>

        <h1 className="varo-title px-4 pt-8 text-[38px] leading-[1.05] tracking-[-0.01em] text-black uppercase">
          Take control of your bills
        </h1>
        <p className="px-4 pt-5 text-[16px] leading-[1.35] text-black">
          From phone to streaming to utilities—easily switch your bills to Varo and manage
          everything in one place.
        </p>

        <div className="mx-4 mt-6 rounded-[10px] bg-[#f1f2f5] px-4 py-5">
          <p className="text-[16px] font-bold text-black">Move 5+ bills to Varo to get full access:</p>
          {perks.map(({ icon: Icon, text }, i) => (
            <div
              key={text}
              className={`flex items-center gap-5 py-5 ${i > 0 ? "border-t border-[#d9dade]" : "pt-5"}`}
            >
              <Icon className="size-6 shrink-0 text-black" strokeWidth={1.7} />
              <span className="text-[15px] text-black">{text}</span>
            </div>
          ))}
        </div>

        <p className="px-4 pt-4 text-[12px] leading-[1.35] text-[#6f7075]">
          To maintain full access to Bill Manager, you must continue to pay 5+ bills with Varo.
        </p>

        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] border-t border-border bg-white px-4 py-4">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setStep("terms");
              }, 900);
            }}
            className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-primary text-[16px] font-bold text-white"
          >
            {loading ? (
              <RotateCcw className="size-6 animate-spin text-white" strokeWidth={2} />
            ) : (
              "Move my bills"
            )}
          </button>
        </div>
      </div>
    );
  }

  const dimmed = step === "terms" || step === "plaid";

  return (
    <div className="relative min-h-screen bg-white">
      <header className="flex items-center justify-between px-4 pt-3 pb-4">
        <button type="button" onClick={() => setStep("intro")} aria-label="Restart">
          <RotateCcw className="size-6 text-black" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          onClick={() => router.history.back()}
          className="varo-title text-[19px] text-black"
        >
          Exit
        </button>
      </header>

      <div className={dimmed ? "brightness-[0.55]" : ""}>
        <div className="flex justify-center pt-8">
          <img src={detectBills.url} alt="" aria-hidden className="w-[157px]" />
        </div>
        <h1 className="varo-title px-4 pt-6 text-center text-[27px] text-black">
          Automatically detect bills
        </h1>
        <p className="px-4 pt-3 text-center text-[15px] leading-[1.35] text-[#3c3d42]">
          Link your bank accounts and credit cards to automatically detect and switch recurring
          bills. Varo Bank uses Pinwheel to safely access other accounts.
        </p>

        {step === "detect" ? (
          <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] bg-white px-4 pb-8">
            <p className="pb-4 text-center text-[13px] leading-[1.4] text-[#3c3d42]">
              By selecting Continue you agree to Pinwheel's{" "}
              <span className="font-bold text-primary underline">Terms of Service</span> &{" "}
              <span className="font-bold text-primary underline">Privacy Policy</span>.
            </p>
            <button
              type="button"
              onClick={() => setStep("plaid")}
              className="h-[52px] w-full rounded-[8px] bg-primary text-[16px] text-white"
            >
              Continue
            </button>
          </div>
        ) : null}
      </div>

      {step === "terms" ? (
        <Sheet onClose={() => setStep("detect")}>
          <h2 className="varo-title px-5 pt-4 text-[23px] text-black">
            Varo Bank Terms &amp; Conditions
          </h2>
          <p className="px-5 pt-4 text-center text-[15px] leading-[1.45] text-[#3c3d42]">
            By clicking “Agree to Terms and Continue”, you're giving Varo permission to obtain and
            use the information in the external financial accounts you link through Plaid as set
            forth in Varo's <span className="font-bold text-primary underline">Terms of Use</span>{" "}
            and <span className="font-bold text-primary underline">Privacy Policy</span>
          </p>
          <div className="px-5 pt-6">
            <button
              type="button"
              onClick={() => setStep("detect")}
              className="h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white"
            >
              Agree to Terms and Continue
            </button>
            <button
              type="button"
              onClick={() => setStep("detect")}
              className="mt-4 w-full text-[16px] font-bold text-primary"
            >
              No thanks
            </button>
          </div>
        </Sheet>
      ) : null}

      {step === "plaid" ? (
        <Sheet onClose={() => setStep("detect")}>
          <div className="flex justify-center pt-2">
            <PlaidMark />
          </div>
          <h2 className="varo-title pt-4 text-center text-[24px] text-black">
            Link accounts via Plaid
          </h2>
          <p className="px-6 pt-3 text-center text-[15px] leading-[1.4] text-[#3c3d42]">
            Link the credit or debit card where you pay your Netflix, Spotify, Verizon, etc.
          </p>
          <div className="px-5 pt-6">
            <button
              type="button"
              onClick={() => setStep("detect")}
              className="h-[52px] w-full rounded-[8px] bg-primary text-[16px] text-white"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => setStep("detect")}
              className="mt-4 w-full text-[16px] font-bold text-primary"
            >
              Add bills manually
            </button>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="flex-1" />
      <div className="relative rounded-t-[18px] bg-white pt-4 pb-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-4 p-2"
        >
          <X className="size-6 text-[#3c3d42]" strokeWidth={2} />
        </button>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}

function PlaidMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-16 text-black" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="5">
        <path d="M32 6 46 20 32 34 18 20z" />
        <path d="M32 30 46 44 32 58 18 44z" />
        <path d="M18 18 32 32 18 46 4 32z" />
        <path d="M46 18 60 32 46 46 32 32z" />
      </g>
    </svg>
  );
}

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Info, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/direct-deposit")({
  head: () => ({
    meta: [
      { title: "Switch your direct deposit — Varo" },
      {
        name: "description",
        content:
          "Connect your payroll account and switch your direct deposit to Varo Bank in a few taps — secure, encrypted and automatic.",
      },
      { property: "og:title", content: "Switch your direct deposit — Varo" },
      {
        property: "og:description",
        content: "Secure and automatic direct deposit switching, no forms or manual work required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DirectDepositScreen,
});

function DirectDepositScreen() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "looking" | "employers">("intro");

  useEffect(() => {
    if (step !== "looking") return;
    const t = setTimeout(() => setStep("employers"), 2600);
    return () => clearTimeout(t);
  }, [step]);

  const exit = () => router.navigate({ to: "/move-money" });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        {step === "intro" ? (
          <button type="button" aria-label="About" className="text-black">
            <Info className="size-5" strokeWidth={2.2} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep("intro")}
            className="flex items-center gap-1 text-[15px] text-black"
          >
            <ChevronLeft className="size-5" strokeWidth={2.4} /> Back
          </button>
        )}
        <button type="button" onClick={exit} className="text-[15px] text-black">
          Exit
        </button>
      </header>

      {step === "intro" ? (
        <div className="flex flex-1 flex-col px-6 pt-14 pb-6">
          <span className="mx-auto grid size-[44px] place-items-center rounded-[10px] border border-border">
            <Sparkles className="size-6 text-[#2f7cf6]" strokeWidth={2.2} />
          </span>
          <h1 className="pt-5 text-center text-[22px] font-bold text-black">
            Switch your direct deposit
          </h1>
          <p className="pt-2 text-center text-[13px] leading-[1.4] text-[#6f7075]">
            Let Varo Bank connect to your payroll account using Pinwheel
          </p>

          <ul className="pt-8 space-y-5">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-[2px] size-5 shrink-0 text-primary" strokeWidth={2.2} />
              <span>
                <span className="block text-[16px] font-bold text-black">Secure &amp; Encrypted</span>
                <span className="block text-[13px] text-[#6f7075]">
                  Your information is protected at all times
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="mt-[2px] size-5 shrink-0 text-primary" strokeWidth={2.2} />
              <span>
                <span className="block text-[16px] font-bold text-black">Fast &amp; automatic</span>
                <span className="block text-[13px] text-[#6f7075]">
                  No forms or manual work required
                </span>
              </span>
            </li>
          </ul>

          <p className="mt-auto text-center text-[12px] leading-[1.4] text-[#6f7075]">
            By selecting “Get started” you agree to Pinwheel’s{" "}
            <span className="font-bold text-primary underline">Terms of Service</span> &amp;{" "}
            <span className="font-bold text-primary underline">Privacy Policy</span>.
          </p>
          <button
            type="button"
            onClick={() => setStep("looking")}
            className="mt-4 h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white active:opacity-90"
          >
            Get started
          </button>
        </div>
      ) : step === "looking" ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span
            className="size-[54px] animate-spin rounded-full border-[5px] border-[#ece4fb] border-t-primary"
            aria-hidden
          />
          <p className="pt-6 text-[19px] font-bold text-black">Looking up your payroll account</p>
          <p className="pt-2 text-[14px] text-[#6f7075]">This should take less than 10 seconds.</p>
        </div>
      ) : (
        <div className="flex-1 px-4 pt-6 pb-8">
          <h1 className="text-[22px] font-bold text-black">Select your employer</h1>
          <p className="pt-2 text-[14px] text-[#6f7075]">
            We found these payroll providers linked to your details.
          </p>
          <ul className="pt-4">
            {["ADP", "Workday", "Paychex Flex", "Gusto", "QuickBooks Payroll"].map((e) => (
              <li key={e}>
                <button
                  type="button"
                  onClick={exit}
                  className="flex w-full items-center justify-between border-b border-border py-4 text-left"
                >
                  <span className="text-[16px] text-black">{e}</span>
                  <span className="text-[14px] font-bold text-primary">Select</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

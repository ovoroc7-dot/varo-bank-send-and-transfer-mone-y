import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Copy, Mail, MessageSquare, X } from "lucide-react";
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

const CARD = {
  name: "Joann Juckett",
  number: "4147 2033 8891 3046",
  expiry: "08/29",
  cvv: "417",
};

type Step = "closed" | "method" | "code" | "revealed";

function VaroCardsScreen() {
  const [frozen, setFrozen] = useState(false);
  const [step, setStep] = useState<Step>("closed");
  const [method, setMethod] = useState<"Email" | "Text message">("Email");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const close = () => {
    setStep("closed");
    setCode("");
    setError("");
    setCopied(null);
  };

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

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
        onClick={() => setStep("method")}
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

      {step !== "closed" ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-[430px]">
          <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 bg-black/30" />

          {step === "method" ? (
            <div className="absolute inset-x-0 bottom-0 rounded-t-[18px] bg-white px-4 pt-5 pb-10">
              <div className="flex justify-end">
                <button type="button" aria-label="Close" onClick={close}>
                  <X className="size-6 text-black" strokeWidth={2.2} />
                </button>
              </div>
              <h2 className="mt-2 text-[26px] font-bold text-black">Confirm your identity</h2>
              <p className="mt-3 text-[15px] leading-[1.45] text-black">
                It's for your security. Let us know if you prefer an email or text.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMethod("Email");
                  setStep("code");
                }}
                className="mt-6 flex w-full items-center gap-4 border-b border-border py-4"
              >
                <Mail className="size-6 text-black" strokeWidth={1.8} />
                <span className="flex-1 text-left text-[17px] text-black">Email</span>
                <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("Text message");
                  setStep("code");
                }}
                className="flex w-full items-center gap-4 py-4"
              >
                <MessageSquare className="size-6 text-black" strokeWidth={1.8} />
                <span className="flex-1 text-left text-[17px] text-black">Text message</span>
                <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
              </button>
            </div>
          ) : null}

          {step === "code" ? (
            <div className="absolute inset-0 bg-white px-4 pt-5 pb-10">
              <div className="flex justify-end">
                <button type="button" aria-label="Close" onClick={close}>
                  <X className="size-6 text-black" strokeWidth={2.2} />
                </button>
              </div>
              <h2 className="mt-2 text-[26px] font-bold text-black">Enter your code</h2>
              <p className="mt-3 text-[15px] leading-[1.45] text-black">
                We sent a 6-digit verification code by {method === "Email" ? "email" : "text message"}.
                Enter it below to see your card details.
              </p>
              <input
                inputMode="numeric"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                placeholder="000000"
                aria-label="Verification code"
                className="mt-8 w-full border-b border-black pb-3 text-center text-[30px] tracking-[0.35em] text-black outline-none placeholder:text-[#c3c4c8]"
              />
              {error ? <p className="mt-3 text-[13px] text-[#c0392b]">{error}</p> : null}
              <button
                type="button"
                onClick={() => {
                  if (code.length !== 6) {
                    setError("Enter the 6-digit code we sent you.");
                    return;
                  }
                  setStep("revealed");
                }}
                className="mt-8 w-full rounded-[8px] bg-primary py-4 text-[17px] font-bold text-white"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => setStep("method")}
                className="mt-4 w-full py-2 text-[15px] font-bold text-primary"
              >
                Send a new code
              </button>
            </div>
          ) : null}

          {step === "revealed" ? (
            <div className="absolute inset-0 overflow-y-auto bg-white px-4 pt-5 pb-10">
              <div className="flex justify-end">
                <button type="button" aria-label="Close" onClick={close}>
                  <X className="size-6 text-black" strokeWidth={2.2} />
                </button>
              </div>
              <h2 className="mt-2 text-[26px] font-bold text-black">Your card details</h2>
              <p className="mt-3 text-[15px] leading-[1.45] text-[#5f6065]">
                Keep these details private. They'll hide when you close this screen.
              </p>

              <div className="mt-6 rounded-[12px] bg-primary p-5">
                <p className="varo-wordmark text-[26px] leading-none text-white">Varo</p>
                <p className="mt-6 text-[22px] tracking-[0.08em] text-white">{CARD.number}</p>
                <div className="mt-6 flex items-end justify-between">
                  <div className="text-white">
                    <p className="text-[11px] uppercase opacity-80">Cardholder</p>
                    <p className="text-[14px]">{CARD.name}</p>
                  </div>
                  <p className="text-right text-white">
                    <span className="block text-[11px] leading-none">DEBIT</span>
                    <span className="block text-[19px] leading-tight font-bold italic">VISA</span>
                  </p>
                </div>
              </div>

              <DetailRow label="Card number" value={CARD.number} copied={copied} onCopy={copy} />
              <DetailRow label="Expiration date" value={CARD.expiry} copied={copied} onCopy={copy} />
              <DetailRow label="Security code (CVV)" value={CARD.cvv} copied={copied} onCopy={copy} />

              <button
                type="button"
                onClick={close}
                className="mt-8 w-full rounded-[8px] bg-primary py-4 text-[17px] font-bold text-white"
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: string | null;
  onCopy: (label: string, value: string) => void;
}) {
  return (
    <div className="flex items-center border-b border-border py-4">
      <div className="flex-1">
        <p className="text-[12px] text-[#5f6065]">{label}</p>
        <p className="text-[17px] text-black">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        onClick={() => onCopy(label, value)}
        className="flex items-center gap-1 text-[13px] font-bold text-primary"
      >
        {copied === label ? (
          <>
            <Check className="size-[18px]" strokeWidth={2.4} /> Copied
          </>
        ) : (
          <>
            <Copy className="size-[18px]" strokeWidth={2} /> Copy
          </>
        )}
      </button>
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

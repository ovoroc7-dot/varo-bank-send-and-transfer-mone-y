import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";

export const Route = createFileRoute("/zelle")({
  head: () => ({
    meta: [
      { title: "Zelle® eligibility — Varo" },
      {
        name: "description",
        content:
          "See the requirements your Varo account needs to meet before you can send and receive money fast with Zelle®.",
      },
      { property: "og:title", content: "Zelle® eligibility — Varo" },
      {
        property: "og:description",
        content: "60+ days of account activity and $1,000+ in settled deposits are required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ZelleScreen,
});

const checks = [
  { label: "60+ days of account activity", met: true },
  { label: "$1000+ in settled deposits within the last 61+ days", met: false },
];

function ZelleScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white px-4 pt-5 pb-6">
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

      <p className="varo-title pt-14 text-center text-[52px] leading-none text-primary">Zelle®</p>

      <h1 className="pt-12 text-[26px] leading-[1.15] font-bold text-black">
        Your account isn't eligible for Zelle® yet
      </h1>
      <p className="pt-4 text-[15px] leading-[1.4] text-black">
        To use Zelle®, your account needs to meet these minimum requirements:
      </p>

      <ul className="pt-5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-3 py-3">
            <span
              className={`mt-[1px] grid size-[24px] shrink-0 place-items-center rounded-full ${
                c.met ? "bg-[#0f8a5f]" : "bg-[#c9ccd1]"
              }`}
            >
              {c.met ? (
                <Check className="size-[15px] text-white" strokeWidth={3} />
              ) : (
                <X className="size-[15px] text-white" strokeWidth={3} />
              )}
            </span>
            <span className="text-[15px] leading-[1.35] text-black">{c.label}</span>
          </li>
        ))}
      </ul>

      <p className="pt-4 text-[13px] leading-[1.4] text-[#6f7075]">
        Eligibility is at the discretion of Varo and may change at any time.
      </p>

      <button
        type="button"
        onClick={() => router.navigate({ to: "/direct-deposit" })}
        className="mt-auto h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white active:opacity-90"
      >
        Manage direct deposit
      </button>
    </div>
  );
}

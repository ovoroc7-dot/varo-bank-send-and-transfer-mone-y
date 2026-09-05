import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";

export const Route = createFileRoute("/fund-apps")({
  head: () => ({
    meta: [
      { title: "Fund from other apps — Varo" },
      {
        name: "description",
        content:
          "Use Venmo, PayPal or Apple Cash to fund your Varo account with your debit card or account and routing number.",
      },
      { property: "og:title", content: "Fund from other apps — Varo" },
      {
        property: "og:description",
        content: "Fund your Varo account instantly from Venmo, PayPal or Apple Cash.",
      },
    ],
  }),
  component: FundAppsScreen,
});

function FundAppsScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="px-4 pt-5 pb-6">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) router.history.back();
            else router.navigate({ to: "/", replace: true });
          }}
          aria-label="Back"
        >
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
      </header>

      <h1 className="px-4 text-[26px] leading-[1.2] font-bold text-black">
        Fund your Varo account instantly from other apps
      </h1>
      <p className="mt-4 px-4 text-[16px] leading-[1.45] text-black">
        You can use apps like Venmo®, PayPal®, or Apple Cash® to fund your account. Use your Varo
        debit card or account and routing number.
      </p>

      <div className="mx-auto mt-6 flex h-[400px] w-[250px] flex-col justify-between rounded-[14px] bg-primary p-5">
        <p className="varo-wordmark text-[34px] leading-none text-white">Varo</p>
        <div className="flex items-end justify-between">
          <p className="text-[14px] leading-[1.25] text-white">
            Joann
            <br />
            Juckett
          </p>
          <p className="text-right text-white">
            <span className="block text-[12px] leading-none">DEBIT</span>
            <span className="block text-[21px] leading-tight font-bold italic">VISA</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mx-4 mt-6 block w-[calc(100%-2rem)] rounded-[8px] border border-primary py-4 text-[15px] font-bold text-primary"
      >
        View card number
      </button>

      <NumberRow label="Routing number" value="124303201" />
      <NumberRow label="Account number" value="51763046" />
    </div>
  );
}

function NumberRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mx-4 flex items-center border-b border-border py-4">
      <div className="flex-1">
        <p className="text-[13px] text-[#5f6065]">{label}</p>
        <p className="text-[17px] text-black">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        onClick={() => navigator.clipboard?.writeText(value)}
      >
        <Copy className="size-5 text-black" strokeWidth={1.8} />
      </button>
    </div>
  );
}

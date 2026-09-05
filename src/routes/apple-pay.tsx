import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/apple-pay")({
  head: () => ({
    meta: [
      { title: "Apple Pay funding — Varo" },
      {
        name: "description",
        content:
          "Add money to your Varo account instantly with Apple Pay. A Visa or Mastercard debit card in your Apple Wallet is required.",
      },
      { property: "og:title", content: "Apple Pay funding — Varo" },
      {
        property: "og:description",
        content: "Fund your Varo account instantly with a debit card in your Apple Wallet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ApplePayScreen,
});

function ApplePayScreen() {
  const router = useRouter();
  const close = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to: "/move-money", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-4 pt-5 pb-6">
      <button type="button" aria-label="Back" onClick={close}>
        <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
      </button>

      <h1 className="pt-8 text-[28px] leading-[1.15] font-bold text-black">
        Apple Pay needs a debit card
      </h1>
      <p className="pt-4 text-[15px] leading-[1.4] text-black">
        Add a Visa or Mastercard debit card to your Apple Wallet to use Apple Pay for funding.
      </p>

      <button
        type="button"
        onClick={close}
        className="mt-auto h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white active:opacity-90"
      >
        Close
      </button>
    </div>
  );
}

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import feesIcon from "@/assets/varo/fees-icon.png.asset.json";
import dollarIcon from "@/assets/varo/dollar-icon.png.asset.json";
import logos from "@/assets/varo/addcash-logos.png.asset.json";

export const Route = createFileRoute("/add-cash")({
  head: () => ({
    meta: [
      { title: "Add cash — Varo" },
      {
        name: "description",
        content:
          "Add cash to your Varo account at 90,000+ locations including CVS, 7-Eleven, Kroger and Walgreens.",
      },
      { property: "og:title", content: "Add cash — Varo" },
      {
        property: "og:description",
        content: "Add cash at 90,000+ retail locations with your barcode or Varo Debit Card.",
      },
    ],
  }),
  component: AddCashScreen,
});

function AddCashScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-28">
      <header className="flex items-center gap-4 px-4 pt-5 pb-8">
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
        <span className="flex-1 text-[17px] font-bold text-black">Add cash</span>
        <button type="button" className="text-[15px] font-bold text-primary">
          FAQ
        </button>
      </header>

      <h1 className="varo-title px-4 text-center text-[34px] leading-[1.08] text-black">
        ADD CASH AT 90,000+ LOCATIONS
      </h1>
      <p className="mx-auto mt-6 max-w-[370px] px-4 text-center text-[16px] leading-[1.4] text-black">
        Ask the cashier to scan your barcode¹ or swipe your Varo Debit Card.
      </p>

      <div className="mx-4 mt-8 flex gap-4 border-b border-border pb-5">
        <img src={feesIcon.url} alt="" className="size-[62px] shrink-0" />
        <div>
          <p className="text-[16px] leading-[1.35] text-black">
            Enjoy fee-free options at 7,500 CVS® and Kroger® locations²
          </p>
          <p className="mt-1 text-[13px] text-[#5f6065]">Add up to $1,500 daily.</p>
        </div>
      </div>

      <div className="mx-4 mt-5 flex gap-4 border-b border-border pb-5">
        <img src={dollarIcon.url} alt="" className="size-[62px] shrink-0" />
        <div>
          <p className="text-[16px] leading-[1.35] text-black">
            Or add cash for a fee at other participating retailers
          </p>
          <p className="mt-1 text-[13px] text-[#5f6065]">
            Retail service fee up to $4.95 and limits may apply.
          </p>
        </div>
      </div>

      <img src={logos.url} alt="CVS, 7-Eleven, Kroger and Walgreens" className="mt-6 w-full px-2" />

      <div className="mt-6 space-y-3 px-4 text-[12.5px] leading-[1.45] text-[#3d3e42]">
        <p>¹Availability to add cash with barcode varies by location.</p>
        <p>
          ²Available at all stand-alone CVS location with a cashier in the US, except for locations
          on military bases, within hospitals, or inside Target. Adding cash via barcode is free at
          the Kroger Family of Stores (excluding Harris Teeter stores) from 7/22/26 until 9/22/26. A
          retail service fee of up to $4.95 may be charged for adding cash with card swipe, and
          after 9/22/26, a retail service fee of up to $4.95 may be charged for all cash adds at the
          Kroger Family of Stores. Transaction amounts must be between $20 and $500. Limits and a
          retail service fee of up to $4.95 may apply when adding cash at other retail locations.
          ©Copyright 2026 <span className="font-bold text-primary underline">CVS.com.</span>
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] bg-white px-4 pt-3 pb-6">
        <button
          type="button"
          className="w-full rounded-[8px] bg-primary py-4 text-[16px] font-bold text-white"
        >
          Show locations
        </button>
      </div>
    </div>
  );
}

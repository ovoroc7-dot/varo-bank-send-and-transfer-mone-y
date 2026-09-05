import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Fuel, ShoppingBasket, UtensilsCrossed, ShoppingBag, Store } from "lucide-react";
import { PageHeader } from "@/components/varo/nav";
import { Chevron } from "@/components/varo/ui";
import { Art, type ArtKey } from "@/components/varo/icon";

export const Route = createFileRoute("/cashback")({
  head: () => ({
    meta: [
      { title: "Cashback — Varo offers near you" },
      {
        name: "description",
        content:
          "Track lifetime cashback earnings and activate offers from Papa Johns, Sonic and national brands near you.",
      },
      { property: "og:title", content: "Cashback — Varo offers near you" },
      {
        property: "og:description",
        content: "Activate local offers and earn cashback on gas, grocery, food and shopping.",
      },
    ],
  }),
  component: CashbackScreen,
});

const offers: { art: ArtKey; name: string; back: string; distance: string }[] = [
  { art: "papaJohns", name: "Papa Johns", back: "14% back", distance: "0.9 mi" },
  { art: "sonic", name: "Sonic", back: "16% back", distance: "1.1 mi" },
];

const categories = [
  { label: "Gas", icon: Fuel },
  { label: "Grocery", icon: ShoppingBasket },
  { label: "Food", icon: UtensilsCrossed },
  { label: "Shopping", icon: ShoppingBag },
];

function CashbackScreen() {
  return (
    <div className="pb-6">
      <PageHeader title="Cashback" />

      <div className="mx-4 flex items-center gap-4 rounded-[8px] bg-card px-4 py-5">
        <Art name="gasCar" size={58} />
        <p className="flex-1 text-[16px] leading-[1.35] text-black">
          A 25¢/gal bonus is included on your next redeemed gas offer.
          <button type="button" className="mt-2 block text-[16px] font-medium text-primary">
            Learn more
          </button>
        </p>
      </div>

      <button
        type="button"
        className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center rounded-[8px] bg-card px-4 py-5 text-left"
      >
        <span className="flex-1">
          <span className="block text-[16px] text-black">My cashback</span>
          <span className="block text-[34px] leading-[1.15] font-bold text-black">$0.00</span>
          <span className="block text-[14px] text-[#5f6065]">Lifetime earnings</span>
        </span>
        <Chevron />
      </button>

      <button
        type="button"
        className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center gap-4 rounded-[8px] bg-card px-4 py-4 text-left"
      >
        <span className="grid size-[42px] place-items-center rounded-[6px] bg-[#eceef1]">
          <Store className="size-6 text-black" strokeWidth={1.9} />
        </span>
        <span className="flex-1">
          <span className="block text-[17px] text-black">My offers</span>
          <span className="block text-[14px] text-[#5f6065]">0 activated</span>
        </span>
        <Chevron />
      </button>

      <h2 className="px-4 pt-8 pb-4 text-[19px] font-bold text-black">Top Offers for you</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {offers.map((o) => (
          <article key={o.name} className="w-[168px] shrink-0 rounded-[8px] bg-card p-4">
            <div className="flex items-start justify-between">
              <Art name={o.art} size={0} className="!h-auto !w-[60px]" />
              <span className="rounded-[6px] bg-[#eceef1] px-2 py-0.5 text-[13px] text-black">
                {o.distance}
              </span>
            </div>
            <p className="mt-5 text-center text-[17px] font-bold text-black">{o.name}</p>
            <p className="mt-1 text-center text-[15px] text-black">{o.back}</p>
            <button
              type="button"
              className="mx-auto mt-4 block rounded-[8px] border border-primary px-5 py-2 text-[15px] font-bold text-primary"
            >
              Activate
            </button>
          </article>
        ))}
      </div>

      <button type="button" className="flex w-full items-center px-4 pt-10 pb-4 text-left">
        <span className="flex-1 text-[19px] font-bold text-black">Offers near you</span>
        <Chevron />
      </button>
      <div className="mx-4 h-[220px] rounded-[2px] bg-[#f6efe9] [background-image:linear-gradient(to_right,#e5ded6_1px,transparent_1px),linear-gradient(to_bottom,#e5ded6_1px,transparent_1px)] [background-size:76px_76px]" />

      <button type="button" className="flex w-full items-center px-4 pt-8 pb-4 text-left">
        <span className="flex-1 text-[19px] font-bold text-black">National Brands for you</span>

        <Chevron />
      </button>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        <div className="flex h-[110px] w-[240px] shrink-0 items-end rounded-[4px] bg-gradient-to-b from-[#e6e6e6] to-[#8f8f8f] p-3">
          <span className="text-[15px] text-white">$49.60 cashback at AT&amp;T Fiber</span>
        </div>
        <div className="h-[110px] w-[240px] shrink-0 rounded-[4px] bg-gradient-to-b from-[#e6e6e6] to-[#8f8f8f]" />
      </div>

      <h2 className="px-4 pt-8 pb-4 text-[19px] font-bold text-black">Categories</h2>
      <div className="mx-4 grid grid-cols-2 gap-3">
        {categories.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="rounded-[8px] bg-card p-4 text-left"
          >
            <Icon className="size-6 text-black" strokeWidth={1.8} />
            <span className="mt-4 block text-[15px] text-black">{label}</span>
          </button>
        ))}
        <button type="button" className="rounded-[8px] bg-card p-4 text-left">
          <ArrowRight className="size-6 text-black" strokeWidth={1.8} />
          <span className="mt-4 block text-[15px] text-black">View all categories</span>
        </button>
      </div>
    </div>
  );
}

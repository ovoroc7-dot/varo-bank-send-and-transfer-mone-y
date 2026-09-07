import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Clock, MapPin, Navigation, Phone, Search, X } from "lucide-react";

export const Route = createFileRoute("/find-atm")({
  head: () => ({
    meta: [
      { title: "Find an ATM — Varo" },
      {
        name: "description",
        content:
          "Find fee-free Allpoint ATMs near you to withdraw cash from your Varo Bank Account, with addresses and distances.",
      },
      { property: "og:title", content: "Find an ATM — Varo" },
      {
        property: "og:description",
        content: "Search 55,000+ fee-free Allpoint ATMs near you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FindAtmScreen,
});

type Atm = {
  name: string;
  address: string;
  miles: number;
  hours: string;
  feeFree: boolean;
  deposit: boolean;
};

const atms: Atm[] = [
  { name: "Allpoint ATM — CVS Pharmacy", address: "1450 Blanding Blvd, Middleburg, FL", miles: 0.4, hours: "Open 24 hours", feeFree: true, deposit: true },
  { name: "Allpoint ATM — Target", address: "1751 Wells Rd, Orange Park, FL", miles: 1.2, hours: "8:00 AM – 10:00 PM", feeFree: true, deposit: false },
  { name: "Allpoint ATM — Walgreens", address: "2300 Kingsley Ave, Orange Park, FL", miles: 2.1, hours: "Open 24 hours", feeFree: true, deposit: true },
  { name: "Allpoint ATM — Winn-Dixie", address: "3535 US-17, Fleming Island, FL", miles: 3.6, hours: "7:00 AM – 11:00 PM", feeFree: true, deposit: false },
  { name: "Allpoint ATM — Speedway", address: "890 Park Ave, Orange Park, FL", miles: 4.8, hours: "Open 24 hours", feeFree: true, deposit: true },
];

function FindAtmScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Atm | null>(null);
  const term = q.trim().toLowerCase();
  const list = term
    ? atms.filter(
        (a) => a.name.toLowerCase().includes(term) || a.address.toLowerCase().includes(term),
      )
    : atms;

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="flex items-center gap-4 px-4 pt-5 pb-2">
        <button
          type="button"
          aria-label="Back"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
            else router.navigate({ to: "/", replace: true });
          }}
        >
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Find an ATM</span>
      </header>

      <div className="px-4 pt-3">
        <span className="relative block">
          <Search
            className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#6f7075]"
            strokeWidth={2.2}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search city, ZIP or place"
            aria-label="Search ATMs"
            className="h-[52px] w-full rounded-[8px] border border-border pr-4 pl-11 text-[16px] text-black outline-none focus:border-primary"
          />
        </span>
      </div>

      <div className="mx-4 mt-4 flex h-[150px] flex-col items-center justify-center gap-1 rounded-[12px] bg-[#eef4f2]">
        <span className="flex items-center gap-2 text-[14px] font-bold text-[#24473d]">
          <Navigation className="size-4" strokeWidth={2.2} /> 55,000+ fee-free Allpoint ATMs
        </span>
        <span className="text-[12px] text-[#4b5c57]">No ATM fee when you stay in network</span>
      </div>

      <p className="px-4 pt-6 pb-1 text-[13px] font-bold tracking-[0.06em] text-[#6f7075] uppercase">
        Nearby
      </p>
      <ul className="px-4">
        {list.map((a) => (
          <li key={a.name} className="border-b border-border">
            <button type="button" onClick={() => setSelected(a)} className="flex w-full items-start gap-3 py-4 text-left">
              <span className="mt-[2px] grid size-[34px] shrink-0 place-items-center rounded-full bg-[#ece4fb]">
                <MapPin className="size-[18px] text-primary" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] text-black">{a.name}</span>
                <span className="block truncate text-[14px] text-[#6f7075]">{a.address}</span>
                <span className="mt-1 flex items-center gap-1 text-[12px] font-bold text-[#1d7a4f]">
                  <BadgeCheck className="size-[14px]" strokeWidth={2.2} /> Fee-free
                </span>
              </span>
              <span className="text-[14px] font-bold text-black">{a.miles} mi</span>
            </button>
          </li>
        ))}
        {list.length === 0 ? (
          <li className="py-10 text-center text-[15px] text-[#6f7075]">No ATMs match that search.</li>
        ) : null}
      </ul>

      <p className="mx-4 mt-6 text-[11px] leading-[1.45] text-[#6f7075]">
        Out-of-network ATMs may charge a fee. Varo charges $3.00 per withdrawal at non-Allpoint
        ATMs, plus any fee the ATM owner charges.
      </p>

      {selected ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-[430px]">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-black/30"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[18px] bg-white px-4 pt-5 pb-10">
            <div className="flex justify-end">
              <button type="button" aria-label="Close" onClick={() => setSelected(null)}>
                <X className="size-6 text-black" strokeWidth={2.2} />
              </button>
            </div>
            <h2 className="mt-2 text-[22px] font-bold text-black">{selected.name}</h2>
            <p className="mt-1 text-[15px] text-[#6f7075]">{selected.address}</p>

            <div className="mt-5 space-y-3">
              <p className="flex items-center gap-3 text-[15px] text-black">
                <Navigation className="size-5 text-[#6f7075]" strokeWidth={2} /> {selected.miles} miles away
              </p>
              <p className="flex items-center gap-3 text-[15px] text-black">
                <Clock className="size-5 text-[#6f7075]" strokeWidth={2} /> {selected.hours}
              </p>
              <p className="flex items-center gap-3 text-[15px] font-bold text-[#1d7a4f]">
                <BadgeCheck className="size-5" strokeWidth={2.2} /> Fee-free cash withdrawals
              </p>
              {selected.deposit ? (
                <p className="flex items-center gap-3 text-[15px] text-black">
                  <MapPin className="size-5 text-[#6f7075]" strokeWidth={2} /> Accepts cash deposits
                </p>
              ) : null}
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-[8px] bg-primary py-4 text-[17px] font-bold text-white"
            >
              Get directions
            </button>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-[15px] font-bold text-primary"
            >
              <Phone className="size-[18px]" strokeWidth={2} /> Report an ATM issue
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

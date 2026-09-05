import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Navigation, Search } from "lucide-react";

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

const atms = [
  { name: "Allpoint ATM — CVS Pharmacy", address: "1450 Blanding Blvd, Middleburg, FL", miles: 0.4 },
  { name: "Allpoint ATM — Target", address: "1751 Wells Rd, Orange Park, FL", miles: 1.2 },
  { name: "Allpoint ATM — Walgreens", address: "2300 Kingsley Ave, Orange Park, FL", miles: 2.1 },
  { name: "Allpoint ATM — Winn-Dixie", address: "3535 US-17, Fleming Island, FL", miles: 3.6 },
  { name: "Allpoint ATM — Speedway", address: "890 Park Ave, Orange Park, FL", miles: 4.8 },
];

function FindAtmScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const list = term
    ? atms.filter(
        (a) =>
          a.name.toLowerCase().includes(term) || a.address.toLowerCase().includes(term),
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
            else router.navigate({ to: "/move-money", replace: true });
          }}
        >
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Find ATM</span>
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

      <div className="mx-4 mt-4 flex h-[150px] items-center justify-center rounded-[12px] bg-[#eef4f2]">
        <span className="flex items-center gap-2 text-[14px] text-[#4b5c57]">
          <Navigation className="size-4" strokeWidth={2.2} /> 55,000+ fee-free Allpoint ATMs
        </span>
      </div>

      <p className="px-4 pt-6 pb-1 text-[13px] font-bold tracking-[0.06em] text-[#6f7075] uppercase">
        Nearby
      </p>
      <ul className="px-4">
        {list.map((a) => (
          <li
            key={a.name}
            className="flex items-start gap-3 border-b border-border py-4"
          >
            <span className="mt-[2px] grid size-[34px] shrink-0 place-items-center rounded-full bg-[#ece4fb]">
              <MapPin className="size-[18px] text-primary" strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] text-black">{a.name}</span>
              <span className="block truncate text-[14px] text-[#6f7075]">{a.address}</span>
            </span>
            <span className="text-[14px] font-bold text-black">{a.miles} mi</span>
          </li>
        ))}
        {list.length === 0 ? (
          <li className="py-10 text-center text-[15px] text-[#6f7075]">No ATMs match that search.</li>
        ) : null}
      </ul>
    </div>
  );
}

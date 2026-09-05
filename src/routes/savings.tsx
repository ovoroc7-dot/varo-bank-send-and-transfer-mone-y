import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Settings, ChevronRight } from "lucide-react";
import coins from "@/assets/varo/coins.png.asset.json";
import piggy from "@/assets/varo/piggy.png.asset.json";

export const Route = createFileRoute("/savings")({
  head: () => ({
    meta: [
      { title: "Varo Savings Account — Balance & APY" },
      {
        name: "description",
        content:
          "See your Varo Savings Account balance, interest earned, current APY and Auto Saving settings.",
      },
      { property: "og:title", content: "Varo Savings Account — Balance & APY" },
      {
        property: "og:description",
        content:
          "See your Varo Savings Account balance, interest earned, current APY and Auto Saving settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SavingsScreen,
});

function SavingsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center gap-4 px-4 pt-4 pb-3">
        <button type="button" aria-label="Back" onClick={() => navigate({ to: "/" })}>
          <ArrowLeft className="size-[26px] text-black" strokeWidth={2.6} />
        </button>
        <h1 className="flex-1 text-[20px] font-bold text-black">Varo Savings Account</h1>
        <button type="button" aria-label="Savings settings">
          <Settings className="size-[26px] text-black" strokeWidth={1.9} />
        </button>
      </header>

      <section className="px-4 pt-6">
        <p className="text-center text-[16px] font-bold text-black">Available balance</p>
        <p className="varo-title mt-2 text-center text-[40px] leading-none text-black">$0.00</p>

        <div className="mt-8">
          <Row label="Interest earned">
            <span className="text-[17px] text-[#177d4e]">+$0.00</span>
          </Row>
          <div className="h-px bg-[#e2e3e6]" />
          <Row label="Current APY">
            <span className="text-[17px] text-black">1.00%</span>
          </Row>
          <div className="h-px bg-[#e2e3e6]" />
          <Row label="Auto Saving">
            <span className="rounded-[5px] bg-[#c0341f] px-2 py-0.5 text-[15px] font-bold text-white">
              Off
            </span>
          </Row>
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/transfer" })}
          className="mt-5 h-[54px] w-full rounded-[8px] bg-primary text-[17px] font-bold text-white"
        >
          Add money
        </button>
      </section>

      <section className="px-4 pt-6 pb-6">
        <article className="flex items-stretch overflow-hidden rounded-[8px] border border-[#e2e3e6]">
          <div className="flex-1 p-4">
            <p className="text-[18px] leading-[1.25] font-bold text-black">
              Earn 3.75% APY on up to $5,000.00
            </p>
            <p className="mt-2 text-[16px] text-black">Check progress to qualify.</p>
            <button
              type="button"
              className="mt-4 rounded-[8px] border border-primary px-4 py-2.5 text-[15px] font-bold text-primary"
            >
              See progress
            </button>
          </div>
          <div className="grid w-[110px] shrink-0 place-items-center bg-[#e9e2fb]">
            <img src={piggy.url} alt="Piggy bank" className="w-[104px] max-w-none" />
          </div>
        </article>
      </section>

      <div className="h-2 bg-[#f1f4f8]" />

      <section className="px-4 pt-5 pb-16">
        <h2 className="text-[16px] font-bold text-black">Recent transactions</h2>
        <div className="flex flex-col items-center pt-16 pb-10">
          <img src={coins.url} alt="Stack of coins" className="w-[130px]" />
          <p className="mt-10 text-[17px] text-[#6f7075]">Your activity will be shown here</p>
        </div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button type="button" className="flex w-full items-center gap-3 py-4 text-left">
      <span className="flex-1 text-[17px] text-black">{label}</span>
      {children}
      <ChevronRight className="size-5 text-black" strokeWidth={2.4} />
    </button>
  );
}

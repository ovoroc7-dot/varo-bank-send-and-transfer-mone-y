import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/varo/nav";
import { Chevron, Divider, LimeBadge } from "@/components/varo/ui";
import { Art, type ArtKey } from "@/components/varo/icon";

export const Route = createFileRoute("/move-money")({
  head: () => ({
    meta: [
      { title: "Move Money — Varo" },
      {
        name: "description",
        content:
          "Transfer between accounts, send money instantly with Zelle, deposit checks, add cash or set up direct deposit.",
      },
      { property: "og:title", content: "Move Money — Varo" },
      {
        property: "og:description",
        content: "Transfers, Zelle, Apple Pay, direct deposit and cash deposits in one place.",
      },
    ],
  }),
  component: MoveMoneyScreen,
});

type MoveTo =
  | "/transfer"
  | "/pay-bills"
  | "/send-money"
  | "/apple-pay"
  | "/fund-instantly"
  | "/zelle"
  | "/deposit-check"
  | "/direct-deposit"
  | "/add-cash"
  | "/find-atm"
  | "/account";

const primary: {
  art: ArtKey;
  title: string;
  subtitle: string;
  badge?: string;
  to: MoveTo;
}[] = [
  {
    art: "transfer",
    title: "Transfer",
    subtitle: "Move money between your accounts",
    to: "/transfer",
  },
  {
    art: "varoAnyone",
    title: "Varo to Anyone",
    subtitle: "Send money to anyone instantly",
    to: "/send-money",
  },
  {
    art: "applePay",
    title: "Apple Pay",
    subtitle: "Add money instantly",
    badge: "✦ New",
    to: "/apple-pay",
  },
  {
    art: "fundInstantly",
    title: "Fund instantly",
    subtitle: "Add money to your account from a debit card",
    badge: "⚡ Instant",
    to: "/fund-instantly",
  },
  { art: "manageBills", title: "Manage bills", subtitle: "View and pay bills", to: "/pay-bills" },
  {
    art: "zelle",
    title: "Zelle®",
    subtitle: "Send and receive money fast with Zelle®",
    to: "/zelle",
  },
];

const more: { art: ArtKey; title: string; to: MoveTo }[] = [
  { art: "depositCheck", title: "Deposit check", to: "/deposit-check" },
  { art: "directDeposit", title: "Direct deposit", to: "/direct-deposit" },
  { art: "addCash", title: "Add cash", to: "/add-cash" },
  { art: "findAtm", title: "Find ATM", to: "/find-atm" },
  { art: "transactionHistory", title: "Transaction history", to: "/account" },
];


function MoveMoneyScreen() {
  return (
    <div className="bg-card pb-6">
      <PageHeader title="Move Money" />

      <div className="bg-card">
        {primary.map((item, i) => {
          const inner = (
            <>
              <Art name={item.art} size={54} />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] text-black">{item.title}</span>
                <span className="block text-[14px] leading-[1.3] text-[#5f6065]">
                  {item.subtitle}
                </span>
              </span>
              {item.badge ? <LimeBadge>{item.badge}</LimeBadge> : null}
              <Chevron />
            </>
          );
          const cls = "flex w-full items-center gap-4 px-4 py-5 text-left active:bg-[#f4f5f7]";
          return (
            <div key={item.title}>
              {i > 0 ? <Divider /> : null}
              <Link to={item.to} className={cls}>
                {inner}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="h-3 bg-surface" />

      <p className="px-4 pt-6 pb-4 text-[17px] font-bold text-black">More ways to move money</p>
      <div className="bg-card">
        {more.map((item, i) => (
          <div key={item.title}>
            {i > 0 ? <Divider /> : null}
            <Link
              to={item.to}
              className="flex w-full items-center gap-4 px-4 py-6 text-left active:bg-[#f4f5f7]"
            >
              <Art name={item.art} size={54} />
              <span className="flex-1 text-[17px] text-black">{item.title}</span>
              <Chevron />
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}

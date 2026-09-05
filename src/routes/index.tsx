import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ChevronUp, X, Plus, Share, PlusSquare, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { VaroHeader } from "@/components/varo/nav";
import { Chevron, DaysBadge, Divider, LimeBadge, SectionLabel } from "@/components/varo/ui";
import { Art } from "@/components/varo/icon";
import { useDemoAuth } from "@/lib/demo-auth";
import { isIOS, isMobile, isStandalone, promptInstall } from "@/lib/install";
import fdic from "@/assets/varo/fdic.png.asset.json";
import { useBalance, usd } from "@/lib/ledger";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varo — All-digital banking, no monthly fees" },
      {
        name: "description",
        content:
          "Check balances, move money, borrow up to $2,000 and earn cashback on everyday spending with Varo.",
      },
      { property: "og:title", content: "Varo — All-digital banking, no monthly fees" },
      {
        property: "og:description",
        content: "Bank account, savings at 1.00% APY, cashback offers and instant transfers.",
      },
    ],
  }),
  component: EntryScreen,
});

function EntryScreen() {
  const loggedIn = useDemoAuth();
  const [installed, setInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    setInstalled(isStandalone());
  }, []);

  if (installed === null) return null;
  if (loggedIn) return <HomeScreen />;
  if (!installed) return <InstallScreen />;
  return <SplashScreen />;
}

function InstallScreen() {
  const navigate = useNavigate();
  const ios = isIOS();
  const mobile = isMobile();

  const install = async () => {
    const ok = await promptInstall();
    if (ok) navigate({ to: "/login", replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-primary px-8 pb-10 pt-16 text-white">
      <div className="flex flex-col items-center text-center">
        <img src="/icons/icon-192.png" alt="Varo app icon" className="h-24 w-24 rounded-[22px] shadow-lg" />
        <p className="varo-wordmark mt-5 text-[40px] leading-none">Varo</p>
        <h1 className="mt-6 text-[22px] font-bold leading-snug">Install the Varo app</h1>
        <p className="mt-3 max-w-[280px] text-[14px] leading-[1.5] text-white/85">
          Add Varo to your home screen for the full banking experience — fast, secure and made for your phone.
        </p>
      </div>

      <div className="mt-auto space-y-5">
        {mobile && ios ? (
          <div className="rounded-2xl bg-white/10 p-5 text-left text-[14px] leading-[1.9]">
            <p className="mb-1 font-semibold">How to install on iPhone:</p>
            <p className="flex items-center gap-2">1. Tap the <Share className="h-4 w-4" /> Share button in Safari</p>
            <p className="flex items-center gap-2">2. Scroll and tap <PlusSquare className="h-4 w-4" /> "Add to Home Screen"</p>
            <p>3. Tap "Add" — then open Varo from your home screen</p>
          </div>
        ) : mobile ? (
          <button
            onClick={install}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 text-[16px] font-bold text-primary active:opacity-90"
          >
            <Download className="h-5 w-5" /> Install app
          </button>
        ) : (
          <p className="rounded-2xl bg-white/10 p-5 text-center text-[14px] leading-[1.6]">
            Open this link on your phone to install the Varo app on your home screen.
          </p>
        )}

      </div>
    </div>
  );
}

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/login", replace: true }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary px-8">
      <p className="varo-wordmark text-[74px] leading-none text-white">Varo</p>
      <div className="mt-3 flex items-start gap-2">
        <img src={fdic.url} alt="FDIC" className="mt-[2px] h-[13px] w-auto" />
        <p className="max-w-[210px] text-[11px] leading-[1.35] text-white/85 italic">
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government
        </p>
      </div>
    </div>
  );
}

const quickActions = [
  { label: "Transfer", to: "/transfer" },
  { label: "Pay bills", to: "/pay-bills" },
  { label: "View card", to: null },
  { label: "Send money", to: "/send-money" },
  { label: "Find ATM", to: null },
] as const;

function HomeScreen() {
  const [promo, setPromo] = useState(true);
  const balance = useBalance();

  return (
    <div className="pb-6">
      <VaroHeader />

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pt-2 pb-4">
        {quickActions.map((a) => {
          const cls =
            "shrink-0 rounded-[9px] bg-primary px-5 py-3 text-[15px] font-bold text-white";
          return a.to ? (
            <Link key={a.label} to={a.to} className={cls}>
              {a.label}
            </Link>
          ) : (
            <button key={a.label} type="button" className={cls}>
              {a.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 px-4">
        {promo ? (
          <section className="relative rounded-[8px] bg-mint px-5 pt-6 pb-6">
            <button
              type="button"
              onClick={() => setPromo(false)}
              aria-label="Dismiss offer"
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white"
            >
              <X className="size-5 text-black" strokeWidth={2.4} />
            </button>
            <Art name="promoCash" size={68} className="!h-auto !w-[68px]" />
            <h2 className="varo-title mt-3 text-[21px] text-[#2d1a48]">GET CASHBACK ON GAS</h2>
            <p className="mt-3 text-[15px] leading-[1.35] text-black">
              Earn up to 24c/gal back when you fill your tank at the gas station. Activate your
              deals now.
            </p>
            <button
              type="button"
              className="mt-4 rounded-[8px] border border-primary px-4 py-2.5 text-[15px] font-bold text-primary"
            >
              Activate offers
            </button>
          </section>
        ) : null}

        <section className="flex items-center gap-3 rounded-[8px] bg-card px-4 py-6">
          <div className="flex-1">
            <p className="text-[16px] leading-[1.35] text-black">
              Unlock a higher savings rate with qualifying direct deposits.
            </p>
            <button
              type="button"
              className="mt-3 flex items-center gap-1 text-[15px] font-bold text-primary"
            >
              Set up direct deposit
              <span className="text-[16px]">›</span>
            </button>
          </div>
          <Art name="lockMoney" size={86} />
        </section>
      </div>

      <SectionLabel>Banking</SectionLabel>

      <div className="mx-4 overflow-hidden rounded-[8px]">
        <Link to="/account" className="flex items-center gap-3 bg-card px-4 py-4">
          <Art name="bankAccount" size={42} />
          <span className="flex-1 text-[16px] text-black">Varo Bank Account</span>
          <span className="text-[19px] font-bold text-black">{usd(balance)}</span>
        </Link>

        <div className="bg-[#d6d9dd]">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[15px] font-semibold text-black">Top up your account</span>
            <ChevronUp className="size-5 text-black" strokeWidth={2.2} />
          </div>
          <TopUpRow
            art="cashapp"
            title="Use Cash App, Paypal or Venmo"
            badge="instant"
            to="/fund-apps"
          />
          <div className="mx-4 h-px bg-black/10" />
          <TopUpRow art="depositCash" title="Deposit Cash" badge="instant" to="/add-cash" />
          <div className="mx-4 h-px bg-black/10" />
          <TopUpRow art="bankTransfer" title="Bank Transfer" badge="days" to="/transfer" />
        </div>
      </div>

      <Link
        to="/savings"
        className="mx-4 mt-3 flex items-center gap-3 rounded-[8px] bg-card px-4 py-4"
      >
        <Art name="savingsBag" size={44} />
        <span className="flex-1">
          <span className="block text-[16px] text-black">Varo Savings Account</span>
          <span className="mt-1 inline-block rounded-[6px] bg-[#eceef1] px-2 py-0.5 text-[13px] text-black">
            1.00% APY
          </span>
        </span>
        <span className="text-[19px] font-bold text-black">$0.00</span>
      </Link>

      <div className="mx-4 mt-3 flex items-center gap-3 rounded-[8px] bg-card px-4 py-4">
        <Art name="believeCard" size={44} />
        <span className="flex-1">
          <span className="block text-[16px] text-black">Varo Believe Card</span>
          <span className="block text-[14px] text-[#5f6065]">
            Build credit with no monthly fees. No APR.
          </span>
        </span>
        <span className="grid size-8 place-items-center rounded-full bg-[#eceef1]">
          <Plus className="size-4 text-primary" strokeWidth={2.4} />
        </span>
      </div>

      <div className="mx-4 mt-3 rounded-[8px] bg-[#d6d9dd] px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-black">Get early payday and more with direct deposit</span>
          <Chevron />
        </div>
        <div className="mt-3 h-6 rounded-full bg-white" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[16px] font-bold text-black">$0.00 this month</span>
          <span className="text-[16px] text-[#6f7075]">Updated Sep 3</span>
        </div>
      </div>

      <SectionLabel>Borrow</SectionLabel>
      <div className="mx-4 grid grid-cols-2 gap-3">
        <article className="flex flex-col rounded-[8px] bg-card p-4">
          <Art name="advance" size={46} />
          <p className="mt-4 text-[15px] text-black">Advance</p>
          <p className="mt-1 text-[17px] font-bold text-black">Get up to $250</p>
          <button
            type="button"
            className="mt-6 w-fit rounded-[6px] bg-lime px-2 py-1 text-[14px] text-black"
          >
            Try it!
          </button>
        </article>
        <article className="relative flex flex-col rounded-[8px] bg-card p-4">
          <span className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[#eceef1]">
            <Plus className="size-4 text-primary" strokeWidth={2.4} />
          </span>
          <Art name="lineCredit" size={46} />
          <p className="mt-4 text-[15px] text-black">Line of Credit</p>
          <p className="mt-1 text-[17px] font-bold text-black">Borrow up to $2,000</p>
          <p className="mt-6 text-[14px] text-[#5f6065]">with monthly repayments</p>
        </article>
      </div>

      <SectionLabel>For you</SectionLabel>
      <div className="mx-4 space-y-3">
        <article className="flex items-stretch overflow-hidden rounded-[8px] bg-card">
          <div className="flex-1 p-4">
            <p className="text-[17px] leading-[1.3] font-bold text-black">
              The easiest way to view your other account balances and move money.
            </p>
            <button
              type="button"
              className="mt-4 rounded-[8px] border border-primary px-4 py-2.5 text-[15px] font-bold text-primary"
            >
              Link Accounts
            </button>
          </div>
          <Art name="linkAccounts" size={0} className="!h-auto !w-[72px] !object-cover" />
        </article>
        <article className="flex items-stretch overflow-hidden rounded-[8px] bg-card">
          <div className="flex-1 p-4">
            <p className="text-[17px] leading-[1.3] font-bold text-black">
              Invite friends. Earn $100.*
            </p>
            <p className="mt-2 text-[15px] leading-[1.35] text-black">
              You and your friend both get $100 when they join Varo and qualify.
            </p>
            <button
              type="button"
              className="mt-4 rounded-[8px] border border-primary px-4 py-2.5 text-[15px] font-bold text-primary"
            >
              Get $100
            </button>
          </div>
          <Art name="inviteHands" size={0} className="!h-auto !w-[72px] !object-cover" />
        </article>
      </div>
    </div>
  );
}

function TopUpRow({
  art,
  title,
  badge,
  to,
}: {
  art: "cashapp" | "depositCash" | "bankTransfer";
  title: string;
  badge: "instant" | "days";
  to?: "/fund-apps" | "/add-cash" | "/transfer";
}) {
  const inner = (
    <>
      <Art name={art} size={38} />
      <span className="flex-1 text-[16px] text-black">{title}</span>
      {badge === "instant" ? <LimeBadge>⚡ Instant</LimeBadge> : <DaysBadge>2-4 days</DaysBadge>}
    </>
  );
  const cls = "flex w-full items-center gap-3 px-4 py-3 text-left";
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

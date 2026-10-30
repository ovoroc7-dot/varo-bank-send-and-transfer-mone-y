import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Flag, HelpCircle, Repeat2, User } from "lucide-react";
import { useTransactions, usd } from "@/lib/ledger";

export const Route = createFileRoute("/transaction/$id")({
  head: () => ({
    meta: [
      { title: "Transaction details — Varo" },
      {
        name: "description",
        content:
          "See the full details of a Varo transaction: amount, recipient, status, date and the account it came from.",
      },
      { property: "og:title", content: "Transaction details — Varo" },
      {
        property: "og:description",
        content: "Amount, recipient, status, date and account for your Varo transaction.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TransactionDetail,
});

function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fullTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function TransactionDetail() {
  const { id } = useParams({ from: "/transaction/$id" });
  const navigate = useNavigate();
  const txn = useTransactions().find((t) => t.id === id);

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center gap-4 px-4 pt-4 pb-3">
        <button type="button" aria-label="Back" onClick={() => navigate({ to: "/account" })}>
          <ArrowLeft className="size-[26px] text-black" strokeWidth={2.6} />
        </button>
        <h1 className="flex-1 text-[18px] font-bold text-black">Transaction details</h1>
      </header>

      {txn ? (
        <>
          <section className="flex flex-col items-center px-4 pt-6 pb-8">
            <span className="grid size-[56px] place-items-center rounded-full bg-[#ece4fb]">
              <User className="size-7 text-primary" strokeWidth={2} />
            </span>
            <p className="varo-title mt-5 text-[44px] leading-none text-black">
              {txn.amount < 0 ? `-${usd(Math.abs(txn.amount))}` : `+${usd(txn.amount)}`}
            </p>
            <p className="mt-3 text-[17px] font-bold text-black">{txn.name}</p>
            <span
              className={`mt-3 rounded-full px-3 py-1 text-[13px] font-bold ${
                txn.status === "pending" ? "bg-[#fdf0cf] text-[#8a6300]" : "bg-lime text-black"
              }`}
            >
              {txn.status === "pending" ? "Pending" : "Completed"}
            </span>
            {txn.status === "pending" ? (
              <p className="mt-3 px-4 text-center text-[14px] leading-[1.4] text-[#6f7075]">
                This transfer is under review and will stay pending until it clears.
              </p>
            ) : null}
          </section>

          <div className="h-2 bg-[#f1f4f8]" />

          <section className="px-4 pt-2">
            {[
              ["Status", txn.status === "pending" ? "Pending review" : "Completed"],
              [txn.amount < 0 ? "Sent to" : "Received from", txn.name],
              ["Type", txn.amount < 0 ? "Varo to Anyone" : "Deposit"],
              [txn.amount < 0 ? "From account" : "To account", "Varo Bank Account \u2022 3046"],
              ["Note", txn.note?.trim() ? txn.note : "\u2014"],
              ["Date", fullDate(txn.date)],
              ["Time", fullTime(txn.date)],
              ["BIC Fee", usd(txn.fee ?? 0)],
              ["Amount", usd(Math.abs(txn.amount))],
              ["Total", usd(Math.abs(txn.amount) + (txn.fee ?? 0))],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 border-b border-[#e2e3e6] py-4"
              >
                <span className="text-[15px] text-[#6f7075]">{label}</span>
                <span className="max-w-[62%] text-right text-[15px] text-black">{value}</span>
              </div>
            ))}
          </section>


          <section className="px-4 pt-2 pb-16">
            {[
              { label: "Send money again", icon: Repeat2, to: "/send-money" as const },
              { label: "Report an issue", icon: Flag, to: "/my-varo" as const },
              { label: "Get help", icon: HelpCircle, to: "/my-varo" as const },
            ].map(({ label, icon: Icon, to }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate({ to })}
                className="flex w-full items-center gap-4 border-b border-[#e2e3e6] py-4 text-left"
              >
                <Icon className="size-6 text-black" strokeWidth={1.9} />
                <span className="flex-1 text-[16px] text-black">{label}</span>
                <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
              </button>
            ))}
          </section>
        </>
      ) : (
        <section className="px-4 pt-20 text-center">
          <p className="text-[17px] text-[#6f7075]">This transaction is no longer available.</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/account" })}
            className="mt-8 h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white"
          >
            Back to activity
          </button>
        </section>
      )}
    </div>
  );
}

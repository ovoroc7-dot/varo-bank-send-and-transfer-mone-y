import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Delete, Info, User } from "lucide-react";
import { ledger, useBalance, usd } from "@/lib/ledger";
import heroTex from "@/assets/varo/send-hero-tex.png.asset.json";
import flashlight from "@/assets/varo/flashlight.png.asset.json";
import handsClap from "@/assets/varo/hands-clap.png.asset.json";

export const Route = createFileRoute("/send-money")({
  head: () => ({
    meta: [
      { title: "Varo to Anyone — Send money instantly" },
      {
        name: "description",
        content:
          "Send money to anyone with just their name, email address or US phone number. It arrives in their bank account instantly, with no fees.",
      },
      { property: "og:title", content: "Varo to Anyone — Send money instantly" },
      {
        property: "og:description",
        content: "All you need is their phone number or email. No fees, arrives instantly.",
      },
    ],
  }),
  component: SendMoneyScreen,
});

const brands = ["ANYONE", "CHIME®", "ALLY®", "USAA®", "VENMO", "CHASE®"];

const contacts = [
  { name: "Ashley Carter", detail: "ashley.carter@gmail.com" },
  { name: "Marcus Reed", detail: "+1 (305) 442-8891" },
  { name: "Denise Holloway", detail: "denise.holloway@outlook.com" },
  { name: "Tyler Brooks", detail: "+1 (973) 208-4417" },
  { name: "Priya Raman", detail: "priya.raman@gmail.com" },
];

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];

type Recipient = { name: string; detail: string };

function SendMoneyScreen() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "recipient" | "amount" | "review" | "sent">("intro");
  const balance = useBalance();
  const [brand, setBrand] = useState(0);
  const [query, setQuery] = useState("");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [cents, setCents] = useState("");

  useEffect(() => {
    if (step !== "intro") return;
    const t = setInterval(() => setBrand((b) => (b + 1) % brands.length), 1600);
    return () => clearInterval(t);
  }, [step]);

  const displayName = nickname.trim() || recipient?.name || "Recipient";

  function send() {
    if (amountValue < 1) return;
    ledger.addSent({ name: displayName, note: note.trim(), amount: amountValue });
    setStep("sent");
  }

  function back() {
    if (step === "sent") router.navigate({ to: "/account" });
    else if (step === "amount") setStep("recipient");
    else if (step === "recipient") setStep("intro");
    else if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to: "/", replace: true });
  }

  const q = query.trim().toLowerCase();
  const matches = q
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.detail.toLowerCase().replace(/[()\-\s]/g, "").includes(q.replace(/[()\-\s]/g, "")),
      )
    : [];

  const amountValue = Number(cents || "0") / 100;
  const amount = amountValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const belowMin = amountValue > 0 && amountValue < 1;

  function press(k: string) {
    if (k === "del") setCents((c) => c.slice(0, -1));
    else setCents((c) => (c + k).replace(/^0+(?=\d)/, "").slice(0, 10));
  }

  if (step === "intro") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div
          className="relative bg-cover bg-center px-6 pt-5 pb-10"
          style={{ backgroundImage: `url(${heroTex.url})` }}
        >
          <button type="button" aria-label="Back" onClick={back}>
            <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
          </button>
          <p className="varo-title mt-5 text-center text-[17px] tracking-[0.02em] text-black">
            VARO TO ANYONE
          </p>
          <h1 className="varo-title mt-1 text-center text-[52px] leading-[0.92] text-black">
            SEND
            <br />
            MONEY TO
            <br />
            {brands[brand]}
          </h1>
        </div>

        <div className="px-4 pt-6">
          <p className="text-center text-[17px] text-primary italic">FOR REAL</p>
          <h2 className="mt-3 text-[24px] leading-[1.2] font-bold text-black">
            All you need is their phone number or email.
          </h2>
          <ol className="mt-5 space-y-3">
            {[
              "Your friend will receive a text or email notification when you send the money.",
              "All they have to do is enter their debit card info. That's it!",
              "The money arrives in their bank account instantly, no fees. Just like that.",
            ].map((t, i) => (
              <li key={t} className="flex gap-3 text-[15px] leading-[1.35] text-black">
                <span className="w-4 shrink-0 text-right">{i + 1}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-auto px-4 pt-10 pb-6">
          <button
            type="button"
            onClick={() => setStep("recipient")}
            className="h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  if (step === "recipient") {
    return (
      <div className="min-h-screen bg-white">
        <header className="flex items-center gap-4 px-4 pt-5 pb-4">
          <button type="button" aria-label="Back" onClick={back}>
            <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
          </button>
          <span className="text-[17px] font-bold text-black">Varo to Anyone</span>
        </header>

        <div className="px-4">
          <label htmlFor="to" className="block text-[13px] text-[#6f7075]">
            To
          </label>
          <input
            id="to"
            value={query}
            autoComplete="off"
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter name, email, or phone"
            className="mt-1 h-[52px] w-full rounded-[8px] border border-border px-4 text-[16px] text-black outline-none focus:border-primary"
          />
        </div>

        {query.trim() ? (
          <div className="px-4 pt-4">
            {matches.length ? (
              <>
                <p className="pb-2 text-[13px] text-[#6f7075]">Contacts</p>
                {matches.map((c) => (
                  <button
                    key={c.detail}
                    type="button"
                    onClick={() => {
                      setRecipient(c);
                      setStep("amount");
                    }}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <Avatar />
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] text-black">{c.name}</span>
                      <span className="block truncate text-[14px] text-[#6f7075]">{c.detail}</span>
                    </span>
                  </button>
                ))}
              </>
            ) : null}
            <p className="pt-3 pb-2 text-[13px] text-[#6f7075]">New recipient</p>
            <button
              type="button"
              onClick={() => {
                const v = query.trim();
                setRecipient({ name: v, detail: v });
                setStep("amount");
              }}
              className="flex w-full items-center gap-3 py-3 text-left"
            >
              <Avatar />
              <span className="min-w-0 truncate text-[16px] text-black">{query.trim()}</span>
            </button>
          </div>
        ) : (
          <>
            <img src={flashlight.url} alt="" aria-hidden className="mx-auto mt-8 w-[150px]" />
            <p className="px-8 pt-2 text-center text-[15px] leading-[1.35] text-black">
              To send money to someone new, enter their <b>email address</b> or{" "}
              <b>US phone number.</b>
            </p>
            <div className="mx-4 mt-8 flex items-center gap-3 rounded-[10px] border border-border p-4">
              <span className="flex-1">
                <span className="block text-[15px] leading-[1.35] text-black">
                  Add your contacts to send money to anyone instantly.
                </span>
                <span className="mt-2 flex items-center gap-1 text-[15px] font-bold text-primary">
                  Allow access to contacts
                  <ChevronRight className="size-4" strokeWidth={2.6} />
                </span>
              </span>
              <img src={handsClap.url} alt="" aria-hidden className="w-[64px]" />
            </div>
          </>
        )}
      </div>
    );
  }

  if (step === "sent") {
    return (
      <div className="flex min-h-screen flex-col bg-white px-6 pt-16 pb-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid size-[72px] place-items-center rounded-full bg-lime">
            <Check className="size-9 text-primary" strokeWidth={3} />
          </span>
          <h1 className="varo-title mt-6 text-[28px] text-black">MONEY SENT</h1>
          <p className="mt-2 text-[17px] text-black">
            {amount} to {displayName}
          </p>
          {note.trim() ? (
            <p className="mt-1 text-[15px] text-[#6f7075]">For {note.trim()}</p>
          ) : null}
          <p className="mt-6 text-[15px] text-[#6f7075]">
            New available balance {usd(ledger.getBalance())}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={() => router.navigate({ to: "/account" })}
            className="h-[52px] w-full rounded-[8px] bg-primary text-[16px] font-bold text-white"
          >
            View activity
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/" })}
            className="h-[52px] w-full rounded-[8px] border border-primary text-[16px] font-bold text-primary"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center gap-4 px-4 pt-5 pb-4">
        <button type="button" aria-label="Back" onClick={back}>
          <ArrowLeft className="size-6 text-black" strokeWidth={2.2} />
        </button>
        <span className="text-[17px] font-bold text-black">Varo to Anyone</span>
      </header>

      <div className="px-4">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <span className="text-[13px] text-[#6f7075]">To:</span>
          <Avatar />
          <span className="min-w-0 flex-1">
            <input
              value={nickname}
              maxLength={40}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Add nickname"
              aria-label="Add nickname"
              className="w-full text-[15px] text-black outline-none placeholder:text-[#8b8b90]"
            />
            <span className="block truncate text-[13px] text-[#6f7075]">{recipient?.detail}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 border-b border-border py-4">
          <span className="text-[13px] text-[#6f7075]">For:</span>
          <input
            value={note}
            maxLength={80}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note"
            aria-label="Add a note"
            className="w-full text-[15px] text-black outline-none placeholder:text-[#8b8b90]"
          />
        </div>
      </div>

      <p className="varo-title pt-12 text-center text-[46px] leading-none text-black">{amount}</p>

      <p
        className={`flex items-center justify-center gap-1 pt-6 text-[12px] ${
          belowMin ? "text-[#d0342c]" : "text-black"
        }`}
      >
        {belowMin ? "Minimum transfer amount is $1.00" : "Your limit for this transfer is $0.00"}
        <Info className="size-[13px]" strokeWidth={2} />
      </p>

      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={send}
          disabled={amountValue < 1}
          className={`h-[46px] w-full rounded-[6px] text-[15px] font-bold ${
            amountValue < 1
              ? "bg-[#e3e6ea] text-[#9a9ba0]"
              : "bg-primary text-white active:opacity-90"
          }`}
        >
          Send {amountValue >= 1 ? amount : ""}
        </button>
      </div>

      <div className="grid grid-cols-3 pt-2 pb-6">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            aria-label={k === "del" ? "Delete" : k}
            onClick={() => press(k)}
            className="flex h-[64px] items-center justify-center text-[22px] text-black active:bg-[#eceef1]"
          >
            {k === "del" ? <Delete className="size-6" strokeWidth={1.8} /> : k}
          </button>
        ))}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-[#ece4fb]">
      <User className="size-[18px] text-primary" strokeWidth={2} />
    </span>
  );
}

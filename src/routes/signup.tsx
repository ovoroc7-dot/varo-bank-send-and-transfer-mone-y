import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/varo/signup-hero.png.asset.json";
import { demoAuth } from "@/lib/demo-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Open an account — Varo" },
      {
        name: "description",
        content:
          "Open a Varo Bank Account step by step: contact info, legal name, birthday, address, password and verification.",
      },
      { property: "og:title", content: "Open an account — Varo" },
      {
        property: "og:description",
        content: "Sign up for a free Varo Bank Account in a few quick steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupScreen,
});

const TOTAL = 7;

type Form = {
  email: string;
  phone: string;
  first: string;
  last: string;
  dob: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
  password: string;
  agree: boolean;
  pin: string;
};

const empty: Form = {
  email: "",
  phone: "",
  first: "",
  last: "",
  dob: "",
  street: "",
  apt: "",
  city: "",
  state: "",
  zip: "",
  ssn: "",
  password: "",
  agree: false,
  pin: "",
};

function fmtPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
function fmtDob(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length < 3) return d;
  if (d.length < 5) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}
function fmtSsn(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 9);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}
function age(dob: string) {
  const [m, d, y] = dob.split("/").map(Number);
  if (!m || !d || !y || m > 12 || d > 31 || y < 1900) return -1;
  const b = new Date(y, m - 1, d);
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), m - 1, d)) a--;
  return a;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  hint,
  right,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className="block text-[14px] font-bold text-black">
        {label}
      </label>
      <div className="mt-2 flex h-[52px] items-center rounded-[6px] border border-[#8e8e93] px-3 focus-within:border-primary focus-within:border-2">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-black outline-none"
        />
        {right}
      </div>
      {hint ? <p className="mt-1 text-[12px] text-[#6e6e73]">{hint}</p> : null}
    </div>
  );
}

function SignupScreen() {
  const router = useRouter();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>(empty);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  const pw = f.password;
  const pwRules = [
    { ok: pw.length >= 8, t: "At least 8 characters" },
    { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), t: "Upper and lowercase letters" },
    { ok: /\d/.test(pw), t: "At least one number" },
  ];

  const valid: Record<number, boolean> = {
    1: /^\S+@\S+\.\S+$/.test(f.email.trim()) && f.phone.replace(/\D/g, "").length === 10,
    2: f.first.trim().length > 0 && f.last.trim().length > 0,
    3: f.dob.length === 10,
    4: f.street.trim() !== "" && f.city.trim() !== "" && f.state.length === 2 && f.zip.length === 5,
    5: f.ssn.replace(/\D/g, "").length === 9,
    6: pwRules.every((r) => r.ok) && f.agree,
    7: f.pin.length === 4,
  };

  const back = () => {
    setError(null);
    if (step === 1) router.history.back();
    else setStep((s) => s - 1);
  };

  const submit = async () => {
    if (step === 3 && age(f.dob) < 18) {
      setError(age(f.dob) < 0 ? "Enter a valid date of birth." : "You must be 18 or older to open a Varo account.");
      return;
    }
    if (step < TOTAL) {
      setStep((s) => s + 1);
      return;
    }
    if (f.pin !== "5656") {
      setError("That account verification PIN isn't correct.");
      return;
    }
    setBusy(true);
    const result = await demoAuth.signup(f.email.trim().toLowerCase(), f.password, f.phone, {
      first_name: f.first.trim(),
      last_name: f.last.trim(),
      city: f.city.trim(),
      state: f.state,
    });
    setBusy(false);
    if (result.error) setError(result.error);
    else if (result.needsConfirmation) setConfirmSent(true);
    else navigate({ to: "/", replace: true });
  };

  if (confirmSent) {
    return (
      <div className="min-h-dvh bg-white px-4 pt-16">
        <p className="varo-wordmark text-center text-[42px] leading-none text-primary">Varo</p>
        <h1 className="mt-10 text-center text-[22px] font-bold text-black">Check your email</h1>
        <p className="mt-3 text-center text-[15px] leading-[1.5] text-[#3a3a3c]">
          We sent a confirmation link to {f.email}. Open it to finish setting up your account, then
          log in.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/login" })}
          className="mt-8 h-[52px] w-full rounded-[6px] bg-primary text-[16px] font-medium text-white"
        >
          Back to log in
        </button>
      </div>
    );
  }

  const titles: Record<number, [string, string]> = {
    1: ["Let's get started", "Enter the email and US mobile number you'll use for your Varo Bank Account."],
    2: ["What's your legal name?", "Enter your name exactly as it appears on your government-issued ID."],
    3: ["When's your birthday?", "You must be at least 18 years old to open an account."],
    4: ["What's your home address?", "We'll mail your Varo Visa® Debit Card here. No P.O. boxes."],
    5: ["Verify your identity", "Federal law requires us to verify your Social Security number. This won't affect your credit score."],
    6: ["Create a password", "You'll use this with your email to log in to Varo."],
    7: ["Account verification", "Enter the 4-digit account verification PIN to finish opening your account."],
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className={step === 1 ? "bg-[#eae1fe] px-4 pt-4 pb-6" : "px-4 pt-4"}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={back} aria-label="Go back" className="shrink-0">
            <ArrowLeft className="size-7 text-black" strokeWidth={2.4} />
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e6e8ec]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(step / TOTAL) * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-[13px] text-[#6e6e73]">
            {step} of {TOTAL}
          </span>
        </div>
        {step === 1 ? (
          <>
            <img src={hero.url} alt="" aria-hidden className="ml-auto mt-3 w-[62%]" />
            <p className="mt-3 text-[17px] leading-[1.35] text-black">
              Join the bank with sky-high savings, easy credit building, and affordable cash advances.
            </p>
          </>
        ) : null}
      </div>

      <form
        noValidate
        className="flex flex-1 flex-col px-4 pt-6 pb-[max(20px,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid[step]) void submit();
        }}
      >
        <div key={step} className="animate-fade-in">
          {step === 7 ? (
            <div className="mb-4 grid size-14 place-items-center rounded-full bg-[#eae1fe]">
              <ShieldCheck className="size-7 text-primary" />
            </div>
          ) : null}
          <h1 className="text-[24px] font-bold leading-tight text-black">{titles[step][0]}</h1>
          <p className="mt-2 text-[15px] leading-[1.4] text-[#3a3a3c]">{titles[step][1]}</p>

          {step === 1 && (
            <>
              <Field id="email" label="Email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(v) => set("email", v)} />
              <Field id="phone" label="US mobile number" inputMode="tel" autoComplete="tel" placeholder="(555) 555-5555" value={f.phone} onChange={(v) => set("phone", fmtPhone(v))} hint="Message and data rates may apply." />
            </>
          )}
          {step === 2 && (
            <>
              <Field id="first" label="Legal first name" autoComplete="given-name" value={f.first} onChange={(v) => set("first", v)} />
              <Field id="last" label="Legal last name" autoComplete="family-name" value={f.last} onChange={(v) => set("last", v)} />
            </>
          )}
          {step === 3 && (
            <Field id="dob" label="Date of birth" inputMode="numeric" autoComplete="bday" placeholder="MM/DD/YYYY" value={f.dob} onChange={(v) => set("dob", fmtDob(v))} />
          )}
          {step === 4 && (
            <>
              <Field id="street" label="Street address" autoComplete="address-line1" value={f.street} onChange={(v) => set("street", v)} />
              <Field id="apt" label="Apt, suite (optional)" autoComplete="address-line2" value={f.apt} onChange={(v) => set("apt", v)} />
              <Field id="city" label="City" autoComplete="address-level2" value={f.city} onChange={(v) => set("city", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field id="state" label="State" autoComplete="address-level1" placeholder="CA" value={f.state} onChange={(v) => set("state", v.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase())} />
                <Field id="zip" label="ZIP code" inputMode="numeric" autoComplete="postal-code" value={f.zip} onChange={(v) => set("zip", v.replace(/\D/g, "").slice(0, 5))} />
              </div>
            </>
          )}
          {step === 5 && (
            <Field
              id="ssn"
              label="Social Security number"
              inputMode="numeric"
              type={show ? "text" : "password"}
              placeholder="XXX-XX-XXXX"
              value={f.ssn}
              onChange={(v) => set("ssn", fmtSsn(v))}
              hint="Your information is encrypted and secure."
              right={
                <button type="button" aria-label="Show SSN" onClick={() => setShow((s) => !s)}>
                  {show ? <EyeOff className="size-[22px]" /> : <Eye className="size-[22px]" />}
                </button>
              }
            />
          )}
          {step === 6 && (
            <>
              <Field
                id="new-password"
                label="Password"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                value={f.password}
                onChange={(v) => set("password", v)}
                right={
                  <button type="button" aria-label="Show password" onClick={() => setShow((s) => !s)}>
                    {show ? <EyeOff className="size-[22px]" /> : <Eye className="size-[22px]" />}
                  </button>
                }
              />
              <ul className="mt-3 space-y-1.5">
                {pwRules.map((r) => (
                  <li key={r.t} className={`flex items-center gap-2 text-[14px] ${r.ok ? "text-[#1f8a4c]" : "text-[#6e6e73]"}`}>
                    <Check className="size-4" strokeWidth={r.ok ? 3 : 2} /> {r.t}
                  </li>
                ))}
              </ul>
              <label className="mt-6 flex items-start gap-3 text-[14px] leading-[1.4] text-black">
                <input type="checkbox" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#7b4ecd]" />
                <span>
                  I agree to the <span className="font-semibold text-primary underline">Varo Bank Account Agreement</span>, <span className="font-semibold text-primary underline">Privacy Policy</span> and <span className="font-semibold text-primary underline">E-Sign Consent</span>.
                </span>
              </label>
            </>
          )}
          {step === 7 && (
            <>
              <div className="mt-6 flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`grid size-14 place-items-center rounded-[8px] border-2 text-[24px] font-bold ${f.pin.length === i ? "border-primary" : "border-[#c7c7cc]"}`}>
                    {f.pin[i] ? "•" : ""}
                  </div>
                ))}
              </div>
              <input
                id="pin"
                aria-label="Account verification PIN"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                value={f.pin}
                onChange={(e) => set("pin", e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="mt-4 h-[52px] w-full rounded-[6px] border border-[#8e8e93] px-3 text-center text-[16px] tracking-[0.5em] text-black outline-none"
              />
              <div className="mt-6 rounded-[8px] bg-[#f4f4f7] p-4 text-[14px] leading-[1.5] text-black">
                <p className="font-bold">Review</p>
                <p>{f.first} {f.last}</p>
                <p>{f.email} · {f.phone}</p>
                <p>{f.street}{f.apt ? `, ${f.apt}` : ""}, {f.city}, {f.state} {f.zip}</p>
              </div>
            </>
          )}

          {error ? <p className="mt-4 text-[14px] text-[#c0392b]">{error}</p> : null}
        </div>

        <div className="mt-auto pt-8">
          <button
            type="submit"
            disabled={!valid[step] || busy}
            className="h-[52px] w-full rounded-[6px] bg-[#e6e8ec] text-[16px] font-bold text-[#8b8b90] disabled:cursor-not-allowed enabled:bg-primary enabled:text-white"
          >
            {busy ? "Opening your account…" : step === TOTAL ? "Open my account" : "Continue"}
          </button>
          {step === 1 ? (
            <p className="mt-4 text-center text-[13px] text-black">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate({ to: "/login" })} className="font-bold text-primary underline">
                Log in
              </button>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

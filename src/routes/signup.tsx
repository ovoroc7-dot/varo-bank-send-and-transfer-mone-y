import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Eye } from "lucide-react";
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
          "Join the bank with sky-high savings, easy credit building, and affordable cash advances.",
      },
      { property: "og:title", content: "Open an account — Varo" },
      {
        property: "og:description",
        content: "Enter the phone number and email you'll use for your Varo Bank Account.",
      },
    ],
  }),
  component: SignupScreen,
});

function SignupScreen() {
  const router = useRouter();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const ready = email.trim() !== "" && password.length >= 6;

  if (confirmSent) {
    return (
      <div className="min-h-screen bg-white px-4 pt-16">
        <p className="varo-wordmark text-center text-[42px] leading-none text-primary">Varo</p>
        <h1 className="mt-10 text-center text-[22px] font-bold text-black">
          Check your email
        </h1>
        <p className="mt-3 text-center text-[15px] leading-[1.5] text-[#3a3a3c]">
          We sent a confirmation link to {email}. Open it to finish setting up your
          account, then log in.
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

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#eae1fe] px-4 pt-4 pb-6">
        <button type="button" onClick={() => router.history.back()} aria-label="Go back">
          <ArrowLeft className="size-7 text-black" strokeWidth={2.4} />
        </button>
        <img src={hero.url} alt="" aria-hidden className="ml-auto mt-1 w-[62%]" />
        <p className="mt-3 text-[17px] leading-[1.35] text-black">
          Join the bank with sky-high savings, easy credit building, and affordable cash advances.
        </p>
      </div>

      <form
        className="px-4 pt-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const result = await demoAuth.signup(
            email.trim().toLowerCase(),
            password,
            phone.trim() || undefined,
          );
          setBusy(false);
          if (result.error) {
            setError(result.error);
          } else if (result.needsConfirmation) {
            setConfirmSent(true);
          } else {
            navigate({ to: "/", replace: true });
          }
        }}
      >
        <p className="text-[17px] leading-[1.35] text-black">
          Enter the email, phone number and password you'll use for your Varo Bank Account.
        </p>

        <label htmlFor="email" className="mt-6 block text-[14px] font-bold text-black">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 h-[52px] w-full rounded-[6px] border border-primary px-3 text-[16px] text-black outline-none"
        />

        <label htmlFor="mobile" className="mt-5 block text-[14px] font-bold text-black">
          US mobile number
        </label>
        <input
          id="mobile"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 h-[52px] w-full rounded-[6px] border border-[#8e8e93] px-3 text-[16px] text-black outline-none"
        />

        <label htmlFor="new-password" className="mt-5 block text-[14px] font-bold text-black">
          Password
        </label>
        <div className="mt-2 flex h-[52px] w-full items-center rounded-[6px] border border-[#8e8e93] px-3">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-full flex-1 bg-transparent text-[16px] text-black outline-none"
          />
          <button
            type="button"
            aria-label="Show password"
            onClick={() => setShowPassword((s) => !s)}
          >
            <Eye className="size-[22px] text-black" strokeWidth={1.8} />
          </button>
        </div>
        <p className="mt-1 text-[12px] text-[#6e6e73]">At least 6 characters.</p>

        {error ? (
          <p className="mt-3 text-[14px] text-[#c0392b]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={!ready || busy}
          className="mt-6 h-[52px] w-full rounded-[6px] bg-[#e6e8ec] text-[16px] text-[#8b8b90] disabled:cursor-not-allowed enabled:bg-primary enabled:text-white"
        >
          {busy ? "Opening your account…" : "Open an account"}
        </button>
      </form>
    </div>
  );
}

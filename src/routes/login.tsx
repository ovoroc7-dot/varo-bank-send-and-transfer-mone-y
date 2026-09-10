import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Eye } from "lucide-react";
import { demoAuth } from "@/lib/demo-auth";
import fdic from "@/assets/varo/fdic.png.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Varo" },
      {
        name: "description",
        content: "Log in to Varo with your email address and password.",
      },
      { property: "og:title", content: "Log in — Varo" },
      { property: "og:description", content: "Log in to your Varo account." },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const identifierRequired = touched && identifier.trim() === "";

  return (
    <div className="flex min-h-dvh flex-col bg-white px-5 pt-[max(14px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]">
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-full bg-[#f4f4f7] px-6 py-2.5 text-[16px] font-bold text-primary"
        >
          Help
        </button>
      </div>

      <p className="varo-wordmark mt-8 text-center text-[52px] leading-none text-primary">Varo</p>

      <form
        className="mt-12"
        onSubmit={async (e) => {
          e.preventDefault();
          setTouched(true);
          if (!identifier.trim() || !password) return;
          setBusy(true);
          setError(null);
          const err = await demoAuth.login(identifier.trim().toLowerCase(), password);
          setBusy(false);
          if (err) {
            setError("That email address or password doesn't match our records.");
          } else {
            navigate({ to: "/", replace: true });
          }
        }}
      >
        <label htmlFor="identifier" className="block text-[17px] font-bold text-black">
          Email address or phone number
        </label>
        <input
          id="identifier"
          type="email"
          autoComplete="email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={identifierRequired}
          aria-describedby={identifierRequired ? "identifier-error" : undefined}
          className={`mt-2 h-[64px] w-full rounded-[8px] border px-4 text-[17px] text-black outline-none ${
            identifierRequired ? "border-2 border-[#d64541]" : "border-[#8e8e93] focus:border-primary"
          }`}
        />
        {identifierRequired ? (
          <p id="identifier-error" className="mt-2 flex items-center gap-1.5 text-[15px] text-[#d64541]">
            <AlertCircle className="size-[18px] shrink-0 fill-[#d64541] text-white" />
            Required
          </p>
        ) : null}

        <label htmlFor="password" className="mt-6 block text-[17px] font-bold text-black">
          Password
        </label>
        <div className="mt-2 flex h-[64px] w-full items-center rounded-[8px] border border-[#8e8e93] px-4 focus-within:border-primary">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-full flex-1 bg-transparent text-[17px] text-black outline-none"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
          >
            <Eye className="size-[24px] text-black" strokeWidth={1.8} />
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-[14px] text-[#c0392b]">{error}</p>
        ) : null}

        <button
          type="button"
          className="mt-5 text-[17px] font-bold text-primary underline underline-offset-4"
        >
          Forgot password
        </button>

        <button
          type="submit"
          disabled={busy}
          className="mt-8 h-[52px] w-full rounded-[8px] bg-primary text-[17px] font-medium text-white disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>

        <Link
          to="/signup"
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[8px] border-2 border-primary text-[17px] font-bold text-primary"
        >
          Sign up
        </Link>
      </form>

      <div className="mt-auto flex items-start gap-2.5 pt-10">
        <img src={fdic.url} alt="FDIC" className="mt-[3px] h-[18px] w-auto" />
        <p className="text-[15px] leading-[1.4] text-black">
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government
        </p>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye } from "lucide-react";
import { demoAuth } from "@/lib/demo-auth";
import { lovable } from "@/integrations/lovable/index";

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
  const [busy, setBusy] = useState(false);

  async function signInWithGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-3 pb-8">
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-full bg-[#f1f1f4] px-5 py-2 text-[15px] font-medium text-primary"
        >
          Help
        </button>
      </div>

      <p className="varo-wordmark mt-6 text-center text-[42px] leading-none text-primary">Varo</p>

      <form
        className="mt-14"
        onSubmit={async (e) => {
          e.preventDefault();
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
        <label htmlFor="identifier" className="block text-[14px] font-bold text-black">
          Email address
        </label>
        <input
          id="identifier"
          type="email"
          autoComplete="email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mt-2 h-[52px] w-full rounded-[6px] border border-primary px-3 text-[16px] text-black outline-none"
        />

        <label htmlFor="password" className="mt-5 block text-[14px] font-bold text-black">
          Password
        </label>
        <div className="mt-2 flex h-[52px] w-full items-center rounded-[6px] border border-[#8e8e93] px-3">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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

        {error ? (
          <p className="mt-3 text-[14px] text-[#c0392b]">{error}</p>
        ) : null}

        <button
          type="button"
          className="mt-4 text-[14px] text-primary underline underline-offset-2"
        >
          Forgot password
        </button>

        <button
          type="submit"
          disabled={busy}
          className="mt-6 h-[46px] w-full rounded-[6px] bg-primary text-[15px] font-medium text-white disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>

        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-[6px] border border-[#8e8e93] text-[15px] font-medium text-black"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <path
              fill="#4285F4"
              d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
            />
          </svg>
          Continue with Google
        </button>

        <Link
          to="/signup"
          className="mt-3 flex h-[46px] w-full items-center justify-center rounded-[6px] border border-primary text-[15px] font-medium text-primary"
        >
          Sign up
        </Link>
      </form>
    </div>
  );
}

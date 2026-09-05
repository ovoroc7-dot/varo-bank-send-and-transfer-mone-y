import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye } from "lucide-react";
import { demoAuth } from "@/lib/demo-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Varo" },
      {
        name: "description",
        content: "Log in to Varo with your email address or phone number and password.",
      },
      { property: "og:title", content: "Log in — Varo" },
      { property: "og:description", content: "Log in to your Varo account." },
    ],
  }),
  component: LoginScreen,
});

const DEMO_EMAIL = "joannjuckett@gmail.com";
const DEMO_PASSWORD = "JerseyGirl@1959";

function LoginScreen() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

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
        onSubmit={(e) => {
          e.preventDefault();
          if (
            identifier.trim().toLowerCase() === DEMO_EMAIL &&
            password === DEMO_PASSWORD
          ) {
            setError(false);
            demoAuth.login();
            navigate({ to: "/", replace: true });
          } else {
            setError(true);
          }
        }}
      >
        <label htmlFor="identifier" className="block text-[14px] font-bold text-black">
          Email address or phone number
        </label>
        <input
          id="identifier"
          type="text"
          autoComplete="off"
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
            autoComplete="off"
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
          <p className="mt-3 text-[14px] text-[#c0392b]">
            That email address or password doesn't match our records.
          </p>
        ) : null}

        <button
          type="button"
          className="mt-4 text-[14px] text-primary underline underline-offset-2"
        >
          Forgot password
        </button>

        <button
          type="submit"
          className="mt-6 h-[46px] w-full rounded-[6px] bg-primary text-[15px] font-medium text-white"
        >
          Log in
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

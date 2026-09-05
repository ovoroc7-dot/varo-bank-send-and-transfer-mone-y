import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/varo/signup-hero.png.asset.json";

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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const ready = email.trim() !== "" && phone.trim() !== "";

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

      <form className="px-4 pt-6" onSubmit={(e) => e.preventDefault()}>
        <p className="text-[17px] leading-[1.35] text-black">
          Enter the phone number and email you'll use for your Varo Bank Account.
        </p>

        <label htmlFor="email" className="mt-6 block text-[14px] font-bold text-black">
          Email
        </label>
        <input
          id="email"
          type="email"
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 h-[52px] w-full rounded-[6px] border border-[#8e8e93] px-3 text-[16px] text-black outline-none"
        />

        <button
          type="submit"
          disabled={!ready}
          className="mt-6 h-[52px] w-full rounded-[6px] bg-[#e6e8ec] text-[16px] text-[#8b8b90] disabled:cursor-not-allowed enabled:bg-primary enabled:text-white"
        >
          Open an account
        </button>
      </form>
    </div>
  );
}

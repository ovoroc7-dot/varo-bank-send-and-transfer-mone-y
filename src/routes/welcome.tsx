import { createFileRoute, Link } from "@tanstack/react-router";
import welcomePhoneCard from "@/assets/varo/welcome-phone-card.png";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to Varo — Free bank account" },
      {
        name: "description",
        content: "Get ahead with a free Varo Bank Account, early pay, savings and credit tools.",
      },
      { property: "og:title", content: "Welcome to Varo — Free bank account" },
      {
        property: "og:description",
        content: "Get ahead with a free bank account, early pay, savings and credit tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WelcomeScreen,
});

function WelcomeScreen() {
  return (
    <main className="flex min-h-dvh flex-col bg-[#eee8ff] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(28px,env(safe-area-inset-top))] text-[#42105f]">
      <p className="varo-wordmark text-[50px] leading-none text-primary">Varo</p>

      <div className="mt-3 flex min-h-0 flex-1 flex-col items-center">
        <img
          src={welcomePhoneCard}
          alt="A mobile banking dashboard with a purple debit card"
          width={1024}
          height={1024}
          className="h-auto w-full max-w-[330px] object-contain"
        />

        <div className="mt-auto w-full text-center">
          <h1 className="varo-title mx-auto max-w-[390px] text-[38px] leading-[0.96] text-[#42105f] sm:text-[42px]">
            GET AHEAD WITH A FREE BANK ACCOUNT
          </h1>
          <p className="mx-auto mt-5 max-w-[370px] text-[17px] leading-[1.45] text-[#42105f]">
            Plus get paid early, borrow cash when you need it, build credit, and save. Quals
            apply.
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <Link
          to="/signup"
          className="flex h-[54px] w-full items-center justify-center rounded-[6px] bg-primary text-[18px] font-bold text-white"
        >
          Sign up
        </Link>
        <Link
          to="/login"
          className="flex h-[54px] w-full items-center justify-center rounded-[6px] border-2 border-primary text-[18px] font-bold text-primary"
        >
          Log in
        </Link>
        <p className="text-center text-[13px] text-black">
          Optional services have fees. <span className="font-semibold text-primary underline">Disclosures</span>
        </p>
      </div>
    </main>
  );
}
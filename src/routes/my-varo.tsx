import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Chevron, Divider } from "@/components/varo/ui";
import { demoAuth } from "@/lib/demo-auth";

export const Route = createFileRoute("/my-varo")({
  head: () => ({
    meta: [
      { title: "My Varo — Account settings" },
      {
        name: "description",
        content:
          "Manage your personal details, notification settings, cards and accounts, statements and support in My Varo.",
      },
      { property: "og:title", content: "My Varo — Account settings" },
      {
        property: "og:description",
        content: "Personal details, notifications, cards, statements, disputes and support.",
      },
    ],
  }),
  component: MyVaroScreen,
});

const account = [
  { label: "Personal details", to: "/personal-details" },
  { label: "Notification settings", to: "/notification-settings" },
  { label: "Manage cards and accounts", to: "/manage-cards" },
] as const;

function MyVaroScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-card pb-6">
      <h1 className="varo-title px-4 pt-14 text-[27px]">MY VARO</h1>

      <div className="flex items-center gap-4 px-4 pt-8 pb-6">
        <span className="grid size-[46px] place-items-center rounded-full bg-[#123024] text-[16px] font-bold text-white">
          JJ
        </span>
        <span>
          <span className="block text-[17px] text-black">Joann Juckett</span>
          <span className="block text-[14px] text-[#5f6065]">Joined July 2025</span>
        </span>
      </div>

      {account.map((item, i) => (
        <div key={item.label}>
          {i > 0 ? <Divider /> : null}
          <Link to={item.to} className="flex w-full items-center px-4 py-5 text-left">
            <span className="flex-1 text-[17px] text-black">{item.label}</span>
            <Chevron />
          </Link>
        </div>
      ))}
      <Divider />
      <button type="button" className="flex w-full items-center px-4 py-5 text-left">
        <span className="flex-1 text-[17px] text-black">Statements and documents</span>
        <Chevron />
      </button>
      <Divider />
      <button type="button" className="flex w-full items-center gap-3 px-4 py-5 text-left">
        <span className="flex-1 text-[17px] text-black">Invite friends</span>
        <span className="rounded-[7px] bg-lime px-2 py-1 text-[14px] text-black">Get $100</span>
        <Chevron />
      </button>

      <div className="h-3 bg-surface" />

      <p className="px-4 pt-5 pb-3 text-[15px] font-bold text-black">Help</p>
      <button type="button" className="flex w-full items-center gap-3 px-4 py-5 text-left">
        <span className="flex-1 text-[17px] text-black">Help and support</span>
        <span className="rounded-[7px] bg-[#c7edd3] px-2 py-1 text-[14px] text-black">
          Chat Available
        </span>
        <Chevron />
      </button>
      <Divider />
      <button type="button" className="flex w-full items-center px-4 py-5 text-left">
        <span className="flex-1 text-[17px] text-black">Disputes</span>
        <Chevron />
      </button>
      <Divider />
      <button type="button" className="flex w-full items-center px-4 py-5 text-left">
        <span className="flex-1 text-[17px] text-black">Legal and privacy</span>
        <Chevron />
      </button>

      <button
        type="button"
        onClick={() => {
          demoAuth.logout();
          navigate({ to: "/", replace: true });
        }}
        className="mx-4 mt-6 block w-[calc(100%-2rem)] rounded-[8px] bg-primary py-4 text-[15px] font-bold text-white"
      >
        Log out
      </button>
    </div>
  );
}


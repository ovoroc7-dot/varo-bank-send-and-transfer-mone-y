import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { BackHeader } from "@/components/varo/back-header";

export const Route = createFileRoute("/manage-cards")({
  head: () => ({
    meta: [
      { title: "Manage cards and accounts — Varo" },
      {
        name: "description",
        content: "See your Varo account numbers, manage your Varo cards and link external cards and accounts.",
      },
      { property: "og:title", content: "Manage cards and accounts — Varo" },
      {
        property: "og:description",
        content: "Account numbers, Varo cards and linked cards and accounts.",
      },
    ],
  }),
  component: ManageCardsScreen,
});

const rows = [
  { label: "Account numbers", to: "/account-numbers" },
  { label: "Varo cards", to: "/varo-cards" },
  { label: "Linked cards and accounts", to: "/linked-cards" },
] as const;

function ManageCardsScreen() {
  return (
    <div className="min-h-screen bg-white pb-10">
      <BackHeader title="Manage cards and accounts" />
      {rows.map((r) => (
        <Link key={r.label} to={r.to} className="mx-4 flex items-center border-b border-border py-5">
          <span className="flex-1 text-[17px] text-black">{r.label}</span>
          <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
        </Link>
      ))}
    </div>
  );
}

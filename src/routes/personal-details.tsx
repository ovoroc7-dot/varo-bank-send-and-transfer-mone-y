import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, ChevronRight, UserRound } from "lucide-react";
import { useProfile } from "@/lib/demo-auth";
import { BackHeader, Toggle } from "@/components/varo/back-header";

export const Route = createFileRoute("/personal-details")({
  head: () => ({
    meta: [
      { title: "Personal details — Varo" },
      {
        name: "description",
        content: "View and edit your name, home address, phone number and email address on Varo.",
      },
      { property: "og:title", content: "Personal details — Varo" },
      {
        property: "og:description",
        content: "Name, home address, phone number, email address, password and Face ID.",
      },
    ],
  }),
  component: PersonalDetailsScreen,
});

function PersonalDetailsScreen() {
  const [faceId, setFaceId] = useState(true);
  const p = useProfile();
  const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "—";
  const addr = [[p?.street, p?.apt].filter(Boolean).join(", "), p?.city, [p?.state, p?.zip].filter(Boolean).join(" "), p?.street ? "US" : ""].filter(Boolean).join(", ") || "—";
  const phone = p?.phone ? `+1 ${p.phone}` : "—";

  return (
    <div className="min-h-screen bg-white pb-10">
      <BackHeader title="Personal details" />

      <div className="flex flex-col items-center pt-4">
        <span className="grid size-[150px] place-items-center rounded-full bg-[#ece0fb]">
          <UserRound className="size-[86px] text-primary" strokeWidth={1.6} />
        </span>
        <button type="button" className="mt-4 text-[15px] font-bold text-primary">
          Upload photo
        </button>
      </div>

      <div className="mt-6">
        <Field label="Name" value={name} />
        <Field label="Home address" value={addr} edit />
        <Field label="Phone number" value={phone} edit />
        <Field label="Email address" value={p?.email ?? "—"} edit />
      </div>

      <p className="px-4 pt-6 pb-2 text-[15px] font-bold text-black">Security</p>
      <button type="button" className="flex w-full items-center border-b border-border px-4 py-5 text-left">
        <span className="flex-1 text-[17px] text-black">Change password</span>
        <ChevronRight className="size-[22px] text-black" strokeWidth={2.4} />
      </button>
      <div className="flex items-center px-4 py-5">
        <span className="flex-1 text-[17px] text-black">Face ID</span>
        <Toggle on={faceId} onChange={setFaceId} label="Face ID" />
      </div>
    </div>
  );
}

function Field({ label, value, edit }: { label: string; value: string; edit?: boolean }) {
  return (
    <div className="mx-4 flex items-start gap-3 border-b border-border py-4">
      <div className="flex-1">
        <p className="text-[13px] text-[#5f6065]">{label}</p>
        <p className="mt-1 text-[16px] leading-[1.35] text-black">{value}</p>
      </div>
      {edit ? (
        <button type="button" aria-label={`Edit ${label}`} className="pt-4">
          <Pencil className="size-[18px] text-black" strokeWidth={1.8} />
        </button>
      ) : null}
    </div>
  );
}

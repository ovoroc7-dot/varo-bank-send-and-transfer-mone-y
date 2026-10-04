import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { removeAvatar, uploadAvatar, useAvatarUrl } from "@/lib/avatar";
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
  const avatar = useAvatarUrl();
  const fileRef = useRef<HTMLInputElement>(null);
  const [sheet, setSheet] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const onFile = async (file?: File) => {
    if (!file) return;
    setSheet(false);
    setBusy(true);
    setMsg(null);
    const err = await uploadAvatar(file);
    setBusy(false);
    setMsg(err ?? "Profile photo updated");
  };
  const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "—";
  const addr = [[p?.street, p?.apt].filter(Boolean).join(", "), p?.city, [p?.state, p?.zip].filter(Boolean).join(" "), p?.street ? "US" : ""].filter(Boolean).join(", ") || "—";
  const phone = p?.phone ? `+1 ${p.phone}` : "—";

  return (
    <div className="min-h-screen bg-white pb-10">
      <BackHeader title="Personal details" />

      <div className="flex flex-col items-center pt-4">
        <button type="button" onClick={() => setSheet(true)} aria-label="Change profile photo" className="relative">
          <span className="grid size-[150px] place-items-center overflow-hidden rounded-full bg-[#ece0fb]">
            {avatar ? (
              <img src={avatar} alt="Profile photo" className="size-full object-cover" />
            ) : (
              <UserRound className="size-[86px] text-primary" strokeWidth={1.6} />
            )}
            {busy ? (
              <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40">
                <Loader2 className="size-8 animate-spin text-white" />
              </span>
            ) : null}
          </span>
          <span className="absolute right-1 bottom-1 grid size-10 place-items-center rounded-full border-4 border-white bg-primary">
            <Camera className="size-4 text-white" />
          </span>
        </button>
        <button type="button" onClick={() => setSheet(true)} className="mt-4 text-[15px] font-bold text-primary">
          {avatar ? "Change photo" : "Upload photo"}
        </button>
        {msg ? <p className="mt-2 text-[13px] text-[#5f6065]">{msg}</p> : null}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {sheet ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setSheet(false)}>
          <div className="mx-auto w-full max-w-[430px] rounded-t-[16px] bg-white px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto h-1 w-10 rounded-full bg-[#d6d9dd]" />
            <p className="pt-4 pb-2 text-center text-[17px] font-bold text-black">Profile photo</p>
            <button type="button" onClick={() => { if (fileRef.current) { fileRef.current.setAttribute("capture", "user"); fileRef.current.click(); } }} className="w-full border-b border-border py-4 text-left text-[17px] text-black">Take photo</button>
            <button type="button" onClick={() => { if (fileRef.current) { fileRef.current.removeAttribute("capture"); fileRef.current.click(); } }} className="w-full border-b border-border py-4 text-left text-[17px] text-black">Choose from library</button>
            {avatar ? (
              <button type="button" onClick={async () => { setSheet(false); const e = await removeAvatar(); setMsg(e ?? "Profile photo removed"); }} className="w-full border-b border-border py-4 text-left text-[17px] text-[#c0392b]">Remove photo</button>
            ) : null}
            <button type="button" onClick={() => setSheet(false)} className="mt-3 h-[52px] w-full rounded-[8px] bg-[#eceef1] text-[16px] font-bold text-black">Cancel</button>
          </div>
        </div>
      ) : null}

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

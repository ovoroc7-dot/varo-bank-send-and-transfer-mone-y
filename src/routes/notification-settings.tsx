import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BackHeader, Toggle } from "@/components/varo/back-header";

export const Route = createFileRoute("/notification-settings")({
  head: () => ({
    meta: [
      { title: "Notification settings — Varo" },
      {
        name: "description",
        content: "Choose which marketing and transactional notifications Varo sends by email and push.",
      },
      { property: "og:title", content: "Notification settings — Varo" },
      {
        property: "og:description",
        content: "Marketing and transactional notification preferences for email and push.",
      },
    ],
  }),
  component: NotificationSettingsScreen,
});

function NotificationSettingsScreen() {
  const [marketingEmail, setMarketingEmail] = useState(true);
  const [marketingPush, setMarketingPush] = useState(true);
  const [txPush, setTxPush] = useState(true);

  return (
    <div className="min-h-screen bg-white pb-10">
      <BackHeader title="Notification settings" />

      <p className="px-4 pt-4 text-[15px] font-bold text-black">Marketing notifications</p>
      <p className="mt-2 px-4 text-[15px] leading-[1.4] text-black">
        Get personalized info, offers, product news, research opportunities, and our newsletter.
      </p>
      <Row label="Email" on={marketingEmail} onChange={setMarketingEmail} />
      <Row label="Push" on={marketingPush} onChange={setMarketingPush} />

      <div className="h-3 bg-surface" />

      <p className="px-4 pt-5 text-[15px] font-bold text-black">Transactional notifications</p>
      <p className="mt-2 px-4 text-[15px] leading-[1.4] text-black">
        Get notified about account activity and transactions.
      </p>
      <Row label="Push" on={txPush} onChange={setTxPush} />
    </div>
  );
}

function Row({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="mx-4 mt-4 flex items-center border-b border-border pb-4">
      <span className="flex-1 text-[17px] text-black">{label}</span>
      <Toggle on={on} onChange={onChange} label={label} />
    </div>
  );
}

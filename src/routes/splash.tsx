import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import fdic from "@/assets/varo/fdic.png.asset.json";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "Varo — Welcome" },
      {
        name: "description",
        content: "Opening Varo. FDIC-Insured — backed by the full faith and credit of the U.S. Government.",
      },
      { property: "og:title", content: "Varo — Welcome" },
      { property: "og:description", content: "Opening the Varo banking app." },
    ],
  }),
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/", replace: true }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-8">
      <p className="varo-wordmark text-[74px] leading-none text-white">Varo</p>
      <div className="mt-3 flex items-start gap-2">
        <img src={fdic.url} alt="FDIC" className="mt-[2px] h-[13px] w-auto" />
        <p className="max-w-[210px] text-[11px] leading-[1.35] text-white/85 italic">
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government
        </p>
      </div>
    </div>
  );
}

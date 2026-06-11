import HudBar from "@/components/HudBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <HudBar />
      {children}
    </div>
  );
}

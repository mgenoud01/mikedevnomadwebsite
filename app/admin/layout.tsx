export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-inter)", minHeight: "100vh", background: "#0d1117" }}>
      {children}
    </div>
  );
}

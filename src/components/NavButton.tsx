export default function NavButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline";
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium shadow-sm transition ${
        variant === "outline"
          ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

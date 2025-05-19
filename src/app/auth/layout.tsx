export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      {children}
    </div>
  );
} 
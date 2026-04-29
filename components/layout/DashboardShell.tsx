"use client";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pt-[72px]">
      {children}
    </div>
  );
}

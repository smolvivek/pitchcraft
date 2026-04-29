import { DashboardShell } from "@/components/layout/DashboardShell"

export default function DashboardLoading() {
  return (
    <>
      {/* Top scan bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] overflow-hidden bg-white/5">
        <div className="h-full bg-white/60 animate-scan-right origin-left" />
      </div>

      <DashboardShell>
        <div className="max-w-[960px] mx-auto px-[24px] py-[48px]">
          {/* Header skeleton */}
          <div className="flex items-end justify-between gap-[24px] mb-[32px]">
            <div>
              <div className="h-[10px] w-[64px] bg-surface animate-pulse mb-[12px]" />
              <div className="h-[36px] w-[240px] bg-surface animate-pulse" />
            </div>
          </div>

          <div className="h-[1px] bg-border mb-[4px]" />

          {/* Card skeletons */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="py-[20px] border-b border-border"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-baseline justify-between mb-[8px]">
                <div className="flex items-baseline gap-[10px]">
                  <div className="h-[12px] w-[24px] bg-surface animate-pulse" />
                  <div className="h-[20px] w-[180px] bg-surface animate-pulse" />
                </div>
                <div className="h-[14px] w-[60px] bg-surface animate-pulse" />
              </div>
              <div className="h-[13px] w-[300px] bg-surface animate-pulse ml-[34px] mb-[10px]" />
              <div className="flex gap-[16px] ml-[34px]">
                <div className="h-[12px] w-[56px] bg-surface animate-pulse" />
                <div className="h-[12px] w-[72px] bg-surface animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </DashboardShell>
    </>
  )
}

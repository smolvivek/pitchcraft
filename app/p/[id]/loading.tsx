export default function PitchLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top scan bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] overflow-hidden bg-white/5">
        <div className="h-full bg-white/60 animate-scan-right origin-left" />
      </div>

      {/* Topbar skeleton */}
      <div className="fixed top-0 w-full h-[76px] bg-background/90 border-b border-white/5 z-50" />

      {/* Hero skeleton — full viewport */}
      <div className="min-h-screen bg-[#0e0e0e] flex flex-col justify-end px-[48px] md:px-[96px] pb-[96px]">
        <div className="max-w-[1200px] space-y-[32px]">
          <div className="h-[12px] w-[120px] bg-surface animate-pulse" />
          <div className="h-[clamp(48px,12vw,180px)] w-[80%] bg-surface animate-pulse" />
          <div className="grid grid-cols-12 gap-[32px] pt-[48px] border-t border-white/10">
            <div className="col-span-12 md:col-span-4">
              <div className="h-[10px] w-[64px] bg-surface animate-pulse mb-[12px]" />
              <div className="h-[22px] w-[140px] bg-surface animate-pulse" />
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="h-[22px] w-full bg-surface animate-pulse mb-[8px]" />
              <div className="h-[22px] w-[70%] bg-surface animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

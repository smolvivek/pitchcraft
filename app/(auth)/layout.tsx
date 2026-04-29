export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-[24px] py-[40px] relative overflow-hidden">

      {/* Bottom-right: Pitchcraft wordmark */}
      <div className="absolute bottom-[32px] right-[32px]" aria-hidden="true">
        <span className="font-heading italic font-bold text-[13px] tracking-tighter text-text-disabled uppercase">
          Pitchcraft
        </span>
      </div>

      {/* Form */}
      <div className="w-full max-w-[400px] relative">
        {children}
      </div>
    </div>
  );
}

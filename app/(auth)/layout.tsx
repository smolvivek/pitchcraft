export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[16px] py-[40px]">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-[32px]">
          <h1 className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary">
            Pitchcraft
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}

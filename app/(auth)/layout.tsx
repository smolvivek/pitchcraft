"use client";

import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[16px] py-[40px] relative overflow-hidden">

      {/* Ambient geometric shapes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large circle — top-right, drifts */}
        <div
          className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-border"
          style={{
            opacity: mounted ? 0.12 : 0,
            transition: "opacity 2s ease-out",
            animation: mounted ? "auth-orbit-1 20s ease-in-out infinite" : "none",
          }}
        />
        {/* Small accent circle — bottom-left */}
        <div
          className="absolute bottom-[15%] left-[8%] w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-full border border-pop/15"
          style={{
            opacity: mounted ? 0.15 : 0,
            transition: "opacity 2s ease-out 0.3s",
            animation: mounted ? "auth-orbit-2 15s ease-in-out infinite" : "none",
          }}
        />
        {/* Thin horizontal line */}
        <div
          className="absolute top-[40%] left-[5%] w-[80px] md:w-[150px] h-[1px] bg-border"
          style={{
            opacity: mounted ? 0.15 : 0,
            transition: "opacity 2s ease-out 0.6s",
            animation: mounted ? "auth-drift 12s ease-in-out infinite" : "none",
          }}
        />
        {/* Small dot */}
        <div
          className="absolute top-[30%] right-[25%] w-[6px] h-[6px] rounded-full bg-pop"
          style={{
            opacity: mounted ? 0.2 : 0,
            transition: "opacity 1.5s ease-out 0.8s",
            animation: mounted ? "auth-orbit-2 18s ease-in-out infinite reverse" : "none",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes auth-orbit-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 15px); }
        }
        @keyframes auth-orbit-2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(15px, -10px); }
          66% { transform: translate(-10px, 15px); }
        }
        @keyframes auth-drift {
          0%, 100% { transform: translateX(0) scaleX(1); }
          50% { transform: translateX(30px) scaleX(1.2); }
        }
      `}</style>

      <div className="w-full max-w-[400px] relative">
        {/* Logo with entrance animation */}
        <div
          className="text-center mb-[32px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-16px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h1 className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary">
            Pitchcraft
          </h1>
        </div>

        {/* Form card with scale-up entrance */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

import type { HTMLAttributes, ReactNode } from "react";
import { MonoText } from "./MonoText";
import { Badge, type StatusType } from "./Badge";

/* ── Generic Card ── */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-[4px] p-[24px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Pitch Card ── */

interface PitchCardProps {
  title: string;
  subtitle?: string;
  status: StatusType;
  genre?: string;
  budget?: string;
  version?: number;
  updatedAt?: string;
}

function PitchCard({ title, subtitle, status, genre, budget, version, updatedAt }: PitchCardProps) {
  return (
    <Card className="card-hover cursor-pointer group">
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-start justify-between">
          <h3 className="font-heading text-[18px] font-semibold leading-[28px] text-text-primary group-hover:text-pop transition-colors duration-[200ms]">
            {title}
          </h3>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="mt-[6px] text-text-disabled group-hover:text-text-secondary group-hover:translate-x-[2px] transition-all duration-[200ms] flex-shrink-0 ml-[12px]"
          >
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {subtitle && (
          <p className="text-[14px] leading-[20px] text-text-secondary line-clamp-2">
            {subtitle}
          </p>
        )}
        <Badge status={status} />
        <div className="flex flex-wrap items-center gap-[16px] mt-[4px]">
          {genre && <MonoText>{genre}</MonoText>}
          {budget && <MonoText>{budget}</MonoText>}
          {version !== undefined && <MonoText>v{version}</MonoText>}
          {updatedAt && <MonoText>{updatedAt}</MonoText>}
        </div>
      </div>
    </Card>
  );
}

export { Card, PitchCard };
export type { CardProps, PitchCardProps };

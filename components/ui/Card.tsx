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
      className={`bg-white border border-border rounded-[4px] p-[24px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Pitch Card ── */

interface PitchCardProps {
  title: string;
  status: StatusType;
  genre?: string;
  budget?: string;
  version?: number;
  updatedAt?: string;
}

function PitchCard({ title, status, genre, budget, version, updatedAt }: PitchCardProps) {
  return (
    <Card className="hover:bg-surface transition-colors duration-[200ms] ease-out cursor-pointer">
      <div className="flex flex-col gap-[8px]">
        <h3 className="font-heading text-[18px] font-semibold leading-[28px] text-text-primary">
          {title}
        </h3>
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

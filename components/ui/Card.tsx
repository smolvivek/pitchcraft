'use client'

import type { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { MonoText } from "./MonoText";
import { Badge, type StatusType } from "./Badge";
import { DuplicatePitchButton } from "./DuplicatePitchButton";
import { DeletePitchButton } from "./DeletePitchButton";

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
  pitchId?: string;
  title: string;
  subtitle?: string;
  status: StatusType;
  genre?: string;
  budget?: string;
  version?: number;
  updatedAt?: string;
  shareUrl?: string;
  editHref?: string;
}

function PitchCard({ pitchId, title, subtitle, status, genre, budget, version, updatedAt, shareUrl, editHref }: PitchCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inner = (
    <div className="group py-[24px] border-b border-border cursor-pointer">
      <div className="flex items-start justify-between gap-[24px] mb-[6px]">
        <h3 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary group-hover:text-pop transition-colors duration-[150ms]">
          {title}
        </h3>
        <div className="flex items-center gap-[12px] shrink-0">
          {pitchId && <DuplicatePitchButton pitchId={pitchId} />}
          {pitchId && <DeletePitchButton pitchId={pitchId} pitchName={title} />}
          {shareUrl && (
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy share link"
              className="text-text-disabled hover:text-text-primary transition-colors duration-[150ms] p-[4px]"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
          <Badge status={status} />
        </div>
      </div>
      {subtitle && (
        <p className="text-[13px] leading-[20px] text-text-secondary line-clamp-1 mb-[10px]">
          {subtitle}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-[16px]">
        {genre && <MonoText>{genre}</MonoText>}
        {budget && <MonoText>{budget}</MonoText>}
        {version !== undefined && <MonoText>v{version}</MonoText>}
        {updatedAt && <MonoText>{updatedAt}</MonoText>}
      </div>
    </div>
  );

  if (editHref) {
    return <Link href={editHref}>{inner}</Link>;
  }

  return inner;
}

export { Card, PitchCard };
export type { CardProps, PitchCardProps };

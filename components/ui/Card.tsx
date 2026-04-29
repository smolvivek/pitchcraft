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
      className={`bg-surface border border-border rounded-none p-[24px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Pitch Card ── */

interface PitchCardProps {
  pitchId?: string;
  index?: number;
  title: string;
  subtitle?: string;
  status: StatusType;
  genre?: string;
  budget?: string;
  version?: number;
  updatedAt?: string;
  shareUrl?: string;
  editHref?: string;
  projectType?: string;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  fiction: 'Fiction',
  documentary: 'Doc',
  ad_film: 'Ad Film',
  music_video: 'Music Video',
}

function PitchCard({ pitchId, index, title, subtitle, status, genre, budget, version, updatedAt, shareUrl, editHref, projectType }: PitchCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!shareUrl) return;
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(false);
    });
  };

  const num = index !== undefined ? String(index + 1).padStart(2, "0") : null;

  const inner = (
    <div className="group py-[20px] border-b border-border cursor-pointer">
      {/* Title row */}
      <div className="flex items-baseline justify-between gap-[24px] mb-[6px]">
        <div className="flex items-baseline gap-[10px] min-w-0">
          {num && (
            <span className="font-mono text-[11px] leading-[20px] text-text-disabled shrink-0">
              {num} /
            </span>
          )}
          <h3 className="font-heading italic text-[22px] leading-[28px] text-text-primary group-hover:text-pop transition-colors duration-[150ms] truncate">
            {title}
          </h3>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-[12px] shrink-0">
          {pitchId && <DuplicatePitchButton pitchId={pitchId} />}
          {pitchId && <DeletePitchButton pitchId={pitchId} pitchName={title} />}
          {shareUrl && (
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy share link"
              aria-label="Copy share link"
              className="text-text-disabled hover:text-text-primary transition-colors duration-[150ms] p-[4px]"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Logline */}
      {subtitle && (
        <p className="text-[13px] leading-[20px] text-text-secondary line-clamp-1 mb-[10px] pl-[32px]">
          {subtitle}
        </p>
      )}

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-[16px] pl-[32px]">
        <Badge status={status} />
        {projectType && PROJECT_TYPE_LABELS[projectType] && (
          <MonoText>{PROJECT_TYPE_LABELS[projectType]}</MonoText>
        )}
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

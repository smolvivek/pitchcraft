"use client";

import { useState } from "react";
import type { OptionalSectionDef } from "@/lib/sections";

interface SidebarSection {
  id: string;
  label: string;
  completed: boolean;
}

interface SidebarProps {
  sections: SidebarSection[];
  optionalSections?: SidebarSection[];
  activeId: string;
  onSelect: (id: string) => void;
  allOptionalDefs?: OptionalSectionDef[];
  enabledKeys?: Set<string>;
  onToggleSection?: (key: string) => void;
  customSectionLabels?: Record<string, string>;
  className?: string;
}

function Sidebar({
  sections,
  optionalSections = [],
  activeId,
  onSelect,
  allOptionalDefs = [],
  enabledKeys = new Set(),
  onToggleSection,
  customSectionLabels = {},
  className = "",
}: SidebarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const hasMorePanel = allOptionalDefs.length > 0 && onToggleSection;

  return (
    <aside className={`w-[240px] bg-surface border-r border-border h-full overflow-y-auto py-[16px] flex flex-col ${className}`}>
      <div className="px-[16px] mb-[16px]">
        <span className="font-mono text-[13px] leading-[20px] text-text-secondary uppercase tracking-wider">
          Sections
        </span>
      </div>

      {/* Required sections (01–08) */}
      <ul className="flex flex-col" role="list">
        {sections.map((section, index) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                onClick={() => onSelect(section.id)}
                className={`
                  w-full flex items-center gap-[12px] px-[16px] py-[10px]
                  text-left text-[14px] leading-[20px]
                  transition-colors duration-[200ms] ease-out
                  cursor-pointer
                  ${
                    isActive
                      ? "border-l-2 border-pop text-text-primary font-medium bg-background"
                      : "border-l-2 border-transparent text-text-secondary hover:bg-background hover:text-text-primary"
                  }
                `}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="font-mono text-[13px] leading-[20px] text-text-disabled w-[20px] text-right shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate">{section.label}</span>
                <CompletionIndicator completed={section.completed} />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Enabled optional sections (09, 10, ...) */}
      {optionalSections.length > 0 && (
        <ul className="flex flex-col" role="list">
          {optionalSections.map((section, index) => {
            const isActive = section.id === activeId;
            const number = sections.length + index + 1;
            return (
              <li key={section.id}>
                <button
                  onClick={() => onSelect(section.id)}
                  className={`
                    w-full flex items-center gap-[12px] px-[16px] py-[10px]
                    text-left text-[14px] leading-[20px]
                    transition-colors duration-[200ms] ease-out
                    cursor-pointer
                    ${
                      isActive
                        ? "border-l-2 border-pop text-text-primary font-medium bg-background"
                        : "border-l-2 border-transparent text-text-secondary hover:bg-background hover:text-text-primary"
                    }
                  `}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="font-mono text-[13px] leading-[20px] text-text-disabled w-[20px] text-right shrink-0">
                    {String(number).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate">{section.label}</span>
                  <CompletionIndicator completed={section.completed} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Divider + More button */}
      {hasMorePanel && (
        <div className="mt-[8px]">
          <div className="mx-[16px] border-t border-border" />
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="w-full flex items-center justify-between px-[16px] py-[12px] text-[13px] leading-[20px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <span className="font-mono uppercase tracking-wider">More</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform duration-[200ms] ${moreOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Collapsible panel */}
          {moreOpen && (
            <div className="px-[16px] pb-[16px] flex flex-col gap-[4px]">
              {allOptionalDefs.map((def) => {
                const isEnabled = enabledKeys.has(def.key);
                return (
                  <label
                    key={def.key}
                    className="flex items-start gap-[8px] py-[6px] cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => onToggleSection!(def.key)}
                      className="mt-[2px] w-[14px] h-[14px] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] leading-[18px] text-text-primary group-hover:text-pop transition-colors">
                        {def.label}
                      </span>
                      <p className="text-[11px] leading-[16px] text-text-disabled mt-[1px]">
                        {def.description}
                      </p>
                    </div>
                  </label>
                );
              })}

              {/* Custom sections */}
              {["custom_1", "custom_2", "custom_3"].map((key, i) => {
                const isEnabled = enabledKeys.has(key);
                const label = customSectionLabels[key] || `Custom Section ${i + 1}`;
                return (
                  <label
                    key={key}
                    className="flex items-start gap-[8px] py-[6px] cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => onToggleSection!(key)}
                      className="mt-[2px] w-[14px] h-[14px] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] leading-[18px] text-text-primary group-hover:text-pop transition-colors">
                        {label}
                      </span>
                      <p className="text-[11px] leading-[16px] text-text-disabled mt-[1px]">
                        Your own section. Name it anything.
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function CompletionIndicator({ completed }: { completed: boolean }) {
  return (
    <span className="w-[16px] h-[16px] shrink-0 flex items-center justify-center">
      {completed ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-label="Completed"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-status-complete" />
          <path
            d="M5 8L7 10L11 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-status-complete [stroke-dasharray:24] [stroke-dashoffset:0] animate-[draw-check_300ms_ease-out]"
          />
        </svg>
      ) : (
        <span className="w-[8px] h-[8px] rounded-full border border-border" aria-label="Incomplete" />
      )}
    </span>
  );
}

export { Sidebar };
export type { SidebarProps, SidebarSection };

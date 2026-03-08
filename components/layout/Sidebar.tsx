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
  tier?: string;
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
  tier = "free",
  className = "",
}: SidebarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const hasMorePanel = allOptionalDefs.length > 0 && onToggleSection;

  return (
    <aside className={`w-[240px] bg-surface border-r border-border h-full overflow-y-auto py-[16px] flex flex-col ${className}`}>
      <div className="px-[16px] pt-[8px] mb-[8px]" />

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
                <span className="font-mono text-[11px] leading-[20px] text-text-disabled w-[20px] text-right shrink-0">
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
                  <span className="font-mono text-[11px] leading-[20px] text-text-disabled w-[20px] text-right shrink-0">
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
            <span className="font-mono text-[10px] uppercase tracking-[0.1em]">More</span>
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

              {/* Custom sections — Pro/Studio only */}
              {tier === "free" ? (
                <div className="py-[8px]">
                  <p className="text-[12px] leading-[18px] text-text-disabled">
                    Custom sections are a{" "}
                    <a href="/pricing" className="text-link hover:underline">Pro feature</a>.
                  </p>
                </div>
              ) : (
                ["custom_1", "custom_2", "custom_3"].map((key, i) => {
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
                })
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function CompletionIndicator({ completed }: { completed: boolean }) {
  return (
    <span
      className="w-[5px] h-[5px] shrink-0 rounded-full"
      style={{
        background: completed ? 'var(--color-pop)' : 'transparent',
        border: completed ? 'none' : '1px solid var(--color-border)',
      }}
      aria-label={completed ? "Completed" : "Incomplete"}
    />
  );
}

export { Sidebar };
export type { SidebarProps, SidebarSection };

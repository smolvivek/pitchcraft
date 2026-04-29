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
    <aside className={`w-64 bg-[#0e0e0e] border-r border-white/5 h-full overflow-y-auto py-[14px] flex flex-col ${className}`}>

      {/* Required sections */}
      <ul className="flex flex-col" role="list">
        {sections.map((section, index) => {
          const isActive = section.id === activeId;
          const num = String(index + 1).padStart(2, "0");
          return (
            <li key={section.id}>
              <button
                onClick={() => onSelect(section.id)}
                className={`
                  w-full px-[16px] py-[12px] text-left flex items-center justify-between
                  font-bold uppercase tracking-[0.15em] text-[10px]
                  transition-colors duration-[150ms] ease-out cursor-pointer
                  ${isActive
                    ? "border-l-2 border-pop text-pop bg-white/5"
                    : "border-l-2 border-transparent text-text-disabled hover:text-text-primary hover:bg-white/[0.03]"
                  }
                `}
                aria-current={isActive ? "step" : undefined}
              >
                <span>{num} / {section.label}</span>
                {section.completed && (
                  <span className="text-text-disabled font-normal normal-case tracking-normal" aria-label="complete">✓</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Enabled optional sections */}
      {optionalSections.length > 0 && (
        <ul className="flex flex-col" role="list">
          {optionalSections.map((section, index) => {
            const isActive = section.id === activeId;
            const num = String(sections.length + index + 1).padStart(2, "0");
            return (
              <li key={section.id} className="relative group/opt">
                <button
                  onClick={() => onSelect(section.id)}
                  className={`
                    w-full px-[16px] py-[12px] pr-[28px] text-left
                    font-bold uppercase tracking-[0.15em] text-[10px]
                    transition-colors duration-[150ms] ease-out cursor-pointer
                    ${isActive
                      ? "border-l-2 border-pop text-pop bg-white/5"
                      : "border-l-2 border-transparent text-text-disabled hover:text-text-primary hover:bg-white/[0.03]"
                    }
                  `}
                  aria-current={isActive ? "step" : undefined}
                >
                  {num} / {section.label}
                </button>
                {onToggleSection && (
                  <button
                    type="button"
                    onClick={() => onToggleSection(section.id)}
                    className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] flex items-center justify-center text-[14px] text-text-disabled hover:text-error opacity-0 group-hover/opt:opacity-100 transition-opacity"
                    aria-label={`Remove ${section.label}`}
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* + Add section */}
      {hasMorePanel && (
        <div className="mt-[8px]">
          <div className="mx-[16px] border-t border-white/5" />
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="w-full flex items-center justify-between px-[16px] py-[12px] font-bold uppercase tracking-[0.15em] text-[10px] text-text-disabled hover:text-text-primary transition-colors cursor-pointer"
          >
            <span>+ Add section</span>
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

          {moreOpen && (
            <div className="px-[16px] pb-[16px] flex flex-col gap-[4px]">
              {allOptionalDefs.map((def) => {
                const isEnabled = enabledKeys.has(def.key);
                return (
                  <div key={def.key} className="flex items-start gap-[8px] py-[6px]">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold text-text-primary">
                        {def.label}
                      </span>
                      <p className="text-[10px] leading-[16px] text-text-disabled mt-[1px]">
                        {def.description}
                      </p>
                    </div>
                    {isEnabled ? (
                      <span className="shrink-0 font-mono text-[10px] leading-[18px] text-text-disabled mt-[1px]">
                        Added ✓
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleSection!(def.key)}
                        className="shrink-0 font-mono text-[10px] leading-[18px] text-pop hover:underline mt-[1px]"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}

              {tier === "free" ? (
                <div className="py-[8px]">
                  <p className="font-mono text-[10px] leading-[18px] text-text-disabled">
                    Custom sections are a{" "}
                    <a href="/pricing" className="text-pop hover:underline">Pro feature</a>.
                  </p>
                </div>
              ) : (
                ["custom_1", "custom_2", "custom_3"].map((key, i) => {
                  const isEnabled = enabledKeys.has(key);
                  const label = customSectionLabels[key] || `Custom Section ${i + 1}`;
                  return (
                    <div key={key} className="flex items-start gap-[8px] py-[6px]">
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold text-text-primary">
                          {label}
                        </span>
                        <p className="font-mono text-[10px] leading-[16px] text-text-disabled mt-[1px]">
                          Your own section. Name it anything.
                        </p>
                      </div>
                      {isEnabled ? (
                        <span className="shrink-0 font-mono text-[10px] leading-[18px] text-text-disabled mt-[1px]">
                          Added ✓
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleSection!(key)}
                          className="shrink-0 font-mono text-[10px] leading-[18px] text-pop hover:underline mt-[1px]"
                        >
                          + Add
                        </button>
                      )}
                    </div>
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

export { Sidebar };
export type { SidebarProps, SidebarSection };

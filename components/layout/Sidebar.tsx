"use client";

interface SidebarSection {
  id: string;
  label: string;
  completed: boolean;
}

interface SidebarProps {
  sections: SidebarSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

function Sidebar({ sections, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="w-[240px] bg-surface border-r border-border h-full overflow-y-auto py-[16px]">
      <div className="px-[16px] mb-[16px]">
        <span className="font-mono text-[13px] leading-[20px] text-text-secondary uppercase tracking-wider">
          Sections
        </span>
      </div>
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
                      ? "border-l-2 border-accent text-text-primary font-medium bg-background"
                      : "border-l-2 border-transparent text-text-secondary hover:bg-background hover:text-text-primary"
                  }
                `}
                aria-current={isActive ? "step" : undefined}
              >
                {/* Step number */}
                <span className="font-mono text-[13px] leading-[20px] text-text-disabled w-[20px] text-right shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Label */}
                <span className="flex-1 truncate">{section.label}</span>

                {/* Completion indicator */}
                <span className="w-[16px] h-[16px] shrink-0 flex items-center justify-center">
                  {section.completed ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-label="Completed"
                    >
                      <circle cx="8" cy="8" r="7" stroke="#388E3C" strokeWidth="1.5" fill="none" />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke="#388E3C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[stroke-dasharray:24] [stroke-dashoffset:0] animate-[draw-check_300ms_ease-out]"
                      />
                    </svg>
                  ) : (
                    <span className="w-[8px] h-[8px] rounded-full border border-border" aria-label="Incomplete" />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export { Sidebar };
export type { SidebarProps, SidebarSection };

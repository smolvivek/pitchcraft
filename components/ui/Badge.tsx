type StatusType = "development" | "production" | "completed";

interface BadgeProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; dotColor: string }> = {
  development: {
    label: "Development",
    dotColor: "bg-status-looking",
  },
  production: {
    label: "Production",
    dotColor: "bg-status-progress",
  },
  completed: {
    label: "Completed",
    dotColor: "bg-status-complete",
  },
};

function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];
  const isActive = status !== "completed";
  return (
    <span className="inline-flex items-center gap-[6px]">
      <span className="relative flex h-[8px] w-[8px]">
        {isActive && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${config.dotColor}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-[8px] w-[8px] ${config.dotColor}`}
          aria-hidden="true"
        />
      </span>
      <span className="font-[var(--font-mono)] text-[12px] leading-[16px] tracking-[0.02em] text-text-secondary uppercase">
        {config.label}
      </span>
    </span>
  );
}

export { Badge };
export type { BadgeProps, StatusType };

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
  return (
    <span className="inline-flex items-center gap-[6px]">
      <span
        className={`w-[8px] h-[8px] rounded-full ${config.dotColor}`}
        aria-hidden="true"
      />
      <span className="text-[14px] leading-[20px] text-text-primary">
        {config.label}
      </span>
    </span>
  );
}

export { Badge };
export type { BadgeProps, StatusType };

import { MonoText } from "./MonoText";

interface ProgressBarProps {
  current: number;
  goal: number;
  label?: string;
}

function ProgressBar({ current, goal, label }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="flex flex-col gap-[8px]">
      {label && (
        <span className="text-[14px] leading-[20px] text-text-secondary">{label}</span>
      )}
      <div className="w-full h-[8px] bg-surface rounded-full overflow-visible">
        <div
          className="h-full bg-accent rounded-full transition-[width] duration-[500ms]"
          style={{
            width: `${percentage}%`,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring with 5% overshoot
          }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={label || "Progress"}
        />
      </div>
      <div className="flex items-center justify-between">
        <MonoText>
          ${current.toLocaleString()} / ${goal.toLocaleString()}
        </MonoText>
        <MonoText>{percentage}%</MonoText>
      </div>
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps };

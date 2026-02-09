import type { HTMLAttributes, ReactNode } from "react";

interface MonoTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

function MonoText({ children, className = "", ...props }: MonoTextProps) {
  return (
    <span
      className={`font-mono text-[13px] leading-[20px] text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export { MonoText };
export type { MonoTextProps };

import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  narrow?: boolean;
}

function Container({ children, narrow = false, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`
        mx-auto w-full px-[16px] md:px-[32px]
        ${narrow ? "max-w-[680px]" : "max-w-[1280px]"}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps };

import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-btn text-background hover:bg-btn-hover active:bg-btn-active disabled:bg-border disabled:text-text-disabled hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100",
  secondary:
    "bg-transparent border border-border text-text-primary hover:bg-surface-hover hover:border-border-hover active:bg-surface active:scale-[0.98] disabled:text-text-disabled disabled:border-border disabled:hover:scale-100",
  tertiary:
    "bg-transparent text-link hover:underline active:text-pop-active disabled:text-text-disabled disabled:no-underline",
};

const sizeStyles: Record<ButtonVariant, string> = {
  primary: "px-[24px] py-[12px] text-[14px] font-semibold",
  secondary: "px-[24px] py-[12px] text-[14px] font-medium",
  tertiary: "px-[16px] py-[8px] text-[14px] font-medium",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          rounded-[4px] leading-[20px]
          transition-all duration-[200ms] ease-out
          transform-gpu
          cursor-pointer
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant };

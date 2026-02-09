import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-btn text-white hover:bg-accent-btn-hover active:bg-accent-btn-active disabled:bg-border disabled:text-text-disabled",
  secondary:
    "bg-transparent border border-border text-text-primary hover:bg-surface active:bg-[#E8E0D8] disabled:text-text-disabled disabled:border-border",
  tertiary:
    "bg-transparent text-accent-text hover:underline active:text-accent-btn-hover disabled:text-text-disabled disabled:no-underline",
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
          transition-colors duration-[200ms] ease-out
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

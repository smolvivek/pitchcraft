"use client";

import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

/* ── Text Input ── */

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helpText, id, className = "", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-[4px]">
        {label && (
          <label
            htmlFor={inputId}
            className="font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-error ml-[4px]">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-[16px] py-[12px]
            bg-surface border rounded-[4px]
            text-[14px] leading-[20px] text-text-primary
            font-[var(--font-body)]
            placeholder:text-text-disabled
            transition-colors duration-[200ms] ease-out
            disabled:bg-background disabled:text-text-disabled disabled:border-border
            ${error ? "border-2 border-error" : "border-border focus:border-2 focus:border-pop focus:px-[15px] focus:py-[11px]"}
            ${className}
          `}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-[14px] leading-[20px] text-error" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-[14px] leading-[20px] text-text-secondary">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

/* ── Textarea ── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, id, className = "", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-[4px]">
        {label && (
          <label
            htmlFor={inputId}
            className="font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-error ml-[4px]">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-[16px] py-[12px] min-h-[120px]
            bg-surface border rounded-[4px]
            text-[14px] leading-[24px] text-text-primary
            font-[var(--font-body)]
            placeholder:text-text-disabled
            resize-y
            transition-colors duration-[200ms] ease-out
            disabled:bg-background disabled:text-text-disabled disabled:border-border
            ${error ? "border-2 border-error" : "border-border focus:border-2 focus:border-pop focus:px-[15px] focus:py-[11px]"}
            ${className}
          `}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-[14px] leading-[20px] text-error" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-[14px] leading-[20px] text-text-secondary">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/* ── Select ── */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, helpText, options, placeholder, id, className = "", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-[4px]">
        {label && (
          <label
            htmlFor={inputId}
            className="font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-error ml-[4px]">*</span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full px-[16px] py-[12px] h-[44px]
            bg-surface border rounded-[4px]
            text-[14px] leading-[20px] text-text-primary
            font-[var(--font-body)]
            appearance-none
            bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23E8503A%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')]
            bg-[position:right_16px_center]
            bg-no-repeat
            pr-[40px]
            transition-colors duration-[200ms] ease-out
            hover:bg-surface-hover
            disabled:bg-background disabled:text-text-disabled disabled:border-border
            ${error ? "border-2 border-error" : "border-border focus:border-2 focus:border-pop focus:px-[15px] focus:py-[11px]"}
            ${className}
          `}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${inputId}-error`} className="text-[14px] leading-[20px] text-error" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-[14px] leading-[20px] text-text-secondary">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

/* ── Checkbox ── */

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className={`flex items-center gap-[8px] ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className="
            w-[20px] h-[20px] rounded-[4px]
            border-2 border-border
            accent-pop
            cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
          "
          {...props}
        />
        <label
          htmlFor={inputId}
          className="text-[14px] leading-[20px] text-text-primary cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { TextInput, Textarea, SelectInput, Checkbox };
export type { TextInputProps, TextareaProps, SelectInputProps, CheckboxProps, SelectOption };

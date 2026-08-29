import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "gold" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5 font-semibold",
      icon: "p-2 aspect-square",
    };

    const variantStyles = {
      primary:
        "bg-brand-crimson hover:bg-brand-crimsonLight text-white font-semibold shadow-lg shadow-brand-crimson/25 focus:ring-brand-crimson",
      secondary:
        "bg-surface-elevated hover:bg-surface-50 text-gray-200 hover:text-white border border-surface-border hover:border-surface-borderLight focus:ring-surface-borderLight",
      danger:
        "bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg shadow-red-600/25 focus:ring-red-500",
      gold:
        "bg-brand-gold hover:bg-amber-400 text-black font-semibold shadow-lg shadow-brand-gold/25 focus:ring-brand-gold",
      ghost:
        "bg-transparent hover:bg-surface-elevated text-gray-300 hover:text-white focus:ring-surface-border",
      outline:
        "bg-transparent border border-surface-border hover:border-brand-crimson/60 text-gray-200 hover:text-white focus:ring-brand-crimson",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

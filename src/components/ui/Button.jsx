import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg",
    secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 border border-secondary-200",
    outline: "border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500",
    success: "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-md hover:shadow-lg",
    warning: "bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-md hover:shadow-lg",
    error: "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-md hover:shadow-lg",
    gradient: "bg-gradient-primary text-white hover:opacity-90 focus:ring-primary-500 shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className={cn("animate-spin mr-2", iconSizes[size])}>
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      {leftIcon && !loading && (
        <span className={cn("mr-2", iconSizes[size])}>
          {leftIcon}
        </span>
      )}
      
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      
      {rightIcon && !loading && (
        <span className={cn("ml-2", iconSizes[size])}>
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button; 
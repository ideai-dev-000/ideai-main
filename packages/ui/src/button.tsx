import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
      default: "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary",
      outline: "border border-foreground/20 bg-transparent hover:bg-foreground/5 focus:ring-foreground/20",
      ghost: "hover:bg-foreground/5 focus:ring-foreground/20",
    }

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-11 px-8 text-lg",
    }

    return <button ref={ref} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  },
)

Button.displayName = "Button"

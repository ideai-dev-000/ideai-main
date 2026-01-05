"use client"

/**
 * Example: Using the Utils Package
 *
 * Shows how to use @repo/utils in different scenarios
 */

import { cn, formatCurrency, formatDate, formatNumber } from "@repo/utils"
import { userSchema, emailSchema } from "@repo/utils/validation"

// Example 1: Combining Tailwind classes with cn()
export function Button({ variant, className }: { variant?: "primary" | "secondary"; className?: string }) {
  return (
    <button
      className={cn(
        // Base styles
        "px-4 py-2 rounded-lg font-medium transition-colors",
        // Conditional styles
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
        // User override
        className,
      )}
    >
      Click me
    </button>
  )
}

// Example 2: Formatting utilities
export function ProductCard({ price, updatedAt }: { price: number; updatedAt: Date }) {
  return (
    <div>
      <p>Price: {formatCurrency(price)}</p>
      <p>Updated: {formatDate(updatedAt, "PPP")}</p>
      <p>Views: {formatNumber(1234567)}</p>
    </div>
  )
}

// Example 3: Form validation with Zod
export function SignupForm() {
  const handleSubmit = (data: unknown) => {
    // Validate user data
    const result = userSchema.safeParse(data)

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten())
      return
    }

    // Type-safe data
    const user = result.data
    console.log("Valid user:", user)
  }

  return <form onSubmit={(e) => handleSubmit(e)}>{/* form fields */}</form>
}

// Example 4: Email validation
export function validateEmail(email: string): boolean {
  const result = emailSchema.safeParse(email)
  return result.success
}

// Example 5: Combining utilities in a real component
export function PriceCard({
  price,
  discount,
  updatedAt,
  featured,
}: {
  price: number
  discount?: number
  updatedAt: Date
  featured?: boolean
}) {
  const finalPrice = discount ? price * (1 - discount) : price

  return (
    <div className={cn("p-6 rounded-lg border", featured ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white")}>
      <div className="space-y-2">
        {discount && <p className="text-sm text-gray-500 line-through">{formatCurrency(price)}</p>}
        <p className={cn("text-2xl font-bold", featured && "text-blue-600")}>{formatCurrency(finalPrice)}</p>
        <p className="text-xs text-gray-400">Updated {formatDate(updatedAt, "PPP")}</p>
      </div>
    </div>
  )
}

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils.js";

const buttonVariants = {
  default: "bg-black text-white hover:bg-gray-900",
  outline: "border border-gray-300 text-black hover:bg-gray-100",
}

const Button = React.forwardRef(({ className, variant = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn("px-4 py-2 rounded text-sm font-medium", buttonVariants[variant], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#012169] text-white",
        secondary: "border-transparent bg-[#003366] text-white",
        destructive: "border-transparent bg-[#DC3545] text-white",
        outline: "border-[#012169] text-[#012169]",
        success: "border-transparent bg-[#339966] text-white",
        warning: "border-transparent bg-[#F09905] text-white",
        available: "border-transparent bg-[#339966] text-white",
        checkedOut: "border-transparent bg-[#00539B] text-white",
        inCleaning: "border-transparent bg-[#F09905] text-white",
        late: "border-transparent bg-[#DC3545] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

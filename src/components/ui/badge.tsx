import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-300",
        outline:
          "border-slate-700 text-slate-300",
        eco:
          "border-emerald-500/40 bg-emerald-950/80 text-emerald-300 shadow-sm shadow-emerald-500/20",
        solar:
          "border-amber-500/40 bg-amber-950/80 text-amber-300 shadow-sm shadow-amber-500/20",
        water:
          "border-sky-500/40 bg-sky-950/80 text-sky-300 shadow-sm shadow-sky-500/20",
        admin:
          "border-purple-500/40 bg-purple-950/80 text-purple-300 shadow-sm shadow-purple-500/20",
        faculty:
          "border-blue-500/40 bg-blue-950/80 text-blue-300 shadow-sm shadow-blue-500/20",
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

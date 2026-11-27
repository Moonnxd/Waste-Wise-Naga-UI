import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors", {
  variants: {
    variant: {
      default: "bg-emerald-50 text-emerald-700",
      secondary: "bg-cyan-50 text-cyan-700",
      warning: "bg-amber-50 text-amber-700",
      muted: "bg-slate-100 text-slate-600",
      outline: "border border-emerald-200 text-emerald-700",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }) { return <span className={cn(badgeVariants({ variant }), className)} {...props} />; }

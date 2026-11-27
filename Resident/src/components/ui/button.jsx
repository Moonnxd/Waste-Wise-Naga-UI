import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]", {
  variants: {
    variant: {
      default: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
      secondary: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
      outline: "border border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
      ghost: "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
      destructive: "bg-rose-600 text-white hover:bg-rose-700",
      link: "text-emerald-700 underline-offset-4 hover:underline",
    },
    size: {
      default: "h-11 px-5",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "size-10 p-0",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };

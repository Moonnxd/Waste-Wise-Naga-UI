import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange, className, label }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={checked} onClick={() => onCheckedChange(!checked)} className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2", checked ? "bg-emerald-600" : "bg-slate-300", className)}><span className={cn("absolute top-[3px] size-[18px] rounded-full bg-white shadow transition-transform", checked ? "translate-x-[22px]" : "translate-x-[3px]")} /></button>;
}

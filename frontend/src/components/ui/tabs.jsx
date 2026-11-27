import { cn } from "@/lib/utils";

export function TabsList({ className, ...props }) { return <div role="tablist" className={cn("inline-flex h-9 items-center rounded-full bg-emerald-50 p-1", className)} {...props} />; }
export function TabsTrigger({ className, active, ...props }) { return <button role="tab" aria-selected={active} className={cn("inline-flex items-center justify-center rounded-full px-3 text-xs font-semibold text-slate-500 transition hover:text-emerald-800", active && "bg-white text-emerald-700 shadow-sm", className)} {...props} />; }

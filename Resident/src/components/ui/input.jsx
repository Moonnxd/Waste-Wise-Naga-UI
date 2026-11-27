import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }) {
  return <input type={type} className={cn("flex h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}

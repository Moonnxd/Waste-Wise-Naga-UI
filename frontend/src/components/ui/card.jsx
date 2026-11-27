import { cn } from "@/lib/utils";

export function Card({ className, ...props }) { return <div className={cn("rounded-[22px] border border-emerald-100 bg-white text-slate-900 shadow-[0_8px_24px_rgba(14,74,53,.05)]", className)} {...props} />; }
export function CardHeader({ className, ...props }) { return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />; }
export function CardTitle({ className, ...props }) { return <h3 className={cn("font-bold leading-none tracking-tight", className)} {...props} />; }
export function CardDescription({ className, ...props }) { return <p className={cn("text-sm text-slate-500", className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn("p-5 pt-0", className)} {...props} />; }
export function CardFooter({ className, ...props }) { return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />; }

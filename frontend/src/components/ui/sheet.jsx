import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({ open, onOpenChange, children }) { return <Dialog.Root open={open} onOpenChange={onOpenChange}>{children}</Dialog.Root>; }
export const SheetTrigger = Dialog.Trigger;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
export function SheetContent({ side = "bottom", className, children, ...props }) {
  return <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px]" /><Dialog.Content className={cn("fixed z-50 rounded-t-[28px] border border-emerald-100 bg-[#f5fbf8] p-5 shadow-2xl outline-none", side === "bottom" ? "inset-x-0 bottom-0 mx-auto max-w-lg" : "inset-y-0 right-0 w-[min(88vw,390px)] rounded-none rounded-l-[28px]", className)} {...props}><div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-300" /><Dialog.Close aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-emerald-50"><X size={17} /></Dialog.Close>{children}</Dialog.Content></Dialog.Portal>;
}

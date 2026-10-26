import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-xl font-bold", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-elegant">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className={light ? "text-navy-foreground" : "text-foreground"}>
        Prev<span className="text-success">TI</span>
      </span>
    </span>
  );
}

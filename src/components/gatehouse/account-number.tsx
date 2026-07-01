import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { formatNuban } from "@/lib/format";
import { toast } from "sonner";

export function AccountNumber({ value, size = "md" }: { value: string; size?: "sm" | "md" | "lg" }) {
  const [copied, setCopied] = useState(false);
  const sz = size === "lg" ? "text-lg" : size === "sm" ? "text-xs" : "text-sm";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(value);
        setCopied(true);
        toast.success("Account number copied");
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`inline-flex items-center gap-2 font-mono tabular ${sz} text-ink hover:text-brand transition-colors`}
    >
      <span>{formatNuban(value)}</span>
      {copied ? <Check size={14} className="text-brand" /> : <Copy size={14} className="text-muted-foreground" />}
    </button>
  );
}
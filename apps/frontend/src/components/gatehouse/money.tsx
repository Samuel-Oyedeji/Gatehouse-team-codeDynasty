import { ngn } from "@/lib/format";

export function Money({ value, className = "", muted = false }: { value: number; className?: string; muted?: boolean }) {
  return (
    <span className={`money tabular ${muted ? "text-muted-foreground" : ""} ${className}`}>
      {ngn(value)}
    </span>
  );
}
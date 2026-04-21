import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignatureCountdownBadgeProps {
  label: string;
  variant: "secondary" | "destructive" | "warning";
}

export const SignatureCountdownBadge = ({ label, variant }: SignatureCountdownBadgeProps) => {
  return (
    <Badge
      variant={variant === "warning" ? "secondary" : variant}
      className={cn(
        "flex items-center gap-1",
        variant === "warning" && "bg-accent text-accent-foreground"
      )}
    >
      <Clock className="size-3" />
      {label}
    </Badge>
  );
};
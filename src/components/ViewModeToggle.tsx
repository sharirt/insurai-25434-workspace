import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = "list" | "cards";

interface ViewModeToggleProps {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
}

export const ViewModeToggle = ({ value, onValueChange }: ViewModeToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      onValueChange={(v) => {
        if (v === "list" || v === "cards") onValueChange(v);
      }}
    >
      <ToggleGroupItem value="list" aria-label="תצוגת רשימה">
        <List />
      </ToggleGroupItem>
      <ToggleGroupItem value="cards" aria-label="תצוגת כרטיסים">
        <LayoutGrid />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
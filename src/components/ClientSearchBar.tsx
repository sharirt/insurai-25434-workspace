import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ClientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const ClientSearchBar = React.memo(function ClientSearchBar({
  value,
  onChange,
}: ClientSearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="relative w-full mb-6">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <Input
        dir="rtl"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="חיפוש לפי שם, ת.ז., טלפון או מייל..."
        className="pr-10 pl-10 h-11 text-base"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={handleClear}
          aria-label="נקה חיפוש"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
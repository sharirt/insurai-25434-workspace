import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity } from "@/product-types";

interface ClientSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export const ClientSelector = ({ value, onChange }: ClientSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: clients, isLoading } = useEntityGetAll(ClientsEntity);

  const getClientLabel = (client: typeof ClientsEntity.instanceType & { id: string }) => {
    if (client.first_name || client.last_name) {
      return `${client.first_name || ""} ${client.last_name || ""}`.trim();
    }
    return client.national_id || client.id;
  };

  const selectedClient = clients?.find((c: any) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedClient ? getClientLabel(selectedClient as any) : "בחר לקוח..."}
          <ChevronsUpDown className="opacity-50" data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder="חפש לקוח..." />
          <CommandList>
            <CommandEmpty>לא נמצאו לקוחות</CommandEmpty>
            <CommandGroup>
              {clients?.map((client: any) => (
                <CommandItem
                  key={client.id}
                  value={`${client.first_name || ""} ${client.last_name || ""} ${client.national_id || ""}`}
                  onSelect={() => {
                    onChange(client.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("opacity-0", value === client.id && "opacity-100")}
                  />
                  <span>{getClientLabel(client)}</span>
                  {client.national_id && (
                    <span className="text-muted-foreground text-xs mr-2">
                      {client.national_id}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
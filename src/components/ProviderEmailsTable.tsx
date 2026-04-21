import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { IProviderEmailsEntity, IProvidersEntity, IRequestSchemesEntity } from "@/product-types";

interface ProviderEmailsTableProps {
  items: (IProviderEmailsEntity & { id: string })[];
  providers: (IProvidersEntity & { id: string })[];
  requestSchemes: (IRequestSchemesEntity & { id: string })[];
  onEdit: (item: IProviderEmailsEntity & { id: string }) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const ProviderEmailsTable = ({
  items,
  providers,
  requestSchemes,
  onEdit,
  onDelete,
  deletingId,
}: ProviderEmailsTableProps) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getProviderName = (providerId?: string) => {
    const provider = providers?.find((p) => p.id === providerId);
    return provider?.provider_name || "—";
  };

  const getRequestTypeName = (requestTypeId?: string) => {
    const scheme = requestSchemes?.find((r) => r.id === requestTypeId);
    return scheme?.requestTypeName || "—";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>יצרן</TableHead>
              <TableHead>סוג בקשה</TableHead>
              <TableHead>אימייל</TableHead>
              <TableHead>הערות</TableHead>
              <TableHead className="w-24">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{getProviderName(item.providerId)}</TableCell>
                <TableCell>{getRequestTypeName(item.requestTypeId)}</TableCell>
                <TableCell className="font-mono text-sm">{item.email || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{item.notes || "—"}</TableCell>
                <TableCell>
                  {confirmDeleteId === item.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          onDelete(item.id);
                          setConfirmDeleteId(null);
                        }}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? <Loader2 className="animate-spin" /> : "מחק"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        בטל
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(item.id)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
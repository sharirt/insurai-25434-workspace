import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, ClientsEntity } from "@/product-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/FormatUtils";

const ITEMS_PER_PAGE = 50;

type ClientType = typeof ClientsEntity["instanceType"];

interface ClientsListViewProps {
  clients: ClientType[];
  onEdit: (client: ClientType) => void;
  onDelete: (client: ClientType) => void;
}

export function ClientsListViewSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">שם מלא</TableHead>
            <TableHead className="text-right">תעודת זהות</TableHead>
            <TableHead className="text-right">טלפון</TableHead>
            <TableHead className="text-right">מייל</TableHead>
            <TableHead className="text-right">כתובת מלאה</TableHead>
            <TableHead className="text-right">מין</TableHead>
            <TableHead className="text-right">תאריך לידה</TableHead>
            <TableHead className="text-right">מיקוד</TableHead>
            <TableHead className="text-right">סטאטוס</TableHead>
            <TableHead className="text-left w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(8)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell><Skeleton className="h-5 w-36" /></TableCell>
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-14" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-8 w-16" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ClientStatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-muted-foreground text-sm">—</span>;

  if (status === "פעיל") {
    return (
      <Badge className="bg-accent text-accent-foreground border-accent/80 hover:bg-accent/90">
        {status}
      </Badge>
    );
  }

  if (status === "טרום יעוץ") {
    return (
      <Badge className="bg-chart-5/15 text-chart-5 border-chart-5/30 hover:bg-chart-5/20">
        {status}
      </Badge>
    );
  }

  return <Badge variant="outline">{status}</Badge>;
}

export const ClientsListView = React.memo(function ClientsListView({
  clients,
  onEdit,
  onDelete,
}: ClientsListViewProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when clients list changes (e.g. filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [clients]);

  const totalItems = clients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return clients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [clients, currentPage]);

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleEdit = useCallback(
    (e: React.MouseEvent, client: ClientType) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit(client);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, client: ClientType) => {
      e.preventDefault();
      e.stopPropagation();
      onDelete(client);
    },
    [onDelete]
  );

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right font-semibold">שם מלא</TableHead>
              <TableHead className="text-right font-semibold">תעודת זהות</TableHead>
              <TableHead className="text-right font-semibold">טלפון</TableHead>
              <TableHead className="text-right font-semibold">מייל</TableHead>
              <TableHead className="text-right font-semibold">כתובת מלאה</TableHead>
              <TableHead className="text-right font-semibold">מין</TableHead>
              <TableHead className="text-right font-semibold">תאריך לידה</TableHead>
              <TableHead className="text-right font-semibold">מיקוד</TableHead>
              <TableHead className="text-right font-semibold">סטאטוס</TableHead>
              <TableHead className="text-left font-semibold w-[100px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client) => {
              const fullName =
                `${client.first_name || ""} ${client.last_name || ""}`.trim() ||
                "לקוח לא ידוע";
              const profileUrl = getPageUrl(ClientProfilePage, {
                id: client.id,
              });

              return (
                <TableRow
                  key={client.id}
                  className="group cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => navigate(profileUrl)}
                >
                  <TableCell className="font-medium">
                    {fullName}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm text-muted-foreground">
                      {client.national_id || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {client.phone_number || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm max-w-[200px] truncate block">
                      {client.email || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-sm max-w-[240px] truncate block"
                      title={client.fullAddress || undefined}
                    >
                      {client.fullAddress || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {client.gender || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {client.dateOfBirth
                        ? formatDate(client.dateOfBirth)
                        : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {client.zipCode || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ClientStatusBadge status={client.clientStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => handleEdit(e, client)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>עריכה</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:text-destructive"
                            onClick={(e) => handleDelete(e, client)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>מחיקה</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {totalItems > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronRight className="h-4 w-4 ml-1" />
                הקודם
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                הבא
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {rangeStart}-{rangeEnd} מתוך {totalItems}
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, RequestsManagerPage } from "@/product-types";
import type {
  IClientsEntity,
  IRequestsEntity,
  IRequestSchemesEntity,
  IProvidersEntity,
} from "@/product-types";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface OfficeRequestsTableProps {
  requests: (IRequestsEntity & { id: string; createdAt?: string })[];
  clients: (IClientsEntity & { id: string })[];
  requestSchemes: (IRequestSchemesEntity & { id: string })[];
  providers: (IProvidersEntity & { id: string })[];
  searchTerm: string;
  statusFilter: string;
}

export const OfficeRequestsTable = ({
  requests,
  clients,
  requestSchemes,
  providers,
  searchTerm,
  statusFilter,
}: OfficeRequestsTableProps) => {
  const getClientName = (clientId?: string) => {
    if (!clientId) return "—";
    const client = clients.find((c) => c.id === clientId);
    return client
      ? client.fullName || `${client.first_name || ""} ${client.last_name || ""}`.trim() || "—"
      : "—";
  };

  const getClientIdForLink = (clientId?: string) => clientId || "";

  const getRequestTypeName = (typeId?: string) => {
    if (!typeId) return "—";
    const scheme = requestSchemes.find((s) => s.id === typeId);
    return scheme?.requestTypeName || "—";
  };

  const getProviderName = (providerId?: string) => {
    if (!providerId) return "—";
    const provider = providers.find((p) => p.id === providerId);
    return provider?.provider_name || "—";
  };

  const filtered = requests
    .filter((req) => {
      const clientName = getClientName(req.clientId)?.toLowerCase() || "";
      const matchesSearch = !searchTerm || clientName.includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || statusFilter === "all" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileTextIcon />
        <p className="mt-2">לא נמצאו בקשות</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>לקוח</TableHead>
            <TableHead>סוג בקשה</TableHead>
            <TableHead>יצרן</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>תאריך יצירה</TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((req) => (
            <TableRow key={req.id}>
              <TableCell>
                <Link
                  to={getPageUrl(ClientProfilePage, { id: getClientIdForLink(req.clientId) })}
                  className="text-primary hover:underline"
                >
                  {getClientName(req.clientId)}
                </Link>
              </TableCell>
              <TableCell>{getRequestTypeName(req.requestTypeId)}</TableCell>
              <TableCell>{getProviderName(req.providerId)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(req.status)}>
                  {getStatusLabel(req.status)}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {req.createdAt
                  ? format(new Date(req.createdAt), "dd/MM/yyyy", { locale: he })
                  : "—"}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={getPageUrl(RequestsManagerPage, { id: req.id })}>
                    <ExternalLink data-icon="inline-start" />
                    פתח
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-50"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
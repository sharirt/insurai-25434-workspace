import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, IdCard, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, ClientsEntity } from "@/product-types";

function ClientStatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  if (status === "פעיל") {
    return (
      <Badge className="bg-chart-2/15 text-chart-2 border-chart-2/30 hover:bg-chart-2/20">
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

export const ClientCard = ({
  client,
  onEdit,
  onDelete
}: {
  client: typeof ClientsEntity['instanceType'];
  onEdit: (client: typeof ClientsEntity['instanceType']) => void;
  onDelete: (client: typeof ClientsEntity['instanceType']) => void;
}) => {
  const clientProfileUrl = getPageUrl(ClientProfilePage, { id: client.id });
  const clientFullName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'לקוח לא ידוע';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(client);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(client);
  };

  return (
    <Link to={clientProfileUrl}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer relative group">
        <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl pl-20">{clientFullName}</CardTitle>
          </div>
          {client.clientStatus && (
            <div className="pt-1">
              <ClientStatusBadge status={client.clientStatus} />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {client.national_id && (
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="font-mono text-xs">
                {client.national_id}
              </Badge>
            </div>
          )}
          {client.phone_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{client.phone_number}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">{client.email}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
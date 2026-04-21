import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Hash, Pencil, Trash2 } from "lucide-react";
import { ProvidersEntity } from "@/product-types";

export const ProviderCard = ({
  provider,
  onEdit,
  onDelete
}: {
  provider: typeof ProvidersEntity['instanceType'];
  onEdit: (provider: typeof ProvidersEntity['instanceType']) => void;
  onDelete: (provider: typeof ProvidersEntity['instanceType']) => void;
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(provider);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(provider);
  };

  const providerName = provider.provider_name || 'יצרן ללא שם';

  return (
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
      <CardHeader>
        <CardTitle className="text-xl pl-20">{providerName}</CardTitle>
        {provider.providerIdCode && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Hash className="h-3.5 w-3.5" />
            <span className="text-sm">{provider.providerIdCode}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-center py-8">
          <Building className="h-16 w-16 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { RequestSchemesEntity } from "@/product-types";
import { useMemo } from "react";

export const RequestTypeCard = ({ 
  requestType,
  onEdit,
  onDelete
}: { 
  requestType: typeof RequestSchemesEntity['instanceType'];
  onEdit: (requestType: typeof RequestSchemesEntity['instanceType']) => void;
  onDelete: (requestType: typeof RequestSchemesEntity['instanceType']) => void;
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(requestType);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(requestType);
  };

  const requestTypeName = requestType.requestTypeName || 'סוג בקשה ללא שם';
  
  const changesCount = useMemo(() => {
    if (!requestType.tracks) return 0;
    return Object.keys(requestType.tracks).length;
  }, [requestType.tracks]);

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
        <CardTitle className="text-xl pl-20">{requestTypeName}</CardTitle>
        <Badge variant="outline" className="w-fit">
          {changesCount} {changesCount === 1 ? 'מסלול' : 'מסלולים'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center py-8">
          <FileText className="h-16 w-16 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};
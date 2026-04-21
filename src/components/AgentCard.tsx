import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Pencil, Trash2, CreditCard, Phone } from "lucide-react";
import { AgentsEntity } from "@/product-types";

export const AgentCard = ({ 
  agent,
  onEdit,
  onDelete
}: { 
  agent: typeof AgentsEntity['instanceType'];
  onEdit: (agent: typeof AgentsEntity['instanceType']) => void;
  onDelete: (agent: typeof AgentsEntity['instanceType']) => void;
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(agent);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(agent);
  };

  const agentName = [agent.firstName, agent.lastName].filter(Boolean).join(' ').trim() || 'סוכן ללא שם';

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
        <CardTitle className="text-xl pl-20">{agentName}</CardTitle>
        {agent.nationalId && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            <span>{agent.nationalId}</span>
          </div>
        )}
        {agent.phone && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{agent.phone}</span>
          </div>
        )}
        {agent.agentNumber && (
          <Badge variant="outline" className="w-fit">
            {agent.agentNumber}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center py-8">
          <User className="h-16 w-16 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};
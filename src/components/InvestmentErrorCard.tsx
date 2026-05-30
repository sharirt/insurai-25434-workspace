import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface InvestmentErrorCardProps {
  onRetry: () => void;
  errors?: string[];
}

export const InvestmentErrorCard = ({ onRetry, errors }: InvestmentErrorCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-12">
        <AlertCircle className="size-12 text-destructive" />
        <p className="text-destructive font-medium">שגיאה בטעינת הנתונים</p>
        {errors?.map?.((err, i) => (
          <p key={i} className="text-sm text-muted-foreground">{err}</p>
        ))}
        <Button onClick={onRetry} variant="outline">
          <RefreshCw data-icon="inline-start" />
          נסה שוב
        </Button>
      </CardContent>
    </Card>
  );
};
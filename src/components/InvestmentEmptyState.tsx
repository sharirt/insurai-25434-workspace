import { Card, CardContent } from "@/components/ui/card";

export const InvestmentEmptyState = () => {
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">
        אין נתונים זמינים
      </CardContent>
    </Card>
  );
};
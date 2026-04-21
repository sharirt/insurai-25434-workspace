import { Lock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Lock className="size-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">אין הרשאה</CardTitle>
          <CardDescription className="text-base">
            אין לך הרשאה לצפות בדף זה
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/ClientsManager">חזרה לניהול לקוחות</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
import React from "react";
import { useSendLoginLink } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Loader2, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const { sendLoginLink, isLoading } = useSendLoginLink();
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("נא להזין כתובת דוא״ל");
      return;
    }

    try {
      await sendLoginLink({ email: email.trim() });
      setEmailSent(true);
      toast.success("קישור התחברות נשלח לדוא״ל שלך");
    } catch (error) {
      console.error("Login link error:", error);
      toast.error("שגיאה בשליחת קישור ההתחברות");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">כניסה למערכת</CardTitle>
            <CardDescription className="text-base mt-2">
              מערכת ניהול ביטוח
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">קישור נשלח לדוא״ל שלך</h3>
                <p className="text-sm text-muted-foreground">
                  בדוק את תיבת הדוא״ל שלך ולחץ על הקישור כדי להתחבר למערכת
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  {email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full"
              >
                שלח שוב
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">דוא״ל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="הזן את כתובת הדוא״ל שלך"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  dir="ltr"
                  className="text-right"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שולח...
                  </>
                ) : (
                  "שלח קישור התחברות"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
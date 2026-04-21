import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEntityCreate, useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AgentsEntity } from "@/product-types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";

export const AgentFormDialog = ({
  open,
  onClose,
  agent
}: {
  open: boolean;
  onClose: () => void;
  agent: typeof AgentsEntity['instanceType'] | null;
}) => {
  const { createFunction, isLoading: isCreating } = useEntityCreate(AgentsEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(AgentsEntity);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agentNumber, setAgentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!agent;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (agent) {
      setFirstName(agent.firstName || "");
      setLastName(agent.lastName || "");
      setAgentNumber(agent.agentNumber || "");
      setEmail(agent.email || "");
      setPhone(agent.phone || "");
      setNationalId(agent.nationalId || "");
    } else {
      setFirstName("");
      setLastName("");
      setAgentNumber("");
      setEmail("");
      setPhone("");
      setNationalId("");
    }
    setErrors({});
  }, [agent, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "שם פרטי הוא שדה חובה";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "כתובת דוא״ל לא תקינה";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        agentNumber: agentNumber.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        nationalId: nationalId.trim() || undefined,
      };

      if (isEditMode && agent) {
        await updateFunction({
          id: agent.id,
          data
        });
        toast.success("הסוכן עודכן בהצלחה");
      } else {
        await createFunction({ data });
        toast.success("הסוכן נוצר בהצלחה");
      }

      onClose();
    } catch (error) {
      toast.error(isEditMode ? "שגיאה בעדכון הסוכן" : "שגיאה ביצירת הסוכן");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "עריכת סוכן" : "סוכן חדש"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  שם פרטי <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="שם פרטי"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">שם משפחה</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="שם משפחה"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">תעודת זהות</Label>
              <Input
                id="nationalId"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="הזן תעודת זהות"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentNumber">מספר סוכן</Label>
              <Input
                id="agentNumber"
                value={agentNumber}
                onChange={(e) => setAgentNumber(e.target.value)}
                placeholder="הזן מספר סוכן"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                דוא״ל
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הזן כתובת דוא״ל"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                מספר טלפון
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+972501234567"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : isEditMode ? "שמור שינויים" : "צור סוכן"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
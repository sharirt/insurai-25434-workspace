import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientsEntity, FundsEntity, UsersEntity } from "@/product-types";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { useState, useMemo } from "react";
import { User, Phone, Briefcase, FileText, Calendar, Home, Users, UserCheck, Globe, IdCard, ExternalLink } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/FormatUtils";
import { differenceInYears } from "date-fns";

function ClientStatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-muted-foreground">—</span>;

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

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

type ViewMode = "compact" | "full";

export const ClientInfoCard = ({
  client,
}: {
  client: typeof ClientsEntity["instanceType"] & { id: string };
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("compact");

  const { data: funds, isLoading: fundsLoading } = useEntityGetAll(FundsEntity, {
    clientId: client.id,
  });

  const { data: allUsers } = useEntityGetAll(UsersEntity);

  const totalAccumulated = useMemo(() => {
    if (!funds?.length) return 0;
    return funds.reduce((sum, fund) => sum + (fund.totalBalance ?? 0), 0);
  }, [funds]);

  const clientFullName = useMemo(
    () =>
      `${client.first_name || ""} ${client.last_name || ""}`.trim() ||
      "לקוח לא ידוע",
    [client.first_name, client.last_name]
  );

  const formattedBirthDate = useMemo(
    () => (client.dateOfBirth ? formatDate(client.dateOfBirth) : undefined),
    [client.dateOfBirth]
  );

  const age = useMemo(() => {
    if (!client.dateOfBirth) return undefined;
    const birthDate = new Date(client.dateOfBirth);
    if (isNaN(birthDate.getTime())) return undefined;
    return differenceInYears(new Date(), birthDate);
  }, [client.dateOfBirth]);

  const hasParent1 = !!(client.parent1Name || client.parent1Id || client.parent1FirstName || client.parent1LastName || client.parent1DateOfBirth);
  const hasParent2 = !!(client.parent2Name || client.parent2Id || client.parent2FirstName || client.parent2LastName || client.parent2DateOfBirth);
  const hasParents = hasParent1 || hasParent2;

  const assignedEmails = client.assignedOfficeEmails ?? [];
  const hasAssignedOfficeUsers = assignedEmails.length > 0;

  const usersByEmail = useMemo(() => {
    const map = new Map<string, string>();
    allUsers?.forEach((u) => {
      if (u.email) {
        const displayName = u.name || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
        if (displayName) {
          map.set(u.email, displayName);
        }
      }
    });
    return map;
  }, [allUsers]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl">{clientFullName}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border">
              <Button
                variant={viewMode === "compact" ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none rounded-r-md text-xs px-3"
                onClick={() => setViewMode("compact")}
              >
                מקוצר
              </Button>
              <Button
                variant={viewMode === "full" ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none rounded-l-md text-xs px-3"
                onClick={() => setViewMode("full")}
              >
                מלא
              </Button>
            </div>
            <ClientStatusBadge status={client.clientStatus} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {viewMode === "compact" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <InfoField label="מין" value={client.gender} />
            <InfoField label="תאריך לידה" value={formattedBirthDate} />
            {age !== undefined && (
              <InfoField label="גיל" value={String(age)} />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">תעודת זהות</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{client.national_id || "—"}</p>
                {client.idDocumentationUrl && (
                  <Badge variant="secondary" className="gap-1">
                    <IdCard className="size-3" />
                    מתועד
                  </Badge>
                )}
              </div>
            </div>
            <InfoField label="מייל" value={client.email} />
            <InfoField label="מספר טלפון" value={client.phone_number} />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">סה״כ חסכון מצטבר</p>
              {fundsLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="font-medium text-foreground">
                  {formatCurrency(totalAccumulated)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">פרטים אישיים</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoField label="שם פרטי" value={client.first_name} />
                <InfoField label="שם משפחה" value={client.last_name} />
                <InfoField label="תעודת זהות" value={client.national_id} />
                {client.idIssueDate && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      תאריך הנפקה
                    </p>
                    <p className="font-medium text-foreground">{formatDate(client.idIssueDate)}</p>
                  </div>
                )}
                <InfoField label="תאריך לידה" value={formattedBirthDate} />
                <InfoField label="מין" value={client.gender} />
                <InfoField label="מצב משפחתי" value={client.relationship} />
                <InfoField label="ארץ לידה" value={client.birthCountry} />
                <InfoField label="עיר לידה" value={client.birthCity} />
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">פרטי קשר</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoField label="מספר טלפון" value={client.phone_number} />
                <InfoField label="מייל" value={client.email} />
                <InfoField label="יישוב" value={client.cityOfResidence} />
                <InfoField label="כתובת" value={client.address} />
                {client.apartmentNumber && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      מספר דירה
                    </p>
                    <p className="font-medium text-foreground">{client.apartmentNumber}</p>
                  </div>
                )}
                {client.homeNumber && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      מספר בית
                    </p>
                    <p className="font-medium text-foreground">{client.homeNumber}</p>
                  </div>
                )}
                <InfoField label="מיקוד" value={client.zipCode} />
              </div>
            </div>

            <Separator />

            {/* Employment Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">פרטי תעסוקה</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoField label="תעסוקה" value={client.employment} />
                <InfoField label="עיסוק" value={client.occupation} />
                <InfoField label="מעסיק" value={client.employer} />
                <InfoField label="ח.פ / ע.מ" value={client.companyId} />
              </div>
            </div>

            {/* Parents Info - only show if any parent data exists */}
            {hasParents && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">פרטי הורים</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hasParent1 && (
                      <>
                        <InfoField label="שם הורה 1" value={client.parent1Name} />
                        <InfoField label="ת.ז. הורה 1" value={client.parent1Id} />
                        {client.parent1FirstName && (
                          <InfoField label="שם פרטי הורה 1" value={client.parent1FirstName} />
                        )}
                        {client.parent1LastName && (
                          <InfoField label="שם משפחה הורה 1" value={client.parent1LastName} />
                        )}
                        {client.parent1DateOfBirth && (
                          <InfoField label="תאריך לידה הורה 1" value={formatDate(client.parent1DateOfBirth)} />
                        )}
                      </>
                    )}
                    {hasParent2 && (
                      <>
                        <InfoField label="שם הורה 2" value={client.parent2Name} />
                        <InfoField label="ת.ז. הורה 2" value={client.parent2Id} />
                        {client.parent2FirstName && (
                          <InfoField label="שם פרטי הורה 2" value={client.parent2FirstName} />
                        )}
                        {client.parent2LastName && (
                          <InfoField label="שם משפחה הורה 2" value={client.parent2LastName} />
                        )}
                        {client.parent2DateOfBirth && (
                          <InfoField label="תאריך לידה הורה 2" value={formatDate(client.parent2DateOfBirth)} />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Additional Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">מידע נוסף</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoField
                  label="אזרח אמריקאי"
                  value={client.american ? "כן" : "לא"}
                />
                <InfoField
                  label="יליד ארה״ב"
                  value={client.bornInUSA ? "כן" : "לא"}
                />
                <InfoField
                  label="תושב ארצות הברית לצורכי מס"
                  value={client.americanForTax ? "כן" : "לא"}
                />
                {client.smoker != null && (
                  <InfoField
                    label="מעשן"
                    value={client.smoker ? "כן" : "לא"}
                  />
                )}
                {client.tinNumber && (
                  <InfoField label="מספר TIN" value={client.tinNumber} />
                )}
                {client.idDocumentationUrl && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <IdCard className="size-3" />
                      תיעוד ת.ז.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto justify-start p-0"
                      onClick={() => window.open(client.idDocumentationUrl, "_blank")}
                    >
                      <ExternalLink data-icon="inline-start" />
                      פתח מסמך
                    </Button>
                  </div>
                )}
                <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">הערות</p>
                  <p className="font-medium text-foreground whitespace-pre-wrap">
                    {client.notes || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* English Details */}
            {!!(client.englishFirstName || client.englishLastName || client.englishCity || client.englishCountry || client.englishStreet) && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">פרטים באנגלית</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {client.englishFirstName && (
                      <InfoField label="שם פרטי אנגלית" value={client.englishFirstName} />
                    )}
                    {client.englishLastName && (
                      <InfoField label="שם משפחה אנגלית" value={client.englishLastName} />
                    )}
                    {client.englishCity && (
                      <InfoField label="עיר אנגלית" value={client.englishCity} />
                    )}
                    {client.englishCountry && (
                      <InfoField label="מדינה אנגלית" value={client.englishCountry} />
                    )}
                    {client.englishStreet && (
                      <InfoField label="רחוב באנגלית" value={client.englishStreet} />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Assigned Office Users */}
            {hasAssignedOfficeUsers && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">משתמשי משרד משויכים</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignedEmails.map((email) => {
                      const name = usersByEmail.get(email);
                      return (
                        <Badge key={email} variant="secondary" className="flex items-center gap-1.5">
                          <UserCheck className="size-3" />
                          <span>{name ? `${name} (${email})` : email}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
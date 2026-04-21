import { useMemo, useState, useCallback } from "react";
import { useEntityGetOne, useEntityGetAll, useEntityUpdate, useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AddFormsToRequestDialog } from "@/components/AddFormsToRequestDialog";
import { EditRequestDialog } from "@/components/EditRequestDialog";
import { SendForSignatureDialog } from "@/components/SendForSignatureDialog";
import { SendAllForSignatureDialog } from "@/components/SendAllForSignatureDialog";
import { SignatureRequestsSection } from "@/components/SignatureRequestsSection";
import { useSearchParams, useNavigate } from "react-router";
import {
  RequestsEntity,
  ClientsEntity,
  AgentsEntity,
  ProvidersEntity,
  RequestSchemesEntity,
  FormsEntity,
  FundsEntity,
  FormPreviewPage,
  AutoProcessNewRequestAction,
} from "@/product-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowRight,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Eye,
  Trash2,
  PenLine,
  Pencil,
  User,
  UserCheck,
  Building,
  Calendar,
  Briefcase,
  Percent,
  Clock,
  ArrowLeftRight,
  Landmark,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { getPageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/utils/FormatUtils";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";

export default function RequestsManager() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestId = searchParams.get("id");

  if (!requestId) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>
              לא סופק מזהה בקשה. אנא בחר בקשה מפרופיל הלקוח.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה
          </Button>
        </div>
      </div>
    );
  }

  return <RequestDetail requestId={requestId} />;
}

function RequestDetail({ requestId }: { requestId: string }) {
  const navigate = useNavigate();
  const [isTracksOpen, setIsTracksOpen] = useState(true);
  const [isAddFormsDialogOpen, setIsAddFormsDialogOpen] = useState(false);
  const [isSendAllDialogOpen, setIsSendAllDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [signatureDialogForm, setSignatureDialogForm] = useState<{
    formId: string;
    formPdfUrl: string;
  } | null>(null);
  const [isReprocessDialogOpen, setIsReprocessDialogOpen] = useState(false);

  const { executeFunction: reprocessRequest, isLoading: isReprocessing } = useExecuteAction(AutoProcessNewRequestAction);

  const {
    data: request,
    isLoading: isLoadingRequest,
    error: requestError,
    refetch: refetchRequest,
  } = useEntityGetOne(RequestsEntity, { id: requestId });

  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(RequestsEntity);

  const { data: requestType, isLoading: isLoadingType } = useEntityGetOne(
    RequestSchemesEntity,
    { id: request?.requestTypeId || "" },
    { enabled: !!request?.requestTypeId }
  );

  const { data: client, isLoading: isLoadingClient } = useEntityGetOne(
    ClientsEntity,
    { id: request?.clientId || "" },
    { enabled: !!request?.clientId }
  );

  const { data: agent, isLoading: isLoadingAgent } = useEntityGetOne(
    AgentsEntity,
    { id: request?.agentId || "" },
    { enabled: !!request?.agentId }
  );

  const { data: provider, isLoading: isLoadingProvider } = useEntityGetOne(
    ProvidersEntity,
    { id: request?.providerId || "" },
    { enabled: !!request?.providerId }
  );

  const { data: fund, isLoading: isLoadingFund } = useEntityGetOne(
    FundsEntity,
    { id: request?.fundId || "" },
    { enabled: !!request?.fundId }
  );

  const { data: allForms } = useEntityGetAll(FormsEntity);

  const statusLabel = getStatusLabel(request?.status);
  const statusVariant = getStatusVariant(request?.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateFunction({
        id: requestId,
        data: { status: newStatus as any },
      });
      toast.success("הסטטוס עודכן בהצלחה");
      refetchRequest();
    } catch {
      toast.error("שגיאה בעדכון הסטטוס");
    }
  };

  const tracksArray = useMemo(() => {
    if (!request?.tracks) return [];
    return Object.entries(request.tracks)
      .map(([key, value]) => ({
        key,
        value: String(value),
      }))
      .filter(({ value }) => {
        const num = parseFloat(value);
        return value !== '' && isFinite(num) && num > 0;
      });
  }, [request?.tracks]);

  const requestForms = useMemo(() => {
    if (!request?.forms || !allForms) return [];
    return request.forms.map((formItem) => {
      const formDetails = allForms.find((f) => f.id === formItem.formId);
      return {
        ...formItem,
        formTitle: formDetails?.formTitle,
        formTitleHebrew: formDetails?.formTitleHebrew,
      };
    });
  }, [request?.forms, allForms]);

  const sendableFormCount = useMemo(() => {
    return requestForms.filter((f) => f.url && f.formId).length;
  }, [requestForms]);

  const clientName = useMemo(() => {
    if (!client) return "";
    return (
      `${client.first_name || ""} ${client.last_name || ""}`.trim() ||
      "לקוח לא ידוע"
    );
  }, [client]);

  const handlePreviewForm = useCallback(
    (formId: string, url: string) => {
      const previewUrl = getPageUrl(FormPreviewPage, { formId, url: encodeURIComponent(url) });
      navigate(previewUrl);
    },
    [navigate]
  );

  const handleDownloadForm = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = title || "form.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDeleteForm = useCallback(
    async (formIndex: number) => {
      if (!request?.forms) return;
      try {
        const updatedForms = request.forms.filter((_, i) => i !== formIndex);
        await updateFunction({
          id: requestId,
          data: { forms: updatedForms },
        });
        toast.success("הטופס הוסר מהבקשה בהצלחה");
        refetchRequest();
      } catch (err) {
        toast.error("שגיאה בהסרת הטופס מהבקשה");
      }
    },
    [request?.forms, requestId, updateFunction, refetchRequest]
  );

  if (isLoadingRequest) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (requestError || !request) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>
              אירעה שגיאה בטעינת פרטי הבקשה. ייתכן שהבקשה לא נמצאה.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-fit">
          <ArrowRight className="ml-2 h-4 w-4" />
          חזרה לפרופיל לקוח
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">פרטי הבקשה</CardTitle>
              <div className="flex items-center gap-2">
                <AlertDialog open={isReprocessDialogOpen} onOpenChange={setIsReprocessDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isReprocessing}
                    >
                      {isReprocessing ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                      ) : (
                        <RefreshCw data-icon="inline-start" />
                      )}
                      {isReprocessing ? "מעבד..." : "עבד מחדש"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>עיבוד מחדש של הבקשה</AlertDialogTitle>
                      <AlertDialogDescription>
                        פעולה זו תעבד את הבקשה מחדש. כל הטפסים הקיימים יוחלפו בטפסים חדשים שיעובדו מאפס. האם להמשיך?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            await reprocessRequest({ requestId });
                            toast.success("הבקשה עובדה מחדש בהצלחה");
                            refetchRequest();
                          } catch {
                            toast.error("שגיאה בעיבוד הבקשה מחדש");
                          }
                        }}
                      >
                        אישור
                      </AlertDialogAction>
                      <AlertDialogCancel>ביטול</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil data-icon="inline-start" />
                  עריכה
                </Button>
                <Badge variant={statusVariant}>{statusLabel}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">לקוח</p>
                  {isLoadingClient ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <p className="font-medium">{clientName || "לא צוין"}</p>
                  )}
                </div>
              </div>

              {/* Agent */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <UserCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">סוכן</p>
                  {isLoadingAgent ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <p className="font-medium">
                      {[agent?.firstName, agent?.lastName].filter(Boolean).join(' ').trim() || "לא צוין"}
                    </p>
                  )}
                </div>
              </div>

              {/* Provider */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">יצרן</p>
                  {isLoadingProvider ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <p className="font-medium">{provider?.provider_name || "לא צוין"}</p>
                  )}
                </div>
              </div>

              {/* Request Type */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">סוג בקשה</p>
                  {isLoadingType ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <p className="font-medium">{requestType?.requestTypeName || "לא צוין"}</p>
                  )}
                </div>
              </div>

              {/* Creation date */}
              {request.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">תאריך יצירה</p>
                    <p className="font-medium">{formatDate(request.createdAt)}</p>
                  </div>
                </div>
              )}

              {/* Fund - plan name + policy number */}
              {request.fundId && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">מוצר / קרן</p>
                    {isLoadingFund ? (
                      <Skeleton className="h-5 w-32" />
                    ) : fund ? (
                      <p className="font-medium">
                        {fund.planName || "—"}
                        {fund.policyNumber && (
                          <span className="text-muted-foreground font-normal mr-2">
                            (פוליסה: {fund.policyNumber})
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="font-medium">לא נמצא</p>
                    )}
                  </div>
                </div>
              )}

              {/* Management fee */}
              {request.managementFee != null && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Percent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">דמי ניהול</p>
                    <p className="font-medium">{request.managementFee}%</p>
                  </div>
                </div>
              )}

              {/* Choice duration */}
              {request.choiceDuration && request.choiceDuration !== "" && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">תקופת בחירה</p>
                    <p className="font-medium">{request.choiceDuration} חודשים</p>
                  </div>
                </div>
              )}

              {/* Transfer type */}
              {request.transferType && request.transferType !== "" && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">סוג העברה</p>
                    <p className="font-medium">{request.transferType}</p>
                  </div>
                </div>
              )}

              {/* Keren name */}
              {request.kerenName && request.kerenName !== "" && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Landmark className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">שם קרן</p>
                    <p className="font-medium">{request.kerenName}</p>
                  </div>
                </div>
              )}

              {/* Transfer amount */}
              {request.transferAmount && request.transferAmount !== "" && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">יתרת העברה</p>
                    <p className="font-medium">
                      {request.transferAmount === "true"
                        ? "כל הסכום"
                        : (() => {
                            const num = parseFloat(request.transferAmount);
                            return isFinite(num) ? formatCurrency(num) : request.transferAmount;
                          })()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {tracksArray.length > 0 && (
          <Card>
            <Collapsible open={isTracksOpen} onOpenChange={setIsTracksOpen}>
              <CardHeader className="cursor-pointer">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg">
                      מסלולים ({tracksArray.length})
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="size-8">
                      {isTracksOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="bg-muted/50 rounded-lg p-4 flex flex-col gap-3">
                    {tracksArray.map(({ key, value }, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground font-medium">
                            {key}
                          </span>
                          <span className="text-sm font-semibold text-foreground max-w-[60%] text-left break-words">
                            {value}
                          </span>
                        </div>
                        {index < tracksArray.length - 1 && (
                          <Separator className="opacity-50" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">טפסים</CardTitle>
              <Badge variant="secondary">{requestForms.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {requestForms.length > 0 ? (
              <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {requestForms.map((form, index) => {
                    const formTitle =
                      form.formTitleHebrew || form.formTitle || "טופס ללא כותרת";
                    return (
                      <Card
                        key={index}
                        className="group relative overflow-hidden transition-shadow hover:shadow-md"
                      >
                        <div className="absolute top-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {form.url && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="size-8"
                                  onClick={() =>
                                    handlePreviewForm(form.formId || "", form.url)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>תצוגה מקדימה</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {form.url && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="size-8"
                                  onClick={() =>
                                    handleDownloadForm(form.url, formTitle)
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>הורדה</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {form.url && form.formId && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() =>
                                    setSignatureDialogForm({
                                      formId: form.formId!,
                                      formPdfUrl: form.url,
                                    })
                                  }
                                >
                                  <PenLine className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>שלח לחתימה</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                                    disabled={isUpdating}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>מחיקה</p>
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  מחיקת טופס
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  האם אתה בטוח שברצונך להסיר את &quot;{formTitle}&quot; מהבקשה? פעולה זו אינה ניתנת לביטול.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-row-reverse gap-2">
                                <AlertDialogAction
                                  onClick={() => handleDeleteForm(index)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  מחק
                                </AlertDialogAction>
                                <AlertDialogCancel>
                                  ביטול
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <CardTitle className="text-base font-semibold truncate">
                                  {form.formTitleHebrew || form.formTitle || "טופס ללא כותרת"}
                                </CardTitle>
                                {form.formTitleHebrew && form.formTitle && (
                                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                                    {form.formTitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            {form.processedAt ? (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-chart-5" />
                                <span className="text-xs text-muted-foreground">
                                  עובד {formatDate(form.processedAt)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                                <span className="text-xs text-muted-foreground">
                                  טרם עובד
                                </span>
                              </div>
                            )}
                            {!form.url && (
                              <Badge variant="secondary" className="text-xs">
                                אין קובץ
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TooltipProvider>
            ) : (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  אין טפסים
                </h3>
                <p className="text-muted-foreground">
                  לבקשה זו לא שויכו טפסים
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <SignatureRequestsSection requestId={requestId} onStatusUpdated={() => refetchRequest()} />

        <EditRequestDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          request={{ ...request, id: requestId }}
          onSuccess={() => refetchRequest()}
        />

        <AddFormsToRequestDialog
          open={isAddFormsDialogOpen}
          onClose={() => setIsAddFormsDialogOpen(false)}
          request={request}
          onSuccess={() => {
            refetchRequest();
          }}
        />

        <SendAllForSignatureDialog
          open={isSendAllDialogOpen}
          onClose={() => setIsSendAllDialogOpen(false)}
          requestId={requestId}
          clientName={clientName}
          agentName={[agent?.firstName, agent?.lastName].filter(Boolean).join(' ').trim() || undefined}
          formCount={sendableFormCount}
        />

        {signatureDialogForm && request.clientId && (
          <SendForSignatureDialog
            open={!!signatureDialogForm}
            onClose={() => setSignatureDialogForm(null)}
            clientId={request.clientId}
            requestId={requestId}
            formId={signatureDialogForm.formId}
            formPdfUrl={signatureDialogForm.formPdfUrl}
            agentId={request.agentId}
          />
        )}
      </div>
    </div>
  );
}
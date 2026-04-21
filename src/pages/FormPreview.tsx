import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useEntityGetOne } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity, ClientProfilePage } from "@/product-types";
import { getPageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import {
  ArrowRight,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
} from "lucide-react";

export default function FormPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("formId");
  const clientId = searchParams.get("clientId");
  const encodedUrl = searchParams.get("url");
  const fileUrl = encodedUrl ? decodeURIComponent(encodedUrl) : null;

  const [zoomLevel, setZoomLevel] = useState(100);

  // Fetch form details for the title
  const { data: form, isLoading: isLoadingForm } = useEntityGetOne(
    FormsEntity,
    { id: formId || "" },
    { enabled: !!formId }
  );

  const formTitle = useMemo(() => {
    if (!form) return "תצוגה מקדימה";
    return form.formTitleHebrew || form.formTitle || "טופס ללא כותרת";
  }, [form]);

  const formSubtitle = useMemo(() => {
    if (!form) return null;
    if (form.formTitleHebrew && form.formTitle) {
      return form.formTitle;
    }
    return null;
  }, [form]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  }, []);

  const handleBack = useCallback(() => {
    if (clientId) {
      navigate(getPageUrl(ClientProfilePage, { id: clientId }));
    } else {
      navigate(-1);
    }
  }, [clientId, navigate]);

  const handleDownload = useCallback(() => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = formTitle || "form.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fileUrl, formTitle]);

  // No URL provided
  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>
              לא סופק קישור לטופס. אנא חזור לדף הבקשה ונסה שוב.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleBack}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Back button + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                {isLoadingForm ? (
                  <Skeleton className="h-5 w-40" />
                ) : (
                  <>
                    <h1 className="text-base font-semibold truncate">
                      {formTitle}
                    </h1>
                    {formSubtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {formSubtitle}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Zoom controls + download */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md px-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center text-muted-foreground">
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 ml-2" />
              הורדה
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-[calc(100vh-65px)]">
          <PdfViewer file={fileUrl} />
        </div>
      </div>
    </div>
  );
}
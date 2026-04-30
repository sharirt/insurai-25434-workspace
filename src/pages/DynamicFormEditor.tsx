import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useEntityGetOne, useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity, AnalyzePdfFormFieldsAction, EditDynamicFormFieldsAction, FormsManagerPage } from "@/product-types";
import { getPageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PdfFieldEditor } from "@/components/PdfFieldEditor";
import { FieldPropertiesPanel } from "@/components/FieldPropertiesPanel";
import type { EditorField } from "@/components/FieldOverlay";

export default function DynamicFormEditor() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId");
  const navigate = useNavigate();

  const { data: form, isLoading: isLoadingForm } = useEntityGetOne(FormsEntity, { id: formId || "" }, { enabled: !!formId });
  const { executeFunction: analyzeFields, isLoading: isAnalyzing } = useExecuteAction(AnalyzePdfFormFieldsAction);
  const { executeFunction: saveFields, isLoading: isSaving } = useExecuteAction(EditDynamicFormFieldsAction);

  const [fields, setFields] = useState<EditorField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);

  // Load fields when form is available
  useEffect(() => {
    if (!form?.fileData?.url || fieldsLoaded) return;

    const loadFields = async () => {
      try {
        const result = await analyzeFields({ pdfUrl: form.fileData!.url });
        if (result?.fields) {
          const editorFields: EditorField[] = result.fields.map((f, i) => ({
            id: `field-${i}-${Date.now()}`,
            name: f.name || `field_${i}`,
            type: f.type || "text",
            page: f.page ?? 0,
            x: f.x ?? 0,
            y: f.y ?? 0,
            width: f.width ?? 100,
            height: f.height ?? 20,
            fontSize: undefined,
            fontFamily: undefined,
            textDirection: undefined,
            multiline: false,
            readOnly: f.readOnly ?? false,
          }));
          setFields(editorFields);
        }
        setFieldsLoaded(true);
      } catch {
        toast.error("שגיאה בטעינת שדות הטופס");
        setFieldsLoaded(true);
      }
    };

    loadFields();
  }, [form?.fileData?.url, fieldsLoaded]);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const handleFieldChange = (id: string, updates: Partial<EditorField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleMoveField = (id: string, dx: number, dy: number) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        return { ...f, x: f.x + dx, y: f.y - dy };
      })
    );
  };

  const handleResizeField = (id: string, dw: number, dh: number) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newW = Math.max(5, f.width + dw);
        const newH = Math.max(5, f.height + dh);
        return { ...f, width: newW, height: newH, y: f.y - dh };
      })
    );
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleAddField = () => {
    const newField: EditorField = {
      id: `field-new-${Date.now()}`,
      name: `new_field_${fields.length + 1}`,
      type: "text",
      page: 0,
      x: 50,
      y: 700,
      width: 120,
      height: 20,
      fontSize: 12,
      fontFamily: "helvetica",
      textDirection: "rtl",
      multiline: false,
      readOnly: false,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleSave = async () => {
    if (!formId) return;
    try {
      const fieldsPayload = fields.map((f) => ({
        name: f.name,
        type: f.type as any,
        page: f.page,
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,
        fontSize: f.fontSize,
        fontFamily: f.fontFamily as any,
        textDirection: f.textDirection as any,
        multiline: f.multiline,
        readOnly: f.readOnly,
      }));

      await saveFields({ formId, fields: fieldsPayload });
      toast.success("השדות נשמרו בהצלחה");
      navigate(getPageUrl(FormsManagerPage));
    } catch {
      toast.error("שגיאה בשמירת השדות");
    }
  };

  if (!formId) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        לא נמצא מזהה טופס
      </div>
    );
  }

  if (isLoadingForm) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!form?.fileData?.url) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        לא נמצא קובץ PDF לטופס זה
      </div>
    );
  }

  const formTitle = form.formTitleHebrew || form.formTitle || "טופס";

  return (
    <div className="h-screen flex flex-col" style={{ direction: "rtl" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(getPageUrl(FormsManagerPage))}
          >
            <ArrowRight className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate max-w-[300px]">{formTitle}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" data-icon="inline-start" />
              שומר...
            </>
          ) : (
            <>
              <Save data-icon="inline-start" />
              שמור
            </>
          )}
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden" dir="ltr">
        {/* PDF Editor - left */}
        <div className="flex-1 min-w-0">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">מנתח שדות טופס...</p>
            </div>
          ) : (
            <PdfFieldEditor
              fileUrl={form.fileData.url}
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onDeleteField={handleDeleteField}
              onMoveField={handleMoveField}
              onResizeField={handleResizeField}
            />
          )}
        </div>

        {/* Side panel - right */}
        <div className="w-[320px] shrink-0">
          <FieldPropertiesPanel
            selectedField={selectedField}
            onFieldChange={handleFieldChange}
            onAddField={handleAddField}
            allFieldNames={fields.map((f) => f.name)}
          />
        </div>
      </div>
    </div>
  );
}
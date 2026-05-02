import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  useEntityGetOne,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  FormsEntity,
  FormDetailsPage,
  EditDynamicFormFieldsAction,
  AnalyzePdfFormFieldsAction,
} from "@/product-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { DynamicFieldOverlay } from "@/components/DynamicFieldOverlay";
import { DynamicFieldProperties } from "@/components/DynamicFieldProperties";
import type { DynamicField } from "@/components/DynamicFieldBox";
import { usePdfNativeSize } from "@/hooks/usePdfNativeSize";
import { getPageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowRight, Plus, Save, Loader2 } from "lucide-react";

const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  text: { width: 200, height: 20 },
  checkbox: { width: 14, height: 14 },
  signature: { width: 200, height: 50 },
  date: { width: 100, height: 20 },
  dropdown: { width: 200, height: 24 },
};

const FIELD_TYPES = [
  { value: "text", label: "טקסט" },
  { value: "checkbox", label: "תיבת סימון" },
  { value: "signature", label: "חתימה" },
  { value: "date", label: "תאריך" },
  { value: "dropdown", label: "רשימה נפתחת" },
];

export default function DynamicFormEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("id") || "";

  const { data: form, isLoading: formLoading } = useEntityGetOne(FormsEntity, {
    id: formId,
  });

  const {
    executeFunction: describeFields,
    isLoading: isDescribing,
  } = useExecuteAction(AnalyzePdfFormFieldsAction);

  const {
    executeFunction: saveFields,
    isLoading: isSaving,
  } = useExecuteAction(EditDynamicFormFieldsAction);

  const pdfNativeSize = usePdfNativeSize(form?.fileData?.url);

  const [fields, setFields] = useState<DynamicField[]>([]);
  const [originalFieldNames, setOriginalFieldNames] = useState<string[]>([]);
  const [selectedFieldName, setSelectedFieldName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);
  const [addFieldOpen, setAddFieldOpen] = useState(false);

  // Drag state
  const [dragState, setDragState] = useState<{
    fieldName: string;
    startMouseX: number;
    startMouseY: number;
    startFieldX: number;
    startFieldY: number;
  } | null>(null);

  // Resize state
  const [resizeState, setResizeState] = useState<{
    fieldName: string;
    handle: string;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // ResizeObserver for container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(Math.floor(entry.contentRect.width));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [formLoading]);

  // Load fields from DescribePdfFormFields
  useEffect(() => {
    if (!form?.fileData?.url || fieldsLoaded) return;
    const load = async () => {
      try {
        const result = await describeFields({ pdfUrl: form.fileData!.url });
        if (result?.fields) {
          const mapped: DynamicField[] = result.fields.map((f) => ({
            name: f.name,
            type: f.type,
            page: f.page,
            x: f.x,
            y: f.y,
            width: f.width || 200,
            height: f.height || 20,
            fontSize: 12,
            fontFamily: "helvetica",
            textDirection: "rtl",
            multiline: false,
            readOnly: f.readOnly ?? false,
          }));
          setFields(mapped);
          setOriginalFieldNames(mapped.map((f) => f.name));
        }
      } catch {
        toast.error("שגיאה בטעינת שדות הטופס");
      }
      setFieldsLoaded(true);
    };
    load();
  }, [form?.fileData?.url, fieldsLoaded, describeFields]);

  const scale =
    pdfNativeSize && containerWidth > 0 ? containerWidth / pdfNativeSize.pdfW : 1;

  const selectedField = fields.find((f) => f.name === selectedFieldName) || null;

  const handleFieldUpdate = (name: string, updates: Partial<DynamicField>) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.name !== name) return f;
        const updated = { ...f, ...updates };
        // If name changed, update selectedFieldName
        if (updates.name && updates.name !== name) {
          setSelectedFieldName(updates.name);
        }
        return updated;
      })
    );
  };

  const handleDelete = (name: string) => {
    setFields((prev) => prev.filter((f) => f.name !== name));
    if (selectedFieldName === name) setSelectedFieldName(null);
  };

  const handleAddField = (type: string) => {
    const defaults = DEFAULT_SIZES[type] || DEFAULT_SIZES.text;
    const newField: DynamicField = {
      name: `field_${Date.now()}`,
      type,
      page: currentPage - 1,
      x: 100,
      y: pdfNativeSize ? pdfNativeSize.pdfH / 2 : 400,
      width: defaults.width,
      height: defaults.height,
      fontSize: 12,
      fontFamily: "helvetica",
      textDirection: "rtl",
      multiline: false,
      readOnly: false,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldName(newField.name);
    setAddFieldOpen(false);
  };

  const handleSave = async () => {
    if (!form?.fileData?.url) return;
    try {
      await saveFields({
        formId,
        pdfUrl: form.fileData.url,
        fields: fields.map((f) => ({
          name: f.name,
          type: f.type,
          page: f.page,
          x: f.x,
          y: f.y,
          width: f.width,
          height: f.height,
          fontSize: f.fontSize,
          fontFamily: f.fontFamily,
          textDirection: f.textDirection,
          multiline: f.multiline,
          readOnly: f.readOnly,
        })),
        existingFieldNames: originalFieldNames,
        formTitle: form.formTitleHebrew || form.formTitle || "form",
      });
      setOriginalFieldNames(fields.map((f) => f.name));
      toast.success("השינויים נשמרו בהצלחה");
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשמירת השינויים");
    }
  };

  const handleBack = () => {
    navigate(getPageUrl(FormDetailsPage) + "?id=" + formId);
  };

  // Drag handlers
  const handleDragStart = (name: string, e: React.MouseEvent) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return;
    setDragState({
      fieldName: name,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startFieldX: field.x,
      startFieldY: field.y,
    });
  };

  const handleResizeStart = (
    name: string,
    handle: string,
    e: React.MouseEvent
  ) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return;
    setResizeState({
      fieldName: name,
      handle,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: field.x,
      startY: field.y,
      startW: field.width,
      startH: field.height,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState) {
      const dx = (e.clientX - dragState.startMouseX) / scale;
      const dy = (e.clientY - dragState.startMouseY) / scale;
      const newX = dragState.startFieldX + dx;
      // Y is inverted: screen down = PDF y decreases
      const newY = dragState.startFieldY - dy;
      setFields((prev) =>
        prev.map((f) =>
          f.name === dragState.fieldName ? { ...f, x: newX, y: newY } : f
        )
      );
    }
    if (resizeState) {
      const dx = (e.clientX - resizeState.startMouseX) / scale;
      const dy = (e.clientY - resizeState.startMouseY) / scale;
      const h = resizeState.handle;

      let newX = resizeState.startX;
      let newY = resizeState.startY;
      let newW = resizeState.startW;
      let newH = resizeState.startH;

      if (h.includes("e")) newW = Math.max(10, resizeState.startW + dx);
      if (h.includes("w")) {
        newW = Math.max(10, resizeState.startW - dx);
        newX = resizeState.startX + dx;
      }
      if (h.includes("s")) {
        // Screen down = PDF y decreases, so "s" handle means shrink height from bottom
        newH = Math.max(10, resizeState.startH + dy);
        newY = resizeState.startY - dy;
      }
      if (h.includes("n")) {
        newH = Math.max(10, resizeState.startH - dy);
      }

      setFields((prev) =>
        prev.map((f) =>
          f.name === resizeState.fieldName
            ? { ...f, x: newX, y: newY, width: newW, height: newH }
            : f
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
    setResizeState(null);
  };

  const displayTitle =
    form?.formTitleHebrew || form?.formTitle || "עורך שדות דינמיים";

  if (formLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="p-6 flex gap-6">
          <Skeleton className="flex-[3] h-[600px]" />
          <Skeleton className="flex-[2] h-[600px]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="border-b bg-card p-4 shrink-0">
        <div className="flex items-center justify-between" style={{ direction: "rtl" }}>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowRight />
            </Button>
            <h1 className="text-xl font-bold truncate">{displayTitle}</h1>
            <Badge variant="secondary">{fields.length} שדות</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={addFieldOpen} onOpenChange={setAddFieldOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus data-icon="inline-start" />
                  הוסף שדה
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="end">
                {FIELD_TYPES.map((ft) => (
                  <button
                    key={ft.value}
                    type="button"
                    className="w-full text-right px-3 py-2 text-sm rounded hover:bg-accent transition-colors"
                    onClick={() => handleAddField(ft.value)}
                  >
                    {ft.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
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
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left: PDF preview 60% */}
        <div className="flex-[3] min-w-0 overflow-auto relative" ref={containerRef}>
          {isDescribing && !fieldsLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center flex flex-col gap-3 items-center">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-muted-foreground">טוען שדות טופס...</p>
              </div>
            </div>
          ) : form?.fileData?.url && containerWidth > 0 ? (
            <div
              className="relative"
              dir="ltr"
              style={{ userSelect: dragState || resizeState ? "none" : undefined }}
            >
              <PdfViewer
                file={form.fileData.url}
                showAll={false}
                showFields={[]}
                onPageChange={setCurrentPage}
                defaultWidth={containerWidth}
                maxWidth={containerWidth}
              />
              {pdfNativeSize && (
                <DynamicFieldOverlay
                  fields={fields}
                  currentPage={currentPage}
                  selectedFieldName={selectedFieldName}
                  scale={scale}
                  pdfNativeHeight={pdfNativeSize.pdfH}
                  onSelect={setSelectedFieldName}
                  onDelete={handleDelete}
                  onDragStart={handleDragStart}
                  onResizeStart={handleResizeStart}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>אין קובץ PDF</p>
            </div>
          )}
        </div>

        {/* Right: Side panel 40% */}
        <div className="flex-[2] border-r bg-card flex flex-col min-h-0">
          <div className="border-b p-3 shrink-0" style={{ direction: "rtl" }}>
            <h2 className="font-semibold text-sm">מאפייני שדה</h2>
          </div>
          <DynamicFieldProperties
            field={selectedField}
            onUpdate={handleFieldUpdate}
            allFieldNames={fields.map((f) => f.name)}
          />
        </div>
      </div>
    </div>
  );
}
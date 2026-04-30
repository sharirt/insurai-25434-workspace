import React, { DragEvent } from "react";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity } from "@/product-types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SIGNATURE_FIELD_TYPES, getFieldConfig } from "@/utils/signatureFieldTypes";
import {
  PenLine,
  Calendar,
  Type,
  CheckSquare,
  Fingerprint,
  GripVertical,
  X,
  Save,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { getConditionSummary, InlineConditionBuilder } from "@/components/ConditionBuilderPopover";
import type { PlacedField, ResizeDirection } from "@/hooks/useSignatureFieldsDragDrop";
import type { PdfNativeSize } from "@/hooks/usePdfNativeSize";

const ICON_MAP: Record<string, React.ElementType> = {
  PenLine,
  Calendar,
  Type,
  CheckSquare,
  Fingerprint,
};

const ROLE_MAP: Record<number, string> = {
  0: "Client",
  1: "Agent",
};

interface SignatureFieldsEditorProps {
  formId: string;
  initialFields?: PlacedField[];
  fields: PlacedField[];
  setFields: React.Dispatch<React.SetStateAction<PlacedField[]>>;
  updateFieldSigner?: (fieldId: string, signer: number) => void;
  pdfContainerRef: React.RefObject<HTMLDivElement | null>;
  pdfNativeSize?: PdfNativeSize | null;
}

export const SignatureFieldsEditor = ({
  formId,
  initialFields,
  fields,
  setFields,
  updateFieldSigner,
  pdfContainerRef,
  pdfNativeSize,
}: SignatureFieldsEditorProps) => {
  const { updateFunction, isLoading: isSaving } = useEntityUpdate(FormsEntity);
  const [initialized, setInitialized] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  useEffect(() => {
    if (!initialFields || initialFields.length === 0 || initialized) return;

    let retryCount = 0;
    const maxRetries = 30;
    const intervalMs = 100;

    const intervalId = setInterval(() => {
      retryCount++;
      const container = pdfContainerRef.current;
      if (!container) {
        if (retryCount >= maxRetries) {
          clearInterval(intervalId);
          setFields(initialFields);
          setInitialized(true);
        }
        return;
      }

      const canvas = container.querySelector("canvas.react-pdf__Page__canvas") as HTMLCanvasElement | null;
      const canvasWidth = canvas?.offsetWidth || container.offsetWidth;
      const canvasHeight = canvas?.offsetHeight || container.offsetHeight;

      if (canvasWidth === 0 || canvasHeight === 0) {
        if (retryCount >= maxRetries) {
          clearInterval(intervalId);
          setFields(initialFields);
          setInitialized(true);
        }
        return;
      }

      clearInterval(intervalId);

      const scaledFields: PlacedField[] = initialFields.map((f) => ({
        ...f,
        x: f.x * canvasWidth,
        y: f.y * canvasHeight,
        width: f.width * canvasWidth,
        height: f.height * canvasHeight,
      }));

      setFields(scaledFields);
      setInitialized(true);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [initialFields, initialized, setFields, pdfContainerRef, pdfNativeSize]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, fieldType: string) => {
      e.dataTransfer.setData("fieldType", fieldType);
      e.dataTransfer.setData("source", "palette");
      e.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const handleSaveFields = useCallback(async () => {
    try {
      const container = pdfContainerRef.current;
      if (!container) {
        toast.error("לא נמצא מיכל PDF");
        return;
      }

      const canvas = container.querySelector("canvas.react-pdf__Page__canvas") as HTMLCanvasElement | null;
      const canvasWidth = canvas?.offsetWidth || container.offsetWidth;
      const canvasHeight = canvas?.offsetHeight || container.offsetHeight;

      if (canvasWidth === 0 || canvasHeight === 0) {
        toast.error("לא ניתן לקרוא את מידות ה-PDF");
        return;
      }

      const mappedFields = fields.map((f) => ({
        id: f.id,
        type: f.type === "date_signed" ? "date" : f.type,
        role: ROLE_MAP[f.signer ?? 0] || "Client",
        x: f.x / canvasWidth,
        y: f.y / canvasHeight,
        w: f.width / canvasWidth,
        h: f.height / canvasHeight,
        page: f.page > 0 ? f.page : 1,
        condition: f.condition || "true",
      }));

      await updateFunction({
        id: formId,
        data: {
          signatureFields: {
            fields: mappedFields,
          },
        },
      });
      toast.success("שדות החתימה נשמרו בהצלחה");
    } catch {
      toast.error("שגיאה בשמירת שדות החתימה");
    }
  }, [formId, fields, updateFunction, pdfContainerRef]);

  const fieldCount = useMemo(() => fields.length, [fields]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 flex flex-col gap-4" dir="rtl">
          <p className="text-sm text-muted-foreground">
            גרור שדות מכאן אל ה-PDF משמאל
          </p>

          <div className="flex flex-col gap-2">
            {SIGNATURE_FIELD_TYPES.map((fieldConfig) => {
              const IconComponent = ICON_MAP[fieldConfig.icon];
              return (
                <div
                  key={fieldConfig.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, fieldConfig.type)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-colors hover:bg-muted/50",
                    fieldConfig.bgClass
                  )}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  {IconComponent && (
                    <IconComponent className={cn("h-5 w-5 shrink-0", fieldConfig.colorClass)} />
                  )}
                  <span className="font-medium text-sm">{fieldConfig.label}</span>
                </div>
              );
            })}
          </div>

          {fieldCount === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                לא הוגדרו שדות חתימה. גרור שדות מהפאנל הימני אל ה-PDF.
              </AlertDescription>
            </Alert>
          )}

          {fieldCount > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium">
                שדות שהוצבו ({fieldCount})
              </p>
              {fields.map((field) => {
                const config = getFieldConfig(field.type);
                const signerNum = field.signer ?? 0;
                const isEditingThis = editingFieldId === field.id;
                const summary = getConditionSummary(field.condition ?? "");
                return (
                  <div
                    key={field.id}
                    className="rounded border px-3 py-1.5 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("font-medium shrink-0", config.colorClass)}>
                        {config.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateFieldSigner?.(field.id, 0)}
                          className={cn(
                            "text-xs py-0.5 px-2 rounded-full transition-colors",
                            signerNum === 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          לקוח
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFieldSigner?.(field.id, 1)}
                          className={cn(
                            "text-xs py-0.5 px-2 rounded-full transition-colors",
                            signerNum === 1
                              ? "bg-accent text-accent-foreground border border-accent-foreground/30"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          סוכן
                        </button>
                      </div>
                      <span className="text-muted-foreground shrink-0">
                        {(() => {
                          const canvas = pdfContainerRef.current?.querySelector("canvas.react-pdf__Page__canvas") as HTMLCanvasElement | null;
                          const cw = canvas?.offsetWidth;
                          const ch = canvas?.offsetHeight;
                          if (cw && ch) {
                            return `(${(field.x / cw).toFixed(2)}, ${(field.y / ch).toFixed(2)})`;
                          }
                          return `(${field.x.toFixed(2)}, ${field.y.toFixed(2)})`;
                        })()}
                      </span>
                      <span className="text-muted-foreground shrink-0 text-[10px]">
                        עמוד {field.page > 0 ? field.page : 1}
                      </span>
                    </div>
                    {/* Condition summary + edit button when not editing */}
                    {!isEditingThis && (
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-[10px] shrink-0", summary.isMuted ? "text-muted-foreground" : "text-foreground")}>
                          {summary.text}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-muted-foreground shrink-0"
                          onClick={() => setEditingFieldId(field.id)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {/* Inline condition builder when editing */}
                    {isEditingThis && (
                      <InlineConditionBuilder
                        condition={field.condition ?? ""}
                        onSave={(val) => {
                          setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, condition: val } : f));
                          setEditingFieldId(null);
                        }}
                        onCancel={() => setEditingFieldId(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          onClick={handleSaveFields}
          disabled={isSaving}
          className="w-full"
        >
          <Save data-icon="inline-start" />
          {isSaving ? "שומר..." : "שמור שדות"}
        </Button>
      </div>
    </div>
  );
};

// PDF Drop Zone overlay component
const RESIZE_HANDLES: { dir: ResizeDirection; cursor: string; position: string }[] = [
  { dir: "nw", cursor: "nw-resize", position: "-top-1 -left-1" },
  { dir: "n", cursor: "n-resize", position: "-top-1 left-1/2 -translate-x-1/2" },
  { dir: "ne", cursor: "ne-resize", position: "-top-1 -right-1" },
  { dir: "e", cursor: "e-resize", position: "top-1/2 -right-1 -translate-y-1/2" },
  { dir: "se", cursor: "se-resize", position: "-bottom-1 -right-1" },
  { dir: "s", cursor: "s-resize", position: "-bottom-1 left-1/2 -translate-x-1/2" },
  { dir: "sw", cursor: "sw-resize", position: "-bottom-1 -left-1" },
  { dir: "w", cursor: "w-resize", position: "top-1/2 -left-1 -translate-y-1/2" },
];

interface PdfDropZoneProps {
  isDragOver: boolean;
  fields: PlacedField[];
  draggingFieldId: string | null;
  resizingFieldId?: string | null;
  pdfUrl?: string;
  currentPage?: number;
  pdfContainerRef: React.RefObject<HTMLDivElement | null>;
  onFieldMouseDown: (e: React.MouseEvent, fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
  onResizeStart?: (e: React.MouseEvent, fieldId: string, direction: ResizeDirection) => void;
  onDragOver?: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>) => void;
}

/** Compute the pixel offset of the PDF canvas relative to its scrollable wrapper. */
function useCanvasOffset(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [offset, setOffset] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const canvas = container.querySelector("canvas.react-pdf__Page__canvas") as HTMLCanvasElement | null;
      if (!canvas) return;

      let top = 0;
      let left = 0;
      let el: HTMLElement | null = canvas;
      while (el && el !== container) {
        top += el.offsetTop;
        left += el.offsetLeft;
        el = el.offsetParent as HTMLElement | null;
      }

      setOffset({
        top,
        left,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      });
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(container, { childList: true, subtree: true });
    container.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return offset;
}

export const PdfDropZone = ({
  isDragOver,
  fields,
  draggingFieldId,
  resizingFieldId,
  pdfUrl,
  currentPage = 1,
  pdfContainerRef,
  onFieldMouseDown,
  onRemoveField,
  onResizeStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: PdfDropZoneProps) => {
  const canvasOffset = useCanvasOffset(pdfContainerRef);

  if (!pdfUrl) {
    return null;
  }

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        top: canvasOffset.top,
        left: canvasOffset.left,
        width: canvasOffset.width || '100%',
        height: canvasOffset.height || '100%',
      }}
    >
      {isDragOver && (
        <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded pointer-events-none z-20 bg-primary/5" />
      )}

      {fields.filter((field) => field.page === currentPage).map((field) => {
        const config = getFieldConfig(field.type);
        const IconComponent = ICON_MAP[config.icon];
        const isAgent = field.signer === 1;
        return (
          <div
            key={field.id}
            className={cn(
              "absolute flex items-center justify-between gap-1 rounded px-1.5 select-none group",
              isAgent ? "bg-accent/30 border-2 border-dashed border-accent-foreground/40" : cn(config.bgClass, "border", config.borderClass),
              draggingFieldId === field.id
                ? "cursor-grabbing opacity-80 shadow-lg z-40"
                : resizingFieldId === field.id
                ? "shadow-lg z-40 ring-2 ring-primary/50"
                : "cursor-grab z-30 hover:shadow-md"
            )}
            style={{
              left: field.x,
              top: field.y,
              width: field.width,
              height: field.height,
              pointerEvents: "auto",
            }}
            onMouseDown={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest("[data-delete-btn]") || target.closest("[data-resize-handle]")) return;
              e.preventDefault();
              e.stopPropagation();
              onFieldMouseDown(e, field.id);
            }}
          >
            <Badge
              variant="secondary"
              className={cn(
                "absolute -top-3 -right-2 text-[8px] px-1.5 py-0 h-4 z-10",
                isAgent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
              )}
            >
              {isAgent ? "סוכן" : "לקוח"}
            </Badge>
            <div className="flex items-center gap-1 min-w-0 overflow-hidden">
              {IconComponent && (
                <IconComponent className={cn("h-3 w-3 shrink-0", config.colorClass)} />
              )}
              <span className={cn("text-[10px] font-medium truncate", config.colorClass)}>
                {config.label}
              </span>
            </div>
            <button
              data-delete-btn
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemoveField(field.id);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className="shrink-0 rounded-full p-0.5 hover:bg-destructive/20 transition-colors z-20"
            >
              <X className="h-3 w-3 text-destructive" />
            </button>
            {onResizeStart && RESIZE_HANDLES.map((handle) => (
              <div
                key={handle.dir}
                data-resize-handle
                className={cn(
                  "absolute size-2 rounded-sm bg-background border-2 border-primary opacity-0 group-hover:opacity-100 z-20",
                  resizingFieldId === field.id && "opacity-100",
                  handle.position
                )}
                style={{ cursor: handle.cursor }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onResizeStart(e, field.id, handle.dir);
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
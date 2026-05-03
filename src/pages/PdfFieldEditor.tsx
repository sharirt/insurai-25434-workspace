import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  useEntityGetOne,
  useEntityUpdate,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  FormsEntity,
  DescribeFormPdfFieldsAction,
  AnnotateFormPdfFieldsAction,
} from "@/product-types";
import { PdfField, createNewField } from "@/utils/PdfFieldTypes";
import { PdfViewerWithOverlays } from "@/components/PdfViewerWithOverlays";
import { FieldPanel } from "@/components/FieldPanel";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type {
  IDescribeFormPdfFieldsActionOutputDescribeFormPdfFieldsActionOutputFieldsItemObject,
} from "@/product-types";

function mapApiFieldToLocal(
  apiField: IDescribeFormPdfFieldsActionOutputDescribeFormPdfFieldsActionOutputFieldsItemObject,
  index: number
): PdfField {
  return {
    id: `existing_${apiField.name || index}_${index}`,
    name: apiField.name || `field_${index}`,
    type: (apiField.type === "unknown" ? "text" : apiField.type) as PdfField["type"] || "text",
    page: apiField.page ?? 0,
    x: apiField.x ?? 0,
    y: apiField.y ?? 0,
    width: apiField.width ?? 200,
    height: apiField.height ?? 20,
    fontSize: 12,
    fontFamily: "helvetica",
    textDirection: "ltr",
    multiline: false,
    required: apiField.required ?? false,
    readOnly: apiField.readOnly ?? false,
    options: apiField.options ?? [],
    defaultValue: "",
    isNew: false,
    isModified: false,
    isDeleted: false,
  };
}

export default function PdfFieldEditor() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId") || "";

  const { data: form, isLoading: isLoadingForm } = useEntityGetOne(FormsEntity, {
    id: formId,
  }, { enabled: !!formId });

  const {
    executeFunction: describeFields,
    isLoading: isDescribing,
  } = useExecuteAction(DescribeFormPdfFieldsAction);

  const {
    executeFunction: annotateFields,
    isLoading: isAnnotating,
  } = useExecuteAction(AnnotateFormPdfFieldsAction);

  const { updateFunction: updateForm } = useEntityUpdate(FormsEntity);

  const [fields, setFields] = useState<PdfField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [hasLoadedFields, setHasLoadedFields] = useState(false);

  // Load fields when form is available
  useEffect(() => {
    if (form && !hasLoadedFields) {
      loadFields();
    }
  }, [form, hasLoadedFields]);

  const loadFields = async () => {
    if (!form?.fileData?.url) return;
    try {
      const result = await describeFields({
        formId: form.id!,
        pdfUrl: form.fileData.url,
      });
      const apiFields = result?.fields ?? [];
      setFields(apiFields.map((f, i) => mapApiFieldToLocal(f, i)));
      setHasLoadedFields(true);
    } catch {
      toast.error("שגיאה בטעינת שדות הטופס");
      setHasLoadedFields(true);
    }
  };

  const handleRefresh = async () => {
    setHasLoadedFields(false);
    setSelectedFieldId(null);
  };

  const handleUpdateField = (id: string, updates: Partial<PdfField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isDeleted: true } : f))
    );
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleAddField = () => {
    const newField = createNewField();
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleSave = async () => {
    if (!form?.fileData?.url) return;

    const removeFieldNames = fields
      .filter((f) => f.isDeleted && !f.isNew)
      .map((f) => f.name);

    const fieldGeometryUpdates = fields
      .filter((f) => f.isModified && !f.isNew && !f.isDeleted)
      .map((f) => ({
        name: f.name,
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,
      }));

    const newFields = fields
      .filter((f) => f.isNew && !f.isDeleted)
      .map((f) => ({
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
        required: f.required,
        readOnly: f.readOnly,
        options: f.options?.length ? f.options : undefined,
        defaultValue: f.defaultValue || undefined,
      }));

    try {
      await annotateFields({
        formId: form.id!,
        pdfUrl: form.fileData.url,
        formFileName: form.fileData.name,
        fields: newFields as any,
        removeFieldNames: removeFieldNames.length ? removeFieldNames : undefined,
        fieldGeometryUpdates: fieldGeometryUpdates.length ? fieldGeometryUpdates : undefined,
      });
      // Sync fieldMapping
      const survivingFieldNames = fields
        .filter((f) => !f.isDeleted)
        .map((f) => f.name);

      const currentFieldMapping = (form.fieldMapping as Record<string, string>) || {};
      const mergedFieldMapping: Record<string, string> = {};
      for (const name of survivingFieldNames) {
        mergedFieldMapping[name] = currentFieldMapping[name] ?? "";
      }

      try {
        await updateForm({
          id: form.id!,
          data: { fieldMapping: mergedFieldMapping },
        });
        toast.success("השדות ומיפוי השדות נשמרו בהצלחה");
      } catch {
        toast.warning("השדות נשמרו, אך עדכון מיפוי השדות נכשל");
      }

      // Reload fields
      setHasLoadedFields(false);
      setSelectedFieldId(null);
    } catch {
      toast.error("שגיאה בשמירת השינויים");
    }
  };

  if (!formId) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        לא צוין מזהה טופס
      </div>
    );
  }

  if (isLoadingForm) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        הטופס לא נמצא
      </div>
    );
  }

  const pdfUrl = form.fileData?.url;
  const formTitle = form.formTitleHebrew || form.formTitle || "טופס ללא שם";

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left: PDF Viewer (60%) */}
      <div className="flex-[3] min-h-0 overflow-hidden flex">
        {pdfUrl ? (
          <PdfViewerWithOverlays
            pdfUrl={pdfUrl}
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            אין קובץ PDF לטופס זה
          </div>
        )}
      </div>

      {/* Right: Field Panel (40%) */}
      <div className="flex-[2] min-h-0 overflow-hidden border-t lg:border-t-0">
        <FieldPanel
          formTitle={formTitle}
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onUpdateField={handleUpdateField}
          onDeleteField={handleDeleteField}
          onAddField={handleAddField}
          onRefresh={handleRefresh}
          onSave={handleSave}
          isSaving={isAnnotating}
          isRefreshing={isDescribing}
        />
      </div>
    </div>
  );
}
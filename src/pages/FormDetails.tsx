import React from "react";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useEntityGetOne, useEntityGetAll, useEntityUpdate, useExecuteAction, useFileUpload } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity, RequestSchemesEntity, ProvidersEntity, FormsManagerPage, AnalyzePdfFormFieldsAction } from "@/product-types";
import type { IAnalyzePdfFormFieldsActionOutputAnalyzePdfFormFieldsActionOutputFieldsItemObject } from "@/product-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { FieldMappingEditor } from "@/components/FieldMappingEditor";
import { SignatureFieldsEditor, PdfDropZone } from "@/components/SignatureFieldsEditor";
import { PdfAnnotationOverlay } from "@/components/PdfAnnotationOverlay";
import { AnnotationPropertiesPanel } from "@/components/AnnotationPropertiesPanel";
import type { AnnotationField } from "@/components/PdfAnnotationOverlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, AlertCircle, Edit, Check, ChevronsUpDown, X, Eye, EyeOff, RefreshCw, Search, Upload, Loader2 } from "lucide-react";
import { getPageUrl, cn } from "@/lib/utils";
import { useSignatureFieldsDragDrop } from "@/hooks/useSignatureFieldsDragDrop";
import { usePdfNativeSize } from "@/hooks/usePdfNativeSize";
import type { PlacedField } from "@/hooks/useSignatureFieldsDragDrop";
import { toast } from "sonner";

type AnalyzedField = IAnalyzePdfFormFieldsActionOutputAnalyzePdfFormFieldsActionOutputFieldsItemObject;

export default function FormDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("id");
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTitleHebrew, setEditedTitleHebrew] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedProviders, setEditedProviders] = useState<string[]>([]);
  const [editedRequestTypes, setEditedRequestTypes] = useState<string[]>([]);
  const [providersOpen, setProvidersOpen] = useState(false);
  const [requestTypesOpen, setRequestTypesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("fieldMapping");
  const [currentPage, setCurrentPage] = useState(1);

  // Overlay state
  const [analyzedFields, setAnalyzedFields] = useState<AnalyzedField[]>([]);
  const [showFieldOverlay, setShowFieldOverlay] = useState(false);
  const [highlightedFieldName, setHighlightedFieldName] = useState<string | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // Filter state
  const [fieldSearchTerm, setFieldSearchTerm] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState("הכל");

  // Annotation state
  const [annotationFields, setAnnotationFields] = useState<AnnotationField[]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isAnnotationDirty, setIsAnnotationDirty] = useState(false);
  const [isSavingAnnotations, setIsSavingAnnotations] = useState(false);
  const [annotationsInitialized, setAnnotationsInitialized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFunction, isLoading: isUploading } = useFileUpload();

  const sigDragDrop = useSignatureFieldsDragDrop();

  // Keep the hook's currentPageRef in sync with the PdfViewer's current page
  useEffect(() => {
    sigDragDrop.currentPageRef.current = currentPage;
  }, [currentPage, sigDragDrop.currentPageRef]);

  const { data: form, isLoading, error } = useEntityGetOne(FormsEntity, { id: formId || "" });
  const pdfNativeSize = usePdfNativeSize(form?.fileData?.url);
  const { data: requestTypes } = useEntityGetAll(RequestSchemesEntity);
  const { data: allProviders } = useEntityGetAll(ProvidersEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(FormsEntity);
  const { executeFunction: analyzeFields, isLoading: isAnalyzing } = useExecuteAction(AnalyzePdfFormFieldsAction);

  // Track wrapper width so PdfViewer canvas fits inside the container
  const [pdfWidth, setPdfWidth] = useState(0);
  useEffect(() => {
    const container = sigDragDrop.pdfContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // Subtract PdfViewer's internal p-4 padding (16px × 2)
        setPdfWidth(Math.floor(entry.contentRect.width - 32));
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [sigDragDrop.pdfContainerRef, isLoading]);

  // Sorted providers list for dropdown
  const sortedProviders = useMemo(() => {
    if (!allProviders) return [];
    return [...allProviders]
      .filter((p) => p.id && p.provider_name)
      .sort((a, b) => (a.provider_name || "").localeCompare(b.provider_name || ""));
  }, [allProviders]);

  // Sorted request types list for dropdown
  const sortedRequestTypes = useMemo(() => {
    if (!requestTypes) return [];
    return [...requestTypes]
      .filter((rt) => rt.id && rt.requestTypeName)
      .sort((a, b) => (a.requestTypeName || "").localeCompare(b.requestTypeName || ""));
  }, [requestTypes]);

  // Get category name from first request type
  const categoryName = useMemo(() => {
    if (!form?.requests || form.requests.length === 0 || !requestTypes) {
      return "Other";
    }
    const firstRequestId = form.requests[0];
    const requestType = requestTypes.find((rt) => rt.id === firstRequestId);
    return requestType?.requestTypeName || "Other";
  }, [form, requestTypes]);

  // Convert fieldMapping object to array for display
  const fieldMappings = useMemo(() => {
    if (!form?.fieldMapping) return [];
    return Object.entries(form.fieldMapping).map(([fieldName, mapping]) => ({
      fieldName,
      mapping,
    }));
  }, [form?.fieldMapping]);

  const signatureFieldsFromForm = useMemo((): PlacedField[] => {
    if (!form?.signatureFields?.fields) return [];
    return form.signatureFields.fields.map((f) => ({
      id: f.id,
      type: (f.type === "date" ? "date_signed" : f.type) as PlacedField["type"],
      x: f.x,
      y: f.y,
      width: f.w,
      height: f.h,
      page: f.page || 1,
      signer: f.role === "Agent" ? 1 : 0,
    }));
  }, [form?.signatureFields]);

  const signatureFieldsCount = useMemo(
    () => (sigDragDrop.fields.length > 0 ? sigDragDrop.fields.length : signatureFieldsFromForm.length),
    [sigDragDrop.fields, signatureFieldsFromForm]
  );

  // Filtered field mappings based on search term and type filter
  const filteredFieldMappings = useMemo(() => {
    if (!fieldMappings.length) return [];

    return fieldMappings.filter(({ fieldName }) => {
      // Name filter (case-insensitive partial match)
      const nameMatch =
        !fieldSearchTerm.trim() ||
        fieldName.toLowerCase().includes(fieldSearchTerm.trim().toLowerCase());

      // Type filter
      let typeMatch = true;
      if (activeTypeFilter !== "הכל") {
        const analyzedField = analyzedFields.find((f) => f.name === fieldName);
        if (analyzedField) {
          typeMatch = (analyzedField.type || "").toLowerCase() === activeTypeFilter.toLowerCase();
        } else {
          typeMatch = false;
        }
      }

      return nameMatch && typeMatch;
    });
  }, [fieldMappings, fieldSearchTerm, activeTypeFilter, analyzedFields]);

  const isFilterActive = fieldSearchTerm.trim() !== "" || activeTypeFilter !== "הכל";

  const TYPE_FILTERS = ["הכל", "text", "checkbox", "signature"];

  const handleTypeFilterClick = useCallback((type: string) => {
    setActiveTypeFilter((prev) => (prev === type ? "הכל" : type));
  }, []);

  // Auto-trigger PDF analysis if no field mappings exist
  useEffect(() => {
    const shouldAnalyze =
      form &&
      form.fileData?.url &&
      (!form.fieldMapping || Object.keys(form.fieldMapping).length === 0);

    if (shouldAnalyze) {
      const runAnalysis = async () => {
        try {
          const result = await analyzeFields({ pdfUrl: form.fileData!.url });

          if (result?.fields && result.fields.length > 0) {
            setAnalyzedFields(result.fields);

            const fieldMappingObject: Record<string, string> = {};
            result.fields.forEach((field) => {
              if (field.name) {
                fieldMappingObject[field.name] = "";
              }
            });

            await updateFunction({
              id: form.id!,
              data: {
                fieldMapping: fieldMappingObject,
              },
            });

            toast.success("שדות PDF זוהו ונשמרו בהצלחה");
          }
        } catch (error) {
          toast.error("שגיאה בניתוח שדות PDF");
        }
      };

      runAnalysis();
    }
  }, [form, analyzeFields, updateFunction]);

  // Initialize edit form when entering edit mode
  useEffect(() => {
    if (isEditingMetadata && form) {
      setEditedTitle(form.formTitle || "");
      setEditedTitleHebrew(form.formTitleHebrew || "");
      setEditedNumber(form.formNumber || "");
      setEditedProviders(form.providers || []);
      setEditedRequestTypes(form.requests || []);
    }
  }, [isEditingMetadata, form]);

  const handleToggleProvider = useCallback((providerId: string) => {
    setEditedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  }, []);

  const handleToggleRequestType = useCallback((requestTypeId: string) => {
    setEditedRequestTypes((prev) =>
      prev.includes(requestTypeId)
        ? prev.filter((id) => id !== requestTypeId)
        : [...prev, requestTypeId]
    );
  }, []);

  const handleRemoveProvider = useCallback((providerId: string) => {
    setEditedProviders((prev) => prev.filter((id) => id !== providerId));
  }, []);

  const handleRemoveRequestType = useCallback((requestTypeId: string) => {
    setEditedRequestTypes((prev) => prev.filter((id) => id !== requestTypeId));
  }, []);

  const handleSaveMetadata = async () => {
    if (!form?.id) return;

    try {
      await updateFunction({
        id: form.id,
        data: {
          formTitle: editedTitle.trim(),
          formTitleHebrew: editedTitleHebrew.trim(),
          formNumber: editedNumber.trim(),
          providers: editedProviders,
          requests: editedRequestTypes,
        },
      });
      toast.success("פרטי הטופס עודכנו בהצלחה");
      setIsEditingMetadata(false);
    } catch (error) {
      toast.error("שגיאה בעדכון פרטי הטופס");
    }
  };

  const handleReplacePdf = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !form?.id) return;
    try {
      const url = await uploadFunction(file);
      await updateFunction({
        id: form.id,
        data: {
          fileData: {
            name: file.name,
            size: file.size,
            type: file.type,
            url,
          },
        },
      });
      toast.success("הקובץ הוחלף בהצלחה");
    } catch {
      toast.error("שגיאה בהעלאת הקובץ");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Load annotation fields from form data (points → pixels)
  useEffect(() => {
    if (!form?.pdfAnnotations?.fields || !pdfNativeSize || pdfWidth <= 0 || annotationsInitialized) return;
    const renderedPdfHeight = pdfWidth * (pdfNativeSize.pdfH / pdfNativeSize.pdfW);
    const scaleX = pdfWidth / pdfNativeSize.pdfW;
    const scaleY = renderedPdfHeight / pdfNativeSize.pdfH;

    const loaded: AnnotationField[] = (form.pdfAnnotations.fields as any[]).map((f: any) => ({
      id: f.id || crypto.randomUUID(),
      name: f.name || f.type || "שדה",
      type: f.type || "text",
      page: f.page ?? 0,
      x: (f.x ?? 0) * scaleX,
      y: renderedPdfHeight - ((f.y ?? 0) + (f.height ?? 0)) * scaleY,
      width: (f.width ?? f.w ?? 50) * scaleX,
      height: (f.height ?? f.h ?? 20) * scaleY,
      options: f.options,
      fontSize: f.fontSize ?? 10,
      fontFamily: f.fontFamily ?? "Helvetica",
      textDirection: f.textDirection ?? "rtl",
      required: f.required ?? false,
      readOnly: f.readOnly ?? false,
    }));

    setAnnotationFields(loaded);
    setAnnotationsInitialized(true);
  }, [form?.pdfAnnotations, pdfNativeSize, pdfWidth, annotationsInitialized]);

  const handleSaveAnnotations = async () => {
    if (!form?.id || !pdfNativeSize || pdfWidth <= 0) return;
    setIsSavingAnnotations(true);
    try {
      const renderedPdfHeight = pdfWidth * (pdfNativeSize.pdfH / pdfNativeSize.pdfW);
      const scaleX = pdfNativeSize.pdfW / pdfWidth;
      const scaleY = pdfNativeSize.pdfH / renderedPdfHeight;

      const pointFields = annotationFields.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        page: f.page,
        x: f.x * scaleX,
        y: (renderedPdfHeight - f.y - f.height) * scaleY,
        width: f.width * scaleX,
        height: f.height * scaleY,
        options: f.options,
        fontSize: f.fontSize,
        fontFamily: f.fontFamily,
        textDirection: f.textDirection,
        required: f.required,
        readOnly: f.readOnly,
      }));

      // Merge fieldMapping: add missing annotation field names
      const currentMapping = form.fieldMapping || {};
      const mergedMapping = { ...currentMapping };
      for (const af of annotationFields) {
        if (af.name && !(af.name in mergedMapping)) {
          (mergedMapping as any)[af.name] = "";
        }
      }

      await updateFunction({
        id: form.id,
        data: {
          pdfAnnotations: { fields: pointFields } as any,
          fieldMapping: mergedMapping,
        },
      });
      setIsAnnotationDirty(false);
      toast.success("שדות הערות PDF נשמרו בהצלחה");
    } catch {
      toast.error("שגיאה בשמירת שדות הערות");
    } finally {
      setIsSavingAnnotations(false);
    }
  };

  const handleAnnotationTabChange = (newTab: string) => {
    if (activeTab === "pdfAnnotations" && isAnnotationDirty) {
      const confirmed = window.confirm("יש שינויים שלא נשמרו בשדות ההערות. האם לעזוב בלי לשמור?");
      if (!confirmed) return;
    }
    setActiveTab(newTab);
  };

  const handleUpdateAnnotationField = (id: string, updates: Partial<AnnotationField>) => {
    setAnnotationFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    setIsAnnotationDirty(true);
  };

  const handleDeleteAnnotationField = (id: string) => {
    setAnnotationFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedAnnotationId === id) setSelectedAnnotationId(null);
    setIsAnnotationDirty(true);
  };

  const handleClearAllAnnotations = () => {
    const confirmed = window.confirm("האם למחוק את כל השדות?");
    if (!confirmed) return;
    setAnnotationFields([]);
    setSelectedAnnotationId(null);
    setIsAnnotationDirty(true);
  };

  const handleBack = () => {
    const formsManagerUrl = getPageUrl(FormsManagerPage);
    navigate(formsManagerUrl);
  };

  const handleToggleOverlay = useCallback(async () => {
    if (!showFieldOverlay) {
      if (analyzedFields.length === 0 && form?.fileData?.url) {
        setIsReanalyzing(true);
        try {
          const result = await analyzeFields({ pdfUrl: form.fileData.url });
          if (result?.fields) {
            setAnalyzedFields(result.fields);
          }
        } catch {
          toast.error("שגיאה בטעינת שדות PDF");
        } finally {
          setIsReanalyzing(false);
        }
      }
      setShowFieldOverlay(true);
    } else {
      setShowFieldOverlay(false);
    }
  }, [showFieldOverlay, analyzedFields, form, analyzeFields]);

  const handleReanalyze = useCallback(async () => {
    if (!form?.fileData?.url) return;
    setIsReanalyzing(true);
    try {
      const result = await analyzeFields({ pdfUrl: form.fileData.url });
      if (result?.fields) {
        setAnalyzedFields(result.fields);
        toast.success(`נמצאו ${result.fields.length} שדות`);
      }
    } catch {
      toast.error("שגיאה בניתוח מחדש");
    } finally {
      setIsReanalyzing(false);
    }
  }, [form, analyzeFields]);

  const handleFieldHover = useCallback((fieldName: string) => {
    if (showFieldOverlay) {
      setHighlightedFieldName(fieldName);
    }
  }, [showFieldOverlay]);

  const handleFieldHoverEnd = useCallback(() => {
    setHighlightedFieldName(null);
  }, []);

  if (error || !formId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {!formId ? "No form ID provided" : "Failed to load form. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Form not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayTitle = form.formTitleHebrew || form.formTitle || "Untitled Template";
  const fieldsCount = fieldMappings.length;
  const isLoadingAnalysis = isAnalyzing && fieldsCount === 0;
  const isOverlayLoading = isReanalyzing;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {!isEditingMetadata && (
                <>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{displayTitle}</h1>
                  </div>
                  <Badge variant="secondary">{categoryName}</Badge>
                </>
              )}
              {isEditingMetadata && (
                <h1 className="text-lg font-semibold text-muted-foreground">עריכת פרטי טופס</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditingMetadata ? (
                <>
                  <Button onClick={handleSaveMetadata} disabled={isUpdating}>
                    {isUpdating ? "שומר..." : "שמור"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingMetadata(false)}>
                    ביטול
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="icon" onClick={() => setIsEditingMetadata(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Edit Form Area */}
          {isEditingMetadata && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2" dir="rtl">
              {/* Hebrew Title */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-title-hebrew">כותרת בעברית</Label>
                <Input
                  id="edit-title-hebrew"
                  value={editedTitleHebrew}
                  onChange={(e) => setEditedTitleHebrew(e.target.value)}
                  placeholder="כותרת בעברית"
                />
              </div>

              {/* English Title */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-title-english">כותרת באנגלית</Label>
                <Input
                  id="edit-title-english"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Title in English"
                  dir="ltr"
                />
              </div>

              {/* Form Number */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-form-number">מספר טופס</Label>
                <Input
                  id="edit-form-number"
                  value={editedNumber}
                  onChange={(e) => setEditedNumber(e.target.value)}
                  placeholder="מספר טופס"
                />
              </div>

              {/* Providers Multi-Select */}
              <div className="space-y-1.5">
                <Label>יצרנים מקושרים</Label>
                <Popover open={providersOpen} onOpenChange={setProvidersOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={providersOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {editedProviders.length > 0
                          ? `${editedProviders.length} יצרנים נבחרו`
                          : "בחר יצרנים..."}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="חיפוש יצרן..." />
                      <CommandList>
                        <CommandEmpty>לא נמצאו יצרנים.</CommandEmpty>
                        <CommandGroup>
                          {sortedProviders.map((provider) => (
                            <CommandItem
                              key={provider.id}
                              value={provider.provider_name || ""}
                              onSelect={() => handleToggleProvider(provider.id!)}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  editedProviders.includes(provider.id!)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span>{provider.provider_name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {editedProviders.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {editedProviders.map((providerId) => {
                      const provider = sortedProviders.find((p) => p.id === providerId);
                      if (!provider) return null;
                      return (
                        <Badge key={providerId} variant="secondary" className="gap-1 text-xs">
                          {provider.provider_name}
                          <button
                            type="button"
                            onClick={() => handleRemoveProvider(providerId)}
                            className="rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Request Types Multi-Select */}
              <div className="space-y-1.5">
                <Label>סוגי בקשות מקושרים</Label>
                <Popover open={requestTypesOpen} onOpenChange={setRequestTypesOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={requestTypesOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {editedRequestTypes.length > 0
                          ? `${editedRequestTypes.length} סוגי בקשות נבחרו`
                          : "בחר סוגי בקשות..."}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="חיפוש סוג בקשה..." />
                      <CommandList>
                        <CommandEmpty>לא נמצאו סוגי בקשות.</CommandEmpty>
                        <CommandGroup>
                          {sortedRequestTypes.map((rt) => (
                            <CommandItem
                              key={rt.id}
                              value={rt.requestTypeName || ""}
                              onSelect={() => handleToggleRequestType(rt.id!)}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  editedRequestTypes.includes(rt.id!)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span>{rt.requestTypeName}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {editedRequestTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {editedRequestTypes.map((rtId) => {
                      const rt = sortedRequestTypes.find((r) => r.id === rtId);
                      if (!rt) return null;
                      return (
                        <Badge key={rtId} variant="secondary" className="gap-1 text-xs">
                          {rt.requestTypeName}
                          <button
                            type="button"
                            onClick={() => handleRemoveRequestType(rtId)}
                            className="rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
          {/* Left: PDF Preview */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex items-center justify-end px-3 py-1.5 border rounded-t-lg bg-muted/30" dir="rtl">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleReplacePdf}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-7 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isLoading}
              >
                {isUploading ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Upload data-icon="inline-start" />
                )}
                {isUploading ? "מעלה..." : "החלף PDF"}
              </Button>
            </div>
          <div
            dir="ltr"
            className="border border-t-0 rounded-b-lg overflow-auto bg-card flex-1 min-h-0 relative [&_div.flex.h-full.w-full.flex-col]:h-auto [&_div.flex.h-full.w-full.flex-col]:overflow-visible [&_div.flex-1.overflow-auto]:overflow-visible [&_div.flex-1.overflow-auto]:flex-none"
            data-pdf-wrapper
            ref={sigDragDrop.pdfContainerRef}
            onMouseMove={activeTab === "signatureFields" ? sigDragDrop.handleMouseMove : undefined}
            onMouseUp={activeTab === "signatureFields" ? sigDragDrop.handleMouseUp : undefined}
            onMouseLeave={activeTab === "signatureFields" ? sigDragDrop.handleMouseUp : undefined}
            onDragOver={activeTab === "signatureFields" ? sigDragDrop.handleDragOver : undefined}
            onDragLeave={activeTab === "signatureFields" ? sigDragDrop.handleDragLeave : undefined}
            onDrop={activeTab === "signatureFields" ? sigDragDrop.handleDrop : undefined}
          >
            {form.fileData?.url ? (
              pdfWidth > 0 ? (
                <PdfViewer
                  file={form.fileData.url}
                  fields={analyzedFields}
                  showAll={false}
                  showFields={highlightedFieldName ? [highlightedFieldName] : []}
                  onPageChange={setCurrentPage}
                  defaultWidth={pdfWidth}
                  maxWidth={pdfWidth}
                />
              ) : null
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No PDF file available</p>
              </div>
            )}

            {activeTab === "pdfAnnotations" && form.fileData?.url && (
              <PdfAnnotationOverlay
                annotationFields={annotationFields}
                currentPage={currentPage}
                pdfWidth={pdfWidth}
                pdfNativeSize={pdfNativeSize}
                selectedAnnotationId={selectedAnnotationId}
                onSelectField={setSelectedAnnotationId}
                onUpdateFields={(fields) => {
                  setAnnotationFields(fields);
                }}
                onMarkDirty={() => setIsAnnotationDirty(true)}
                pdfContainerRef={sigDragDrop.pdfContainerRef}
              />
            )}

            {activeTab === "signatureFields" && form.fileData?.url && (
              <PdfDropZone
                isDragOver={sigDragDrop.isDragOver}
                fields={sigDragDrop.fields}
                draggingFieldId={sigDragDrop.draggingFieldId}
                resizingFieldId={sigDragDrop.resizingFieldId}
                pdfUrl={form.fileData.url}
                currentPage={currentPage}
                pdfContainerRef={sigDragDrop.pdfContainerRef}
                onFieldMouseDown={sigDragDrop.handleFieldMouseDown}
                onRemoveField={sigDragDrop.handleRemoveField}
                onResizeStart={sigDragDrop.handleResizeStart}
                onDragOver={sigDragDrop.handleDragOver}
                onDragLeave={sigDragDrop.handleDragLeave}
                onDrop={sigDragDrop.handleDrop}
              />
            )}
          </div>
          </div>

          {/* Right: Tabbed Panel */}
          <div className="border rounded-lg bg-card overflow-hidden h-[calc(100vh-200px)] flex flex-col">
            <Tabs value={activeTab} onValueChange={handleAnnotationTabChange} className="flex flex-col h-full" dir="rtl">
              <div className="p-2 border-b shrink-0">
                <TabsList className="w-full">
                  <TabsTrigger value="fieldMapping" className="flex-1 gap-1.5">
                    מיפוי שדות
                    {!isLoadingAnalysis && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{fieldsCount}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="signatureFields" className="flex-1 gap-1.5">
                    שדות חתימה
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{signatureFieldsCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pdfAnnotations" className="flex-1 gap-1.5">
                    עריכת שדות PDF
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{annotationFields.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="fieldMapping" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
                {isLoadingAnalysis ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">מנתח שדות PDF...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Overlay toolbar */}
                    <div
                      className="flex flex-nowrap items-center gap-2 px-3 py-2 border-b bg-muted/30 shrink-0 overflow-x-auto overflow-y-hidden"
                      dir="rtl"
                    >
                      <Button
                        variant={showFieldOverlay ? "default" : "outline"}
                        size="sm"
                        className="gap-1.5 h-7 px-2.5 text-xs rounded-full shrink-0"
                        onClick={handleToggleOverlay}
                        disabled={isOverlayLoading || !form.fileData?.url}
                      >
                        {isOverlayLoading ? (
                          <span className="animate-spin rounded-full h-3 w-3 border-b border-current inline-block" />
                        ) : showFieldOverlay ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        הצג שדות על PDF
                      </Button>

                      {analyzedFields.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shrink-0">
                          {analyzedFields.length} שדות
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 ml-auto"
                        onClick={handleReanalyze}
                        disabled={isOverlayLoading || !form.fileData?.url}
                        title="נתח מחדש"
                      >
                        <RefreshCw className={cn("h-3.5 w-3.5", isOverlayLoading && "animate-spin")} />
                      </Button>
                    </div>

                    {/* Filter bar */}
                    <div
                      className="shrink-0 px-3 py-2 border-b bg-muted/20"
                      dir="rtl"
                    >
                      {/* Search input */}
                      <div className="relative mb-2">
                        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        <Input
                          value={fieldSearchTerm}
                          onChange={(e) => setFieldSearchTerm(e.target.value)}
                          placeholder="חפש שדה..."
                          className="h-8 pr-8 pl-8 text-sm"
                          dir="rtl"
                        />
                        {fieldSearchTerm && (
                          <button
                            type="button"
                            onClick={() => setFieldSearchTerm("")}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="נקה חיפוש"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Type filter pills */}
                      <div className="flex flex-wrap gap-1">
                        {TYPE_FILTERS.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleTypeFilterClick(type)}
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                              activeTypeFilter === type
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      {/* Results count */}
                      {isFilterActive && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          מציג {filteredFieldMappings.length} מתוך {fieldsCount} שדות
                        </p>
                      )}
                    </div>

                    <ScrollArea className="flex-1 min-h-0 overflow-hidden">
                      <div className="p-4 space-y-3" dir="rtl">
                        {fieldsCount === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No field mappings found</p>
                          </div>
                        ) : (
                          filteredFieldMappings.map(({ fieldName, mapping }) => (
                            <FieldMappingEditor
                              key={fieldName}
                              fieldName={fieldName}
                              mapping={mapping}
                              formId={form.id}
                              isHighlighted={highlightedFieldName === fieldName}
                              onHover={handleFieldHover}
                              onHoverEnd={handleFieldHoverEnd}
                            />
                          ))
                        )}
                        {fieldsCount > 0 && filteredFieldMappings.length === 0 && (
                          <div className="text-center py-10 text-muted-foreground">
                            <p className="text-sm">לא נמצאו שדות התואמים לסינון</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </TabsContent>

              <TabsContent value="signatureFields" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
                <SignatureFieldsEditor
                  formId={form.id!}
                  initialFields={signatureFieldsFromForm}
                  fields={sigDragDrop.fields}
                  setFields={sigDragDrop.setFields}
                  updateFieldSigner={sigDragDrop.updateFieldSigner}
                  pdfContainerRef={sigDragDrop.pdfContainerRef}
                  pdfNativeSize={pdfNativeSize}
                />
              </TabsContent>

              <TabsContent value="pdfAnnotations" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
                <AnnotationPropertiesPanel
                  annotationFields={annotationFields}
                  selectedAnnotationId={selectedAnnotationId}
                  isAnnotationDirty={isAnnotationDirty}
                  isSaving={isSavingAnnotations}
                  onUpdateField={handleUpdateAnnotationField}
                  onDeleteField={handleDeleteAnnotationField}
                  onSave={handleSaveAnnotations}
                  onClearAll={handleClearAllAnnotations}
                  onSelectField={setSelectedAnnotationId}
                  currentPage={currentPage}
                  onNavigateToPage={setCurrentPage}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
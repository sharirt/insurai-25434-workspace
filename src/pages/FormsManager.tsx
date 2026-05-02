import React from "react";
import { useState, useMemo, useCallback, useRef } from "react";
import { useEntityGetAll, useEntityCreate, useEntityDelete, useFileUpload } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { useNavigate } from "react-router";
import { FormsEntity, RequestSchemesEntity, ProvidersEntity } from "@/product-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, Search, Layers, Eye, Trash2, List, Grid3x3, AlertCircle, File, X, Loader2, Check, ChevronsUpDown, StickyNote, PenLine } from "lucide-react";
import { FormsByProviderPills } from "@/components/FormsByProviderPills";
import { getPageUrl, cn } from "@/lib/utils";
import { FormDetailsPage, PdfFieldEditorPage } from "@/product-types";
import { toast } from "sonner";
import { FormNotesDialog } from "@/components/FormNotesDialog";

export default function FormsManager() {
  const navigate = useNavigate();
  const { data: forms, isLoading: isLoadingForms, error } = useEntityGetAll(FormsEntity);
  const { data: requestTypes } = useEntityGetAll(RequestSchemesEntity);
  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { createFunction, isLoading: isCreating } = useEntityCreate(FormsEntity);
  const { deleteFunction, isLoading: isDeleting } = useEntityDelete(FormsEntity);
  const { uploadFunction, isLoading: isUploading } = useFileUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterRequestType, setFilterRequestType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Upload dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedRequestTypes, setSelectedRequestTypes] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Notes dialog state
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesForm, setNotesForm] = useState<{ id: string; title: string; titleHebrew?: string; notes: string; currentStatus?: string; currentImageAttachment?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestTypesDropdownOpen, setRequestTypesDropdownOpen] = useState(false);
  const [providersDropdownOpen, setProvidersDropdownOpen] = useState(false);

  // Extract unique categories from forms
  const categories = useMemo(() => {
    if (!forms || !requestTypes) return [];

    const categorySet = new Set<string>();
    forms.forEach((form) => {
      if (form.requests && form.requests.length > 0) {
        const firstRequestId = form.requests[0];
        const requestType = requestTypes.find((rt) => rt.id === firstRequestId);
        if (requestType?.requestTypeName) {
          categorySet.add(requestType.requestTypeName);
        }
      }
    });

    return Array.from(categorySet).sort();
  }, [forms, requestTypes]);

  // Get category name for a form
  const getCategoryName = useMemo(() => (form: typeof FormsEntity['instanceType']) => {
    if (!form.requests || form.requests.length === 0 || !requestTypes) {
      return "אחר";
    }

    const firstRequestId = form.requests[0];
    const requestType = requestTypes.find((rt) => rt.id === firstRequestId);
    return requestType?.requestTypeName || "אחר";
  }, [requestTypes]);

  // Filter and search forms
  const filteredForms = useMemo(() => {
    if (!forms) return [];

    let filtered = forms;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((form) => {
        const titleMatch = form.formTitle?.toLowerCase()?.includes(searchLower);
        const titleHebrewMatch = form.formTitleHebrew?.toLowerCase()?.includes(searchLower);
        const purposeMatch = form.purpose?.toLowerCase()?.includes(searchLower);
        return titleMatch || titleHebrewMatch || purposeMatch;
      });
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((form) => getCategoryName(form) === selectedCategory);
    }

    // Apply provider filter
    if (filterProvider === "__none__") {
      filtered = filtered.filter((form) => !form.providers || form.providers.length === 0);
    } else if (filterProvider !== "all") {
      filtered = filtered.filter((form) =>
        form.providers?.includes(filterProvider)
      );
    }

    // Apply request type filter
    if (filterRequestType !== "all") {
      filtered = filtered.filter((form) =>
        form.requests?.includes(filterRequestType)
      );
    }

    return filtered;
  }, [forms, searchTerm, selectedCategory, filterProvider, filterRequestType, getCategoryName]);

  // Build lookup maps for providers and request types
  const providersMap = useMemo(() => {
    if (!providers) return new Map<string, string>();
    const map = new Map<string, string>();
    providers.forEach((p) => {
      if (p.id) map.set(p.id, p.provider_name || "ללא שם");
    });
    return map;
  }, [providers]);

  const requestTypesMap = useMemo(() => {
    if (!requestTypes) return new Map<string, string>();
    const map = new Map<string, string>();
    requestTypes.forEach((rt) => {
      if (rt.id) map.set(rt.id, rt.requestTypeName || "ללא שם");
    });
    return map;
  }, [requestTypes]);

  // Helper to get selected names for display
  const selectedRequestTypeNames = useMemo(() => {
    if (!requestTypes || selectedRequestTypes.length === 0) return "";
    return requestTypes
      .filter((rt) => selectedRequestTypes.includes(rt.id!))
      .map((rt) => rt.requestTypeName)
      .join(", ");
  }, [requestTypes, selectedRequestTypes]);

  const selectedProviderNames = useMemo(() => {
    if (!providers || selectedProviders.length === 0) return "";
    return providers
      .filter((p) => selectedProviders.includes(p.id!))
      .map((p) => p.provider_name)
      .join(", ");
  }, [providers, selectedProviders]);

  const handleOpenUploadDialog = useCallback(() => {
    setUploadFile(null);
    setSelectedRequestTypes([]);
    setSelectedProviders([]);
    setIsDragging(false);
    setIsSubmitting(false);
    setRequestTypesDropdownOpen(false);
    setProvidersDropdownOpen(false);
    setUploadDialogOpen(true);
  }, []);

  const handleCloseUploadDialog = useCallback(() => {
    if (isSubmitting) return;
    setUploadDialogOpen(false);
  }, [isSubmitting]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("רק קבצי PDF מותרים");
        return;
      }
      setUploadFile(file);
    }
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("רק קבצי PDF מותרים");
        return;
      }
      setUploadFile(file);
    }
    // Reset the input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadFile(null);
  }, []);

  const toggleRequestType = useCallback((id: string) => {
    setSelectedRequestTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleProvider = useCallback((id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const isFormValid = useMemo(() => {
    return uploadFile !== null && selectedRequestTypes.length > 0 && selectedProviders.length > 0;
  }, [uploadFile, selectedRequestTypes, selectedProviders]);

  const handleSubmitUpload = useCallback(async () => {
    if (!uploadFile || selectedRequestTypes.length === 0 || selectedProviders.length === 0) {
      if (!uploadFile) toast.error("יש לבחור קובץ PDF");
      if (selectedRequestTypes.length === 0) toast.error("יש לבחור לפחות סוג בקשה אחד");
      if (selectedProviders.length === 0) toast.error("יש לבחור לפחות יצרן אחד");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload the file
      const fileUrl = await uploadFunction(uploadFile);

      // Extract file name without extension for the title
      const fileName = uploadFile.name.replace(/\.pdf$/i, "");

      // Create a new form with the selected request types and providers
      const newForm = await createFunction({
        data: {
          formTitle: fileName,
          formNumber: "NEW",
          fileData: {
            name: uploadFile.name,
            size: uploadFile.size,
            type: uploadFile.type,
            url: fileUrl,
          },
          requests: selectedRequestTypes,
          providers: selectedProviders,
        },
      });

      toast.success("הטופס הועלה בהצלחה");
      setUploadDialogOpen(false);

      // Navigate to FormDetails page with the new form ID
      const formDetailsUrl = getPageUrl(FormDetailsPage, { id: newForm.id });
      navigate(formDetailsUrl);
    } catch (err) {
      toast.error("שגיאה בהעלאת הקובץ");
    } finally {
      setIsSubmitting(false);
    }
  }, [uploadFile, selectedRequestTypes, selectedProviders, uploadFunction, createFunction, navigate]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const handleViewForm = useCallback((form: typeof FormsEntity['instanceType']) => {
    const formDetailsUrl = getPageUrl(FormDetailsPage, { id: form.id });
    navigate(formDetailsUrl);
  }, [navigate]);

  const handleDeleteForm = useCallback(async (form: typeof FormsEntity['instanceType']) => {
    if (!form?.id) return;

    if (!confirm(`האם אתה בטוח שברצונך למחוק את "${form.formTitleHebrew || form.formTitle || "טופס זה"}"?`)) {
      return;
    }

    try {
      await deleteFunction({ id: form.id });
      toast.success("הטופס נמחק בהצלחה");
    } catch (err) {
      toast.error("שגיאה במחיקת הטופס");
    }
  }, [deleteFunction]);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה</AlertTitle>
          <AlertDescription>
            שגיאה בטעינת הטפסים. נסה שוב מאוחר יותר.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Hidden file input for the dialog */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Upload Template Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={handleCloseUploadDialog}>
        <DialogContent className="sm:max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">העלאת טופס חדש</DialogTitle>
            <DialogDescription>
              בחר קובץ PDF, סוגי בקשות ויצרנים ליצירת טופס חדש
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* File Upload Area */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">קובץ PDF *</Label>
              {!uploadFile ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    גרור קובץ PDF לכאן או לחץ לבחירה
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF בלבד
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(uploadFile.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Request Types Multi-Select */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">סוגי בקשות *</Label>
              <div
                className={cn(
                  "relative border rounded-md",
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                <button
                  type="button"
                  className="flex items-center justify-between w-full min-h-[40px] px-3 py-2 text-sm bg-transparent hover:bg-muted/50 rounded-md transition-colors"
                  onClick={() => {
                    setRequestTypesDropdownOpen(!requestTypesDropdownOpen);
                    setProvidersDropdownOpen(false);
                  }}
                >
                  <span className={cn(
                    "truncate text-right flex-1",
                    selectedRequestTypes.length === 0 && "text-muted-foreground"
                  )}>
                    {selectedRequestTypes.length === 0
                      ? "בחר סוגי בקשות..."
                      : `${selectedRequestTypes.length} סוגי בקשות נבחרו`}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 mr-2" />
                </button>

                {requestTypesDropdownOpen && (
                  <div className="absolute z-50 w-full max-w-full mt-1 overflow-hidden rounded-md border bg-popover shadow-md">
                    <div className="h-48 overflow-y-auto overflow-x-hidden overscroll-contain p-2 flex flex-col gap-1">
                      {requestTypes && requestTypes.length > 0 ? (
                        requestTypes.map((rt) => (
                          <div
                            key={rt.id}
                            className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent"
                            onClick={() => toggleRequestType(rt.id!)}
                          >
                            <Checkbox
                              checked={selectedRequestTypes.includes(rt.id!)}
                              onCheckedChange={() => toggleRequestType(rt.id!)}
                              className="shrink-0"
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-right">
                              {rt.requestTypeName || "ללא שם"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          אין סוגי בקשות זמינים
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {selectedRequestTypes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {requestTypes
                    ?.filter((rt) => selectedRequestTypes.includes(rt.id!))
                    .map((rt) => (
                      <Badge key={rt.id} variant="secondary" className="gap-1 text-xs">
                        {rt.requestTypeName}
                        <button
                          type="button"
                          onClick={() => toggleRequestType(rt.id!)}
                          disabled={isSubmitting}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            {/* Providers Multi-Select */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">יצרנים *</Label>
              <div
                className={cn(
                  "relative border rounded-md",
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                <button
                  type="button"
                  className="flex items-center justify-between w-full min-h-[40px] px-3 py-2 text-sm bg-transparent hover:bg-muted/50 rounded-md transition-colors"
                  onClick={() => {
                    setProvidersDropdownOpen(!providersDropdownOpen);
                    setRequestTypesDropdownOpen(false);
                  }}
                >
                  <span className={cn(
                    "truncate text-right flex-1",
                    selectedProviders.length === 0 && "text-muted-foreground"
                  )}>
                    {selectedProviders.length === 0
                      ? "בחר יצרנים..."
                      : `${selectedProviders.length} יצרנים נבחרו`}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 mr-2" />
                </button>

                {providersDropdownOpen && (
                  <div className="absolute z-50 w-full max-w-full mt-1 overflow-hidden rounded-md border bg-popover shadow-md">
                    <div className="h-48 overflow-y-auto overflow-x-hidden overscroll-contain p-2 flex flex-col gap-1">
                      {providers && providers.length > 0 ? (
                        providers.map((p) => (
                          <div
                            key={p.id}
                            className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent"
                            onClick={() => toggleProvider(p.id!)}
                          >
                            <Checkbox
                              checked={selectedProviders.includes(p.id!)}
                              onCheckedChange={() => toggleProvider(p.id!)}
                              className="shrink-0"
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-right">
                              {p.provider_name || "ללא שם"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          אין יצרנים זמינים
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {selectedProviders.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {providers
                    ?.filter((p) => selectedProviders.includes(p.id!))
                    .map((p) => (
                      <Badge key={p.id} variant="secondary" className="gap-1 text-xs">
                        {p.provider_name}
                        <button
                          type="button"
                          onClick={() => toggleProvider(p.id!)}
                          disabled={isSubmitting}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCloseUploadDialog}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button
              onClick={handleSubmitUpload}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  יוצר טופס...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 ml-2" />
                  יצירת טופס
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="bg-accent text-accent-foreground p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-accent-foreground" />
            <div>
              <h1 className="text-3xl font-bold text-accent-foreground">ניהול טפסים</h1>
              <p className="text-accent-foreground/80 mt-1">ניהול תבניות טפסי ביטוח</p>
              {isLoadingForms ? (
                <Skeleton className="h-5 w-32 mt-1 bg-accent-foreground/10" />
              ) : (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-accent-foreground/15 text-accent-foreground">
                  {`סה״כ ${forms?.length ?? 0} טפסים במערכת`}
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={handleOpenUploadDialog}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 ml-2" />
            העלאת טופס
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי שם או תיאור..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
              dir="rtl"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="כל הקטגוריות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterProvider} onValueChange={setFilterProvider}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="יצרן" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל היצרנים</SelectItem>
              {providers?.map((p) => (
                <SelectItem key={p.id} value={p.id!}>
                  {p.provider_name || "ללא שם"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterRequestType} onValueChange={setFilterRequestType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="סוג בקשה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל סוגי הבקשות</SelectItem>
              {requestTypes?.map((rt) => (
                <SelectItem key={rt.id} value={rt.id!}>
                  {rt.requestTypeName || "ללא שם"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 flex-1 overflow-y-auto w-full">
        {/* Forms by Provider Pills */}
        <FormsByProviderPills
          forms={forms}
          providers={providers}
          isLoading={isLoadingForms}
          filterProvider={filterProvider}
          onFilterChange={setFilterProvider}
        />

        {isLoadingForms ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm || selectedCategory !== "all" || filterProvider !== "all" || filterRequestType !== "all" ? "לא נמצאו תבניות" : "אין תבניות עדיין"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedCategory !== "all" || filterProvider !== "all" || filterRequestType !== "all"
                ? "נסה לשנות את החיפוש או הסינון"
                : "התחל על ידי העלאת תבנית ראשונה"}
            </p>
            {!searchTerm && selectedCategory === "all" && filterProvider === "all" && filterRequestType === "all" && (
              <Button onClick={handleOpenUploadDialog}>
                <Upload className="h-4 w-4 ml-2" />
                העלאת טופס
              </Button>
            )}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right">שם טופס</TableHead>
                  <TableHead className="text-right">סוגי בקשה</TableHead>
                  <TableHead className="text-right">יצרנים</TableHead>
                  <TableHead className="text-center">שדות</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">תיאור</TableHead>
                  <TableHead className="text-left">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => {
                  const displayName = form.formTitleHebrew || form.formTitle || "טופס ללא שם";
                  const fieldsCount = Object.keys(form.fieldMapping || {}).length;

                  return (
                    <TableRow key={form.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{displayName}</TableCell>
                      <TableCell>
                        {form.requests && form.requests.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {form.requests.map((requestId) => {
                              const name = requestTypesMap.get(requestId);
                              if (!name) return null;
                              return (
                                <Badge
                                  key={requestId}
                                  variant="outline"
                                  className="bg-accent text-accent-foreground border-accent/30 text-xs"
                                >
                                  {name}
                                </Badge>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {form.providers && form.providers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {form.providers.map((providerId) => {
                              const name = providersMap.get(providerId);
                              if (!name) return null;
                              return (
                                <Badge
                                  key={providerId}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {name}
                                </Badge>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {fieldsCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {form.formStatus ? (
                          <Badge
                            variant={
                              form.formStatus === "מוכן"
                                ? "secondary"
                                : form.formStatus === "לפני מיפוי"
                                  ? "outline"
                                  : form.formStatus === "צריך לערוך קופסאות"
                                    ? "destructive"
                                    : "default"
                            }
                            className="text-xs"
                          >
                            {form.formStatus}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {form.purpose || "—"}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center justify-start gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setNotesForm({
                                id: (form as any).id,
                                title: form.formTitle || "",
                                titleHebrew: form.formTitleHebrew,
                                notes: form.notes || "",
                                currentStatus: form.formStatus || "",
                                currentImageAttachment: form.imageAttachment,
                              });
                              setNotesDialogOpen(true);
                            }}
                          >
                            <StickyNote className={cn(form.notes ? "text-primary" : "")} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`${getPageUrl(PdfFieldEditorPage)}?formId=${form.id}`)}
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewForm(form)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteForm(form)}
                            disabled={isDeleting}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {notesForm && (
        <FormNotesDialog
          open={notesDialogOpen}
          onOpenChange={setNotesDialogOpen}
          formId={notesForm.id}
          formTitle={notesForm.title}
          formTitleHebrew={notesForm.titleHebrew}
          currentNotes={notesForm.notes}
          currentStatus={notesForm.currentStatus}
          currentImageAttachment={notesForm.currentImageAttachment}
        />
      )}
    </div>
  );
}
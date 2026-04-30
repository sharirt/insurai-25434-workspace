import { useState, useCallback, useRef, useEffect } from "react";
import type { SignatureFieldType } from "@/utils/signatureFieldTypes";
import { getFieldConfig } from "@/utils/signatureFieldTypes";

export interface PlacedField {
  id: string;
  type: SignatureFieldType;
  x: number;
  y: number;
  page: number;
  width: number;
  height: number;
  signer: number;
  condition?: string;
}

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface ResizeState {
  fieldId: string;
  direction: ResizeDirection;
  startMouseX: number;
  startMouseY: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export function useSignatureFieldsDragDrop(initialFields?: PlacedField[]) {
  const [fields, setFields] = useState<PlacedField[]>(initialFields || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStateRef = useRef<ResizeState | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(1);

  const generateId = useCallback(() => {
    return `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const container = pdfContainerRef.current;
    if (container && !container.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const fieldType = e.dataTransfer.getData("fieldType") as SignatureFieldType;
      const source = e.dataTransfer.getData("source");

      if (!fieldType || source !== "palette") return;

      const container = pdfContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const config = getFieldConfig(fieldType);

      const x = Math.max(
        0,
        Math.min(
          e.clientX - rect.left + container.scrollLeft - config.defaultWidth / 2,
          container.scrollWidth - config.defaultWidth
        )
      );
      const y = Math.max(
        0,
        Math.min(
          e.clientY - rect.top + container.scrollTop - config.defaultHeight / 2,
          container.scrollHeight - config.defaultHeight
        )
      );

      // Use the current page from the ref (kept in sync by the parent component)
      const detectedPage = currentPageRef.current;

      const newField: PlacedField = {
        id: generateId(),
        type: fieldType,
        x: Math.round(x),
        y: Math.round(y),
        page: detectedPage,
        width: config.defaultWidth,
        height: config.defaultHeight,
        signer: 0,
        condition: "true",
      };

      setFields((prev) => [...prev, newField]);
    },
    [generateId]
  );

  const handleRemoveField = useCallback((fieldId: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
  }, []);

  const handleFieldMouseDown = useCallback(
    (e: React.MouseEvent, fieldId: string) => {
      if ((e.target as HTMLElement).closest("[data-delete-btn]")) return;
      e.preventDefault();
      e.stopPropagation();

      const container = pdfContainerRef.current;
      if (!container) return;

      const field = fields.find((f) => f.id === fieldId);
      if (!field) return;

      const rect = container.getBoundingClientRect();
      setDraggingFieldId(fieldId);
      dragOffsetRef.current = {
        x: e.clientX - rect.left + container.scrollLeft - field.x,
        y: e.clientY - rect.top + container.scrollTop - field.y,
      };
    },
    [fields]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingFieldId) return;

      const container = pdfContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const field = fields.find((f) => f.id === draggingFieldId);
      if (!field) return;

      const newX = Math.max(
        0,
        Math.min(
          e.clientX - rect.left + container.scrollLeft - dragOffsetRef.current.x,
          container.scrollWidth - field.width
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          e.clientY - rect.top + container.scrollTop - dragOffsetRef.current.y,
          container.scrollHeight - field.height
        )
      );

      setFields((prev) =>
        prev.map((f) =>
          f.id === draggingFieldId
            ? { ...f, x: Math.round(newX), y: Math.round(newY) }
            : f
        )
      );
    },
    [draggingFieldId, fields]
  );

  const updateFieldSigner = useCallback((fieldId: string, signer: number) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, signer } : f))
    );
  }, []);

  const handleMouseUp = useCallback(() => {
    setDraggingFieldId(null);
  }, []);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, fieldId: string, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();

      const field = fields.find((f) => f.id === fieldId);
      if (!field) return;

      resizeStateRef.current = {
        fieldId,
        direction,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: field.x,
        startY: field.y,
        startWidth: field.width,
        startHeight: field.height,
      };
      setResizingFieldId(fieldId);
    },
    [fields]
  );

  useEffect(() => {
    if (!resizingFieldId) return;

    const MIN_SIZE = 20;

    const onMouseMove = (e: MouseEvent) => {
      const rs = resizeStateRef.current;
      if (!rs) return;

      const dx = e.clientX - rs.startMouseX;
      const dy = e.clientY - rs.startMouseY;
      const dir = rs.direction;

      let newX = rs.startX;
      let newY = rs.startY;
      let newW = rs.startWidth;
      let newH = rs.startHeight;

      if (dir.includes("e")) newW = Math.max(MIN_SIZE, rs.startWidth + dx);
      if (dir.includes("w")) {
        newW = Math.max(MIN_SIZE, rs.startWidth - dx);
        newX = rs.startX + rs.startWidth - newW;
      }
      if (dir.includes("s")) newH = Math.max(MIN_SIZE, rs.startHeight + dy);
      if (dir.includes("n")) {
        newH = Math.max(MIN_SIZE, rs.startHeight - dy);
        newY = rs.startY + rs.startHeight - newH;
      }

      setFields((prev) =>
        prev.map((f) =>
          f.id === rs.fieldId
            ? { ...f, x: Math.round(newX), y: Math.round(newY), width: Math.round(newW), height: Math.round(newH) }
            : f
        )
      );
    };

    const onMouseUp = () => {
      resizeStateRef.current = null;
      setResizingFieldId(null);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizingFieldId]);

  return {
    fields,
    setFields,
    isDragOver,
    setIsDragOver,
    draggingFieldId,
    setDraggingFieldId,
    resizingFieldId,
    pdfContainerRef,
    currentPageRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveField,
    handleFieldMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeStart,
    updateFieldSigner,
  };
}
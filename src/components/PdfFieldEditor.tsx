import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Minus, Plus, Loader2, FileWarning } from "lucide-react";
import { FieldOverlay } from "@/components/FieldOverlay";
import type { EditorField } from "@/components/FieldOverlay";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageNativeSize {
  pdfW: number;
  pdfH: number;
}

interface PdfFieldEditorProps {
  fileUrl: string;
  fields: EditorField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  onMoveField: (id: string, dx: number, dy: number) => void;
  onResizeField: (id: string, dw: number, dh: number, dx: number, dy: number) => void;
}

export const PdfFieldEditor = ({
  fileUrl,
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onMoveField,
  onResizeField,
}: PdfFieldEditorProps) => {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(700);
  const nativeSizes = useRef<Map<number, PageNativeSize>>(new Map());
  const [, setRenderTick] = useState(0);

  const onDocumentLoadSuccess = ({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setCurrentPage(1);
  };

  const onPageLoadSuccess = (page: { pageNumber: number; view: number[] }) => {
    const pdfW = page.view[2];
    const pdfH = page.view[3];
    if (typeof pdfW === "number" && typeof pdfH === "number") {
      nativeSizes.current.set(page.pageNumber, { pdfW, pdfH });
      setRenderTick((t) => t + 1);
    }
  };

  const native = nativeSizes.current.get(currentPage);
  const scaleX = native ? width / native.pdfW : 1;
  const scaleY = native ? (width * native.pdfH / native.pdfW) / native.pdfH : 1;
  const renderedHeight = native ? width * native.pdfH / native.pdfW : 0;

  const pageFields = fields.filter((f) => f.page === currentPage - 1);

  const toScreen = (field: EditorField) => {
    if (!native) return null;
    const sx = field.x * scaleX;
    const sy = renderedHeight - (field.y + field.height) * scaleY;
    const sw = field.width * scaleX;
    const sh = field.height * scaleY;
    return { x: sx, y: sy, w: sw, h: sh };
  };

  return (
    <div className="flex flex-col h-full" dir="ltr">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[60px] text-center">
            {currentPage} / {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWidth((w) => Math.max(400, w - 100))}
            disabled={width <= 400}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[40px] text-center">
            {Math.round((width / 700) * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWidth((w) => Math.min(1400, w + 100))}
            disabled={width >= 1400}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* PDF area */}
      <div
        className="flex-1 overflow-auto bg-muted/30 p-4 flex justify-center"
        onClick={() => onSelectField(null)}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex h-64 w-full items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          }
          error={
            <div className="flex h-64 w-full flex-col items-center justify-center gap-2">
              <FileWarning className="size-8 text-destructive" />
            </div>
          }
        >
          <div className="relative inline-block shadow-lg" onClick={(e) => e.stopPropagation()}>
            <Page
              pageNumber={currentPage}
              width={width}
              onLoadSuccess={onPageLoadSuccess}
              renderAnnotationLayer={false}
            />
            {/* Field overlays */}
            {pageFields.map((field) => {
              const screen = toScreen(field);
              if (!screen) return null;
              return (
                <FieldOverlay
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  screenX={screen.x}
                  screenY={screen.y}
                  screenWidth={screen.w}
                  screenHeight={screen.h}
                  scaleX={scaleX}
                  scaleY={scaleY}
                  onSelect={onSelectField}
                  onDelete={onDeleteField}
                  onMove={onMoveField}
                  onResize={onResizeField}
                />
              );
            })}
          </div>
        </Document>
      </div>
    </div>
  );
};
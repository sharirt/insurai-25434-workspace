import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PdfField, FIELD_TYPE_COLORS } from "@/utils/PdfFieldTypes";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerWithOverlaysProps {
  pdfUrl: string;
  fields: PdfField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

interface PageDimensions {
  width: number;
  height: number;
}

export const PdfViewerWithOverlays = ({
  pdfUrl,
  fields,
  selectedFieldId,
  onSelectField,
}: PdfViewerWithOverlaysProps) => {
  const [numPages, setNumPages] = useState(0);
  const [pageDimensions, setPageDimensions] = useState<Record<number, PageDimensions>>({});
  const [pdfWidth] = useState(700);

  const onDocumentLoadSuccess = ({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
  };

  const onPageLoadSuccess = (pageIndex: number, page: { width: number; height: number }) => {
    setPageDimensions((prev) => ({
      ...prev,
      [pageIndex]: { width: page.width, height: page.height },
    }));
  };

  const visibleFields = fields.filter((f) => !f.isDeleted);

  return (
    <div className="flex-1 overflow-auto bg-muted/20 p-4">
      <div className="flex flex-col items-center gap-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-16">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          }
          error={
            <div className="p-8 text-center text-destructive">
              שגיאה בטעינת ה-PDF
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, i) => {
            const pageFields = visibleFields.filter((f) => f.page === i);
            const dims = pageDimensions[i];
            const scale = dims ? pdfWidth / dims.width : 1;

            return (
              <div key={i} className="relative mb-4 shadow-lg">
                <Page
                  pageNumber={i + 1}
                  width={pdfWidth}
                  onLoadSuccess={(page) =>
                    onPageLoadSuccess(i, {
                      width: page.width / (page.scale || 1),
                      height: page.height / (page.scale || 1),
                    })
                  }
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                {dims &&
                  pageFields.map((field) => {
                    const pageHeightPts = dims.height;
                    const screenX = field.x * scale;
                    const screenY = (pageHeightPts - field.y - field.height) * scale;
                    const screenW = field.width * scale;
                    const screenH = field.height * scale;
                    const color = FIELD_TYPE_COLORS[field.type];
                    const isSelected = selectedFieldId === field.id;

                    return (
                      <div
                        key={field.id}
                        className={cn(
                          "absolute cursor-pointer flex items-start overflow-hidden",
                          isSelected ? "z-10" : "z-0"
                        )}
                        style={{
                          left: `${screenX}px`,
                          top: `${screenY}px`,
                          width: `${screenW}px`,
                          height: `${screenH}px`,
                          backgroundColor: `${color}${isSelected ? "80" : "4D"}`,
                          border: isSelected
                            ? `2px solid ${color}`
                            : `1px solid ${color}66`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectField(field.id);
                        }}
                      >
                        <span
                          className="text-white px-0.5 truncate leading-tight"
                          style={{ fontSize: "10px" }}
                        >
                          {field.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
};
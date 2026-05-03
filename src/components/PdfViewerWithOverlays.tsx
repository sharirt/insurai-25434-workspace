import { useState } from "react";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { usePdfNativeSize } from "@/hooks/usePdfNativeSize";
import { PdfField } from "@/utils/PdfFieldTypes";
import { FormPdfFieldOverlay } from "@/components/FormPdfFieldOverlay";

interface PdfViewerWithOverlaysProps {
  pdfUrl: string;
  fields: PdfField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export const PdfViewerWithOverlays = ({
  pdfUrl,
  fields,
  selectedFieldId,
  onSelectField,
}: PdfViewerWithOverlaysProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const nativeSize = usePdfNativeSize(pdfUrl);

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden">
      <PdfViewer
        file={pdfUrl}
        onPageChange={(page: number) => setCurrentPage(page - 1)}
      />
      <FormPdfFieldOverlay
        key={pdfUrl}
        fields={fields}
        selectedFieldId={selectedFieldId}
        onSelectField={onSelectField}
        currentPage={currentPage}
        nativeSize={nativeSize}
      />
    </div>
  );
};

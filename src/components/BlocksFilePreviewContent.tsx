import { FilePreviewer } from "@/components/ui/file-previewer";
import { cn } from "@/lib/utils";

type BlocksFilePreviewContentProps = {
  uri: string;
  className?: string;
};

export const BlocksFilePreviewContent = ({ uri, className }: BlocksFilePreviewContentProps) => (
  <div className={cn("h-[80vh] w-full min-h-0", className)}>
    <FilePreviewer uri={uri} />
  </div>
);

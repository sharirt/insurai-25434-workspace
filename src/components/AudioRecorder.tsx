import { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useFileUpload,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { TranscribeAudioWithWhisperAction } from "@/product-types";

const CHUNK_SIZE_LIMIT = 18 * 1024 * 1024;
const OVERLAP_SECONDS = 3;

interface ChunkStatus {
  index: number;
  status: "pending" | "done" | "error";
}

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const AudioRecorder = ({
  onTranscriptionComplete,
  disabled,
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chunkStatuses, setChunkStatuses] = useState<ChunkStatus[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accumulatedSizeRef = useRef(0);
  const overlapChunksRef = useRef<Blob[]>([]);
  const chunkIndexRef = useRef(0);
  const pendingPromisesRef = useRef<Promise<void>[]>([]);

  const { uploadFunction } = useFileUpload();
  const { executeFunction } = useExecuteAction(
    TranscribeAudioWithWhisperAction
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const transcribeChunk = (blob: Blob, chunkIdx: number) => {
    setChunkStatuses((prev) => [
      ...prev,
      { index: chunkIdx, status: "pending" },
    ]);

    const promise = (async () => {
      try {
        const file = new File([blob], `recording-chunk-${chunkIdx}.webm`, {
          type: "audio/webm",
        });
        const audioFileUrl = await uploadFunction(file);
        const result = await executeFunction({ audioFileUrl });

        if (result?.success && result?.text) {
          onTranscriptionComplete(result.text);
          setChunkStatuses((prev) =>
            prev.map((c) =>
              c.index === chunkIdx ? { ...c, status: "done" } : c
            )
          );
        } else {
          setChunkStatuses((prev) =>
            prev.map((c) =>
              c.index === chunkIdx ? { ...c, status: "error" } : c
            )
          );
        }
      } catch {
        setChunkStatuses((prev) =>
          prev.map((c) =>
            c.index === chunkIdx ? { ...c, status: "error" } : c
          )
        );
      }
    })();

    pendingPromisesRef.current.push(promise);
    return promise;
  };

  const sendCurrentChunks = () => {
    const allChunks = chunksRef.current;
    if (allChunks.length === 0) return;

    const blob = new Blob(allChunks, { type: "audio/webm" });
    const chunkIdx = chunkIndexRef.current;
    chunkIndexRef.current += 1;

    // Keep last OVERLAP_SECONDS chunks as overlap
    const overlapStart = Math.max(0, allChunks.length - OVERLAP_SECONDS);
    const overlap = allChunks.slice(overlapStart);
    overlapChunksRef.current = overlap;

    const overlapSize = overlap.reduce((sum, c) => sum + c.size, 0);

    // Reset chunks with overlap prepended
    chunksRef.current = [...overlap];
    accumulatedSizeRef.current = overlapSize;

    // Transcribe in background
    transcribeChunk(blob, chunkIdx);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      accumulatedSizeRef.current = 0;
      overlapChunksRef.current = [];
      chunkIndexRef.current = 0;
      pendingPromisesRef.current = [];
      setChunkStatuses([]);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          accumulatedSizeRef.current += e.data.size;

          if (accumulatedSizeRef.current >= CHUNK_SIZE_LIMIT) {
            sendCurrentChunks();
          }
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } catch {
      toast.error("לא ניתן לגשת למיקרופון. אנא אשר הרשאות.");
    }
  };

  const stopAndTranscribe = async () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Wait for final data
    await new Promise<void>((resolve) => {
      mediaRecorder.onstop = () => {
        resolve();
      };
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    });

    setIsRecording(false);
    setIsTranscribing(true);

    // Send remaining chunks as final segment
    const remainingChunks = chunksRef.current;
    if (remainingChunks.length > 0) {
      const finalBlob = new Blob(remainingChunks, { type: "audio/webm" });
      const finalIdx = chunkIndexRef.current;
      chunkIndexRef.current += 1;
      await transcribeChunk(finalBlob, finalIdx);
    }

    // Wait for all pending transcriptions
    await Promise.all(pendingPromisesRef.current);

    toast.success("התמלול הושלם בהצלחה");

    setIsTranscribing(false);
    setChunkStatuses([]);
  };

  if (isTranscribing) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">מתמלל...</span>
      </div>
    );
  }

  if (isRecording) {
    const pendingChunks = chunkStatuses.filter((c) => c.status === "pending");
    const doneChunks = chunkStatuses.filter((c) => c.status === "done");

    return (
      <div className="flex items-center gap-3">
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-destructive" />
        </span>
        <span className="text-sm text-muted-foreground">מקליט...</span>
        <span className="text-sm font-mono text-foreground">
          {formatTime(elapsed)}
        </span>
        {chunkStatuses.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {doneChunks.map((c) => (
              <span key={c.index} className="mr-1">
                {"✓"} חלק {c.index + 1} תומלל
              </span>
            ))}
            {pendingChunks.map((c) => (
              <span key={c.index} className="mr-1">
                {"⏳"} מתמלל חלק {c.index + 1}
              </span>
            ))}
          </span>
        )}
        <Button size="sm" onClick={stopAndTranscribe}>
          <StopCircle data-icon="inline-start" />
          סיום ותמלול
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startRecording}
      disabled={disabled}
    >
      <Mic data-icon="inline-start" />
      הקלט פגישה
    </Button>
  );
};
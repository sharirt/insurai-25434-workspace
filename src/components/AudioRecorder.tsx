import { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useFileUpload,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { TranscribeAudioWithWhisperAction } from "@/product-types";

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { uploadFunction, isLoading: isUploading } = useFileUpload();
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
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

    const audioBlob = await new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        resolve(blob);
      };
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    });

    setIsRecording(false);
    setIsTranscribing(true);

    try {
      const file = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });
      const audioFileUrl = await uploadFunction(file);

      const result = await executeFunction({ audioFileUrl });

      if (result?.success && result?.text) {
        onTranscriptionComplete(result.text);
        toast.success("התמלול הושלם בהצלחה");
      } else {
        toast.error(result?.error || "שגיאה בתמלול. נסה שוב.");
      }
    } catch {
      toast.error("שגיאה בתמלול. נסה שוב.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const isBusy = isTranscribing || isUploading;

  if (isBusy) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">מתמלל...</span>
      </div>
    );
  }

  if (isRecording) {
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
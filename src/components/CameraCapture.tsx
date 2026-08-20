import { useEffect, useRef, useState } from "react";
import { Camera, X, SwitchCamera, ImageUp } from "lucide-react";

type Props = {
  onCapture: (dataUrl: string, label: string) => void;
  onClose: () => void;
  onPickFile: () => void;
};

export function CameraCapture({ onCapture, onClose, onPickFile }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(null);

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera is not available in this browser.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof DOMException && e.name === "NotAllowedError"
              ? "Camera permission was blocked. Allow camera access, or upload a photo instead."
              : "No camera found on this device. You can upload a photo instead.",
          );
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [facing]);

  const shoot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", 0.85), "Live camera capture");
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="font-display text-lg font-black uppercase tracking-tight">
          Live Camera
        </span>
        <button
          onClick={onClose}
          aria-label="Close camera"
          className="rounded-full border-2 border-border p-2 transition-colors hover:border-primary hover:text-primary"
        >
          <X className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-2xl flex-1 overflow-hidden rounded-3xl border-2 border-primary/60 bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-base font-bold text-muted-foreground">
            {error ?? "Starting camera…"}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 px-5 py-6">
        <button
          onClick={onPickFile}
          aria-label="Upload a photo instead"
          className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border px-4 py-3 text-xs font-black uppercase transition-colors hover:border-primary hover:text-primary"
        >
          <ImageUp className="h-6 w-6" strokeWidth={2.5} />
          Upload
        </button>

        <button
          onClick={shoot}
          disabled={!ready}
          aria-label="Capture photo"
          className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary bg-primary text-primary-foreground shadow-[0_0_50px_color-mix(in_oklab,var(--primary)_45%,transparent)] transition-transform active:scale-95 disabled:opacity-40"
        >
          <Camera className="h-11 w-11" strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
          aria-label="Switch camera"
          className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border px-4 py-3 text-xs font-black uppercase transition-colors hover:border-primary hover:text-primary"
        >
          <SwitchCamera className="h-6 w-6" strokeWidth={2.5} />
          Flip
        </button>
      </div>
    </div>
  );
}

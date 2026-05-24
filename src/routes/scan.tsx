import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Upload, MessageSquare, Send } from "lucide-react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan Hub — SafeHouse DIY" },
      { name: "description", content: "Describe or photograph your home problem to get a step-by-step fix." },
    ],
  }),
  component: ScanHub,
});

function ScanHub() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">What needs fixing?</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tell us about the problem — in words, a photo, or a video.
        </p>
      </div>

      {/* Text input */}
      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
        <label htmlFor="describe" className="flex items-center gap-2 text-lg font-black">
          <MessageSquare className="h-6 w-6 text-primary" strokeWidth={2.5} />
          Describe the problem
        </label>
        <p className="mt-1 text-base text-muted-foreground">
          Example: "My kitchen sink is dripping under the cabinet."
        </p>
        <textarea
          id="describe"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here..."
          rows={5}
          className="mt-3 w-full resize-none rounded-2xl border-2 border-input bg-background p-4 text-lg focus:border-primary focus:outline-none"
        />
      </section>

      <div className="flex items-center gap-4">
        <div className="h-0.5 flex-1 bg-border" />
        <span className="font-display text-lg font-bold text-muted-foreground">OR</span>
        <div className="h-0.5 flex-1 bg-border" />
      </div>

      {/* Upload */}
      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm">
        <p className="flex items-center gap-2 text-lg font-black">
          <Camera className="h-6 w-6 text-primary" strokeWidth={2.5} />
          Take a photo or video
        </p>
        <p className="mt-1 text-base text-muted-foreground">
          A clear picture helps us help you faster.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 text-primary transition-colors hover:bg-primary/10">
            <Camera className="h-9 w-9" strokeWidth={2.5} />
            <span className="text-base font-bold">Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
          <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 text-primary transition-colors hover:bg-primary/10">
            <Upload className="h-9 w-9" strokeWidth={2.5} />
            <span className="text-base font-bold">Video / File</span>
            <input
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>

        {fileName && (
          <p className="mt-3 rounded-xl bg-success/15 px-4 py-3 text-base font-bold text-success">
            ✓ Added: {fileName}
          </p>
        )}
      </section>

      <button
        onClick={() => navigate({ to: "/fix" })}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-xl font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98]"
      >
        <Send className="h-6 w-6" strokeWidth={2.5} />
        Get My Fix Guide
      </button>
    </div>
  );
}

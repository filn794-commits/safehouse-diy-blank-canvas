import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Video,
  Star,
  ShieldCheck,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ArrowLeft,
} from "lucide-react";
import bobAvatar from "@/assets/mentor-bob.jpg";
import daveAvatar from "@/assets/mentor-dave.jpg";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "Video Call a Mentor — PocketPro AI" },
      {
        name: "description",
        content:
          "Live 1-on-1 video help from a certified maintenance mentor. Friendly, patient, and beginner-safe.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Home Repair Consultation",
          "provider": {
            "@type": "Organization",
            "name": "PocketPro AI",
            "url": "https://safehouse-diy-blank-canvas.lovable.app/",
          },
          "description": "Live 1-on-1 video help from a certified maintenance mentor for home repairs, DIY guidance, and contractor quote review.",
          "offers": {
            "@type": "Offer",
            "price": "5.00",
            "priceCurrency": "USD",
            "description": "$5.00 flat fee per consultation",
          },
        }),
      },
    ],
  }),
  component: MentorView,
});

type Mentor = {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  calls: string;
  avatar: string;
};

const MENTORS: Mentor[] = [
  {
    id: "bob",
    name: "Bob M.",
    specialty: "Retired Master Plumber (30+ Yrs Exp)",
    rating: "5.0",
    calls: "420+ Calls",
    avatar: bobAvatar,
  },
  {
    id: "dave",
    name: "Dave K.",
    specialty: "General Home Repair Specialist",
    rating: "4.9",
    calls: "310+ Calls",
    avatar: daveAvatar,
  },
];

function MentorView() {
  const [callingMentor, setCallingMentor] = useState<Mentor | null>(null);
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // After ringing for 3.5s, "connect" the call.
  useEffect(() => {
    if (!callingMentor || connected) return;
    const t = setTimeout(() => setConnected(true), 3500);
    return () => clearTimeout(t);
  }, [callingMentor, connected]);

  // Call timer once connected.
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const startCall = (mentor: Mentor) => {
    setCallingMentor(mentor);
    setConnected(false);
    setSeconds(0);
    setMuted(false);
    setVideoOff(false);
  };

  const endCall = () => {
    setCallingMentor(null);
    setConnected(false);
    setSeconds(0);
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2">
          <Video className="h-7 w-7 text-primary" strokeWidth={2.5} />
          <p className="text-base font-bold uppercase tracking-wider text-primary">
            Expert Live Connect
          </p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight">
          Need a Hand? Video Call a Certified Maintenance Mentor 🛠️
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Perfect for single moms and beginners. A friendly pro will walk you
          through your repair step-by-step over live video.
        </p>
      </section>

      {/* Trust banner */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-success/40 bg-success/10 p-4">
        <ShieldCheck className="h-7 w-7 shrink-0 text-success" strokeWidth={2.5} />
        <p className="text-base font-bold leading-snug">
          All mentors are background-checked, certified, and rated 4.8★ or higher.
        </p>
      </div>

      {/* Mentor Availability */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">Mentor Availability</h2>
          <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-black text-success">
            2 Online Now
          </span>
        </div>

        <ul className="space-y-4">
          {MENTORS.map((m) => (
            <li
              key={m.id}
              className="rounded-3xl border-2 border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={m.avatar}
                    alt={`${m.name} portrait`}
                    width={88}
                    height={88}
                    loading="lazy"
                    className="h-22 w-22 h-[88px] w-[88px] rounded-2xl border-2 border-border object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-card bg-success"
                  >
                    <span className="h-2.5 w-2.5 animate-ping rounded-full bg-success-foreground/60" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-black leading-tight">
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-base font-bold text-muted-foreground">
                    {m.specialty}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1 text-base font-black">
                      <Star
                        className="h-4 w-4 fill-warning text-warning"
                        strokeWidth={2.5}
                      />
                      {m.rating}
                      <span className="ml-1 text-sm font-bold text-muted-foreground">
                        ({m.calls})
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                    </span>
                    <span className="text-sm font-black text-success">
                      Online &amp; Ready to Help
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <button
        onClick={() => startCall(MENTORS[0])}
        className="w-full rounded-3xl bg-success px-6 py-6 text-center text-success-foreground shadow-xl transition-transform active:scale-[0.98]"
      >
        <span className="flex items-center justify-center gap-3 font-display text-2xl font-black leading-tight">
          <Video className="h-7 w-7" strokeWidth={2.5} />
          Start Instant 1-on-1 Consultation
        </span>
        <span className="mt-1 block text-base font-bold opacity-90">
          $5.00 flat fee · Cancel anytime
        </span>
      </button>

      <p className="text-center text-sm font-bold text-muted-foreground">
        Average wait time:{" "}
        <span className="text-success">under 45 seconds</span>
      </p>

      {/* Incoming Call Overlay */}
      {callingMentor && (
        <CallOverlay
          mentor={callingMentor}
          connected={connected}
          timer={mmss}
          muted={muted}
          videoOff={videoOff}
          onToggleMute={() => setMuted((m) => !m)}
          onToggleVideo={() => setVideoOff((v) => !v)}
          onEnd={endCall}
        />
      )}
    </div>
  );
}

function CallOverlay({
  mentor,
  connected,
  timer,
  muted,
  videoOff,
  onToggleMute,
  onToggleVideo,
  onEnd,
}: {
  mentor: Mentor;
  connected: boolean;
  timer: string;
  muted: boolean;
  videoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEnd: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={connected ? "In call" : "Calling mentor"}
      className="fixed inset-0 z-[100] flex flex-col bg-foreground text-background animate-fade-in"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <button
          onClick={onEnd}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/10 text-background"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-widest opacity-70">
            {connected ? "Live" : "Calling…"}
          </p>
          <p className="font-display text-lg font-black">
            {connected ? timer : "Connecting"}
          </p>
        </div>
        <div className="h-11 w-11" />
      </div>

      {/* Main video stage */}
      <div className="relative mx-5 flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/30 to-foreground">
        {/* Mentor "video" placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="relative">
            {/* Ringing rings */}
            {!connected && (
              <>
                <span className="absolute inset-0 -m-6 animate-ping rounded-full bg-success/30" />
                <span
                  className="absolute inset-0 -m-12 animate-ping rounded-full bg-success/20"
                  style={{ animationDelay: "300ms" }}
                />
              </>
            )}
            <img
              src={mentor.avatar}
              alt={`${mentor.name} portrait`}
              width={160}
              height={160}
              className="relative h-40 w-40 rounded-full border-4 border-background/30 object-cover shadow-2xl"
            />
            {connected && (
              <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-4 border-foreground bg-success" />
            )}
          </div>
          <div>
            <p className="font-display text-3xl font-black">{mentor.name}</p>
            <p className="mt-1 text-base font-bold opacity-80">
              {mentor.specialty}
            </p>
          </div>
          <p
            className={`rounded-full px-4 py-1.5 text-sm font-black uppercase tracking-widest ${
              connected
                ? "bg-success text-success-foreground"
                : "bg-background/10 text-background"
            }`}
          >
            {connected ? "● Live · HD Video" : "Ringing…"}
          </p>
        </div>

        {/* "Your camera" PiP */}
        <div className="absolute bottom-4 right-4 h-32 w-24 overflow-hidden rounded-2xl border-2 border-background/40 bg-background/10 backdrop-blur-sm">
          {videoOff ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-background">
              <VideoOff className="h-6 w-6" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase">Off</span>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/40 to-accent/40">
              <span className="text-3xl">🙂</span>
            </div>
          )}
          <span className="absolute bottom-1 left-1 rounded bg-foreground/60 px-1.5 py-0.5 text-[10px] font-black text-background">
            YOU
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onToggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors ${
              muted
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "border-background/30 bg-background/10 text-background"
            }`}
          >
            {muted ? (
              <MicOff className="h-7 w-7" strokeWidth={2.5} />
            ) : (
              <Mic className="h-7 w-7" strokeWidth={2.5} />
            )}
          </button>

          <button
            onClick={onEnd}
            aria-label="End call"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-2xl transition-transform active:scale-95"
          >
            <PhoneOff className="h-9 w-9" strokeWidth={2.75} />
          </button>

          <button
            onClick={onToggleVideo}
            aria-label={videoOff ? "Turn camera on" : "Turn camera off"}
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors ${
              videoOff
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "border-background/30 bg-background/10 text-background"
            }`}
          >
            {videoOff ? (
              <VideoOff className="h-7 w-7" strokeWidth={2.5} />
            ) : (
              <Video className="h-7 w-7" strokeWidth={2.5} />
            )}
          </button>
        </div>
        <p className="mt-4 text-center text-sm font-bold text-background/70">
          End Call to return to PocketPro AI
        </p>
      </div>
    </div>
  );
}

// Export Link to placate tree-shaking when used elsewhere; not strictly required.
export { Link };

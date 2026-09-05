"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Trophy,
  UserPlus,
  MessageCircle,
  CreditCard,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Zap,
  Film,
  Maximize2,
  Check,
  Copy,
  Flame,
  ShieldCheck,
  Video,
} from "lucide-react";
import { ARENEX_BKASH_RECIPIENT_NUMBER } from "@/lib/constants";

interface TutorialScene {
  id: number;
  title: string;
  tagline: string;
  durationSeconds: number;
  icon: React.ElementType;
  color: string;
  banglaVoiceScript: string;
  banglaSubtitles: string[];
  mockupType: "home" | "signup" | "whatsapp" | "tournament" | "payment" | "room" | "payout";
}

export const TUTORIAL_SCENES: TutorialScene[] = [
  {
    id: 1,
    title: "ওয়েবসাইটে প্রবেশ ও প্ল্যাটফর্ম পরিচিতি",
    tagline: "Scene 1: Welcome to ARENEX Esports Arena",
    durationSeconds: 10,
    icon: Trophy,
    color: "from-brand-crimson to-brand-crimsonDark",
    banglaVoiceScript:
      "আসসালামু আলাইকুম এবং এরেনেক্স ইস্পোর্টস প্ল্যাটফর্মে আপনাকে স্বাগতম। এটি বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং অটোমেটেড ফ্রি ফায়ার টুর্নামেন্ট প্ল্যাটফর্ম, যেখানে আপনি প্রতিদিন কাস্টম টুর্নামেন্ট খেলে নিশ্চিত প্রাইজমানি জিতে নিতে পারবেন।",
    banglaSubtitles: [
      "স্বাগতম ARENEX Esports Arena-তে!",
      "বাংলাদেশের বিশ্বস্ত ও অটোমেটেড ফ্রি ফায়ার টুর্নামেন্ট প্ল্যাটফর্ম",
      "প্রতিদিন খেলুন কাস্টম ম্যাচ ও জিতে নিন নিশ্চিত বিকাশ ক্যাশ রিওয়ার্ড",
    ],
    mockupType: "home",
  },
  {
    id: 2,
    title: "অ্যাকাউন্ট তৈরি ও Free Fire UID লিংক",
    tagline: "Scene 2: One-Click Registration & In-Game Identity",
    durationSeconds: 12,
    icon: UserPlus,
    color: "from-cyan-500 to-blue-600",
    banglaVoiceScript:
      "প্রথমে উপরের সাইন আপ বাটনে ক্লিক করুন। আপনার নাম, ইমেইল এবং পাসওয়ার্ড দিয়ে সহজেই অ্যাকাউন্ট তৈরি করুন। এরপর প্রোফাইল অপশন থেকে আপনার ফ্রি ফায়ার ইন-গেম নেম এবং গেম ইউআইডি যুক্ত করে নিন, যাতে রেফারি আপনার কিল এবং প্লেসমেন্ট নিখুঁতভাবে ট্র্যাক করতে পারে।",
    banglaSubtitles: [
      "১. Sign Up বাটনে ক্লিক করে ইমেইল ও পাসওয়ার্ড দিয়ে একাউন্ট খুলুন",
      "২. প্রোফাইল থেকে আপনার Free Fire In-Game Name (IGN) দিন",
      "৩. আপনার সঠিক Free Fire UID লিংক করে সেভ করুন",
    ],
    mockupType: "signup",
  },
  {
    id: 3,
    title: "অফিসিয়াল হোয়াটসঅ্যাপ চ্যানেলে যুক্ত হওয়া",
    tagline: "Scene 3: Join Official WhatsApp Community",
    durationSeconds: 9,
    icon: MessageCircle,
    color: "from-emerald-500 to-green-600",
    banglaVoiceScript:
      "যেকোনো টুর্নামেন্টের নোটিফিকেশন, ম্যাচ শিডিউল এবং দ্রুত সাপোর্টের জন্য ফুটারে দেওয়া আমাদের অফিশিয়াল হোয়াটসঅ্যাপ চ্যানেলে জয়েন করুন। সেখানে সমস্ত অফিশিয়াল আপডেট সরাসরি পেয়ে যাবেন।",
    banglaSubtitles: [
      "সব আপডেট দ্রুত পেতে আমাদের অফিসিয়াল WhatsApp চ্যানেলে যুক্ত থাকুন",
      "ক্লিক করুন: https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f",
      "লাইভ সাপোর্ট ও ম্যাচ নোটিফিকেশন সরাসরি হোয়াটসঅ্যাপে পাবেন",
    ],
    mockupType: "whatsapp",
  },
  {
    id: 4,
    title: "টুর্নামেন্ট নির্বাচন ও স্লট বুকিং",
    tagline: "Scene 4: Select Tournament & Reserve Slot",
    durationSeconds: 10,
    icon: Zap,
    color: "from-brand-gold to-amber-600",
    banglaVoiceScript:
      "এবার টুর্নামেন্টস মেনু থেকে আপনার পছন্দের একক বা স্কোয়াড টুর্নামেন্ট সিলেক্ট করুন। প্রাইজপুল, এন্ট্রি ফি এবং ম্যাচ শুরুর সময় দেখে নিয়ে Claim Spot বাটনে ক্লিক করে আপনার আসনটি লক করে নিন।",
    banglaSubtitles: [
      "১. Tournaments মেনু থেকে আপনার পছন্দের ম্যাচটি বেছে নিন",
      "২. এন্ট্রি ফি, প্রাইজপুল এবং ম্যাচ টাইম দেখে নিন",
      "৩. Claim Your Spot বাটনে ক্লিক করে স্লট লক করুন",
    ],
    mockupType: "tournament",
  },
  {
    id: 5,
    title: "বিকাশ/নগদে ফি প্রদান ও TrxID সাবমিট",
    tagline: "Scene 5: Secure bKash Payment & TrxID Verification",
    durationSeconds: 14,
    icon: CreditCard,
    color: "from-[#e2136e] to-pink-700",
    banglaVoiceScript:
      "স্ক্রিনে দেওয়া আমাদের বিকাশ নাম্বারে সেন্ড মানি বা পেমেন্ট করে টুর্নামেন্ট ফি পাঠিয়ে দিন। পেমেন্ট শেষ হলে বিকাশ অ্যাপ বা এসএমএস থেকে দশ সংখ্যার ট্রানজ্যাকশন আইডি কপি করে বক্সে পেস্ট করুন এবং সাবমিট বাটনে চাপ দিন। আপনার পেমেন্ট সাথে সাথে ভেরিফিকেশনে চলে যাবে।",
    banglaSubtitles: [
      `১. বিকাশ নাম্বারে (${ARENEX_BKASH_RECIPIENT_NUMBER}) টুর্নামেন্ট ফি Send Money করুন`,
      "২. বিকাশ কনফার্মেশন থেকে ১০-সংখ্যার Transaction ID (TrxID) কপি করুন",
      "৩. TrxID এবং সেন্ডার নাম্বার বসিয়ে Confirm Payment চাপুন",
    ],
    mockupType: "payment",
  },
  {
    id: 6,
    title: "ম্যাচ রুম ও টাইমড রুম আইডি/পাসওয়ার্ড আনলক",
    tagline: "Scene 6: Check-in & Timed Custom Room Gate",
    durationSeconds: 12,
    icon: Unlock,
    color: "from-cyan-400 to-indigo-600",
    banglaVoiceScript:
      "ম্যাচ শুরুর আগে টুর্নামেন্ট রুম গেটে প্রবেশ করে চেক-ইন কনফার্ম করুন। রেজিস্ট্রেশন ক্লোজ ও শিডিউল রিলিজ টাইমে স্বয়ংক্রিয় কাউন্টডাউন শেষ হওয়ার সাথে সাথে আপনার অ্যাকাউন্টে কাস্টম রুম আইডি ও পাসওয়ার্ড ভেসে উঠবে। ওয়ান-ক্লিকে কপি করে ফ্রি ফায়ার গেমে ঢুকে পড়ুন।",
    banglaSubtitles: [
      "১. টুর্নামেন্ট রুম পেজে ঢুকে 'Confirm Check-In' সম্পন্ন করুন",
      "২. টাইমড কাউন্টডাউন শেষ হওয়ার সাথে সাথে Room ID & Password আনলক হবে",
      "৩. ওয়ান-ক্লিকে Room ID ও Password কপি করে ফ্রি ফায়ারে জয়েন করুন",
    ],
    mockupType: "room",
  },
  {
    id: 7,
    title: "খেলা শেষে সরাসরি বিকাশ ওয়ালেটে প্রাইজমানি গ্রহণ",
    tagline: "Scene 7: Live Referee Scoring & Instant Payouts",
    durationSeconds: 10,
    icon: Trophy,
    color: "from-emerald-400 to-teal-600",
    banglaVoiceScript:
      "ম্যাচ চলাকালীন অফিশিয়াল রেফারি লাইভ স্কোরিং করবেন। ম্যাচ শেষ হলে আপনি উইনার বা টপ ফ্রাগার হলে সাথে সাথে আপনার অ্যাকাউন্টে প্রাইজমানি যোগ হয়ে যাবে এবং তা সরাসরি আপনার বিকাশ নাম্বারে ক্যাশআউট করে নিতে পারবেন।",
    banglaSubtitles: [
      "রেফারি লাইভ কিল ও প্লেসমেন্ট স্কোর রেকর্ড করবেন",
      "উইনার ও টপ ফ্রাগার প্রাইজমানি স্বয়ংক্রিয়ভাবে ব্যালেন্সে যুক্ত হবে",
      "আপনার বিকাশ বা নগদ নাম্বারে সরাসরি ক্যাশআউট গ্রহণ করুন!",
    ],
    mockupType: "payout",
  },
];

interface VideoTutorialPlayerProps {
  externalVideoUrl?: string;
}

export function VideoTutorialPlayer({ externalVideoUrl }: VideoTutorialPlayerProps) {
  const [activeTab, setActiveTab] = useState<"simulator" | "video">("simulator");
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentScene = TUTORIAL_SCENES[currentSceneIndex];

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Male Voice Synthesis Handler (Optimized for deep, natural Bengali male tone)
  const playMaleVoiceNarration = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "bn-BD";
    // Natural male vocal characteristics: slightly deeper pitch & steady pacing
    utterance.pitch = 0.85;
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize Bengali male voices if present on system
    const maleVoice = voices.find(
      (v) =>
        (v.lang.includes("bn") || v.lang.includes("Bengali")) &&
        (v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("ripon") ||
          v.name.toLowerCase().includes("bashir") ||
          v.name.toLowerCase().includes("natural"))
    ) || voices.find((v) => v.lang.includes("bn") || v.lang.includes("Bengali"));

    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    playMaleVoiceNarration(currentScene.banglaVoiceScript);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleSceneChange = (index: number) => {
    const nextIndex = Math.max(0, Math.min(TUTORIAL_SCENES.length - 1, index));
    setCurrentSceneIndex(nextIndex);
    setProgress(0);
    if (isPlaying) {
      playMaleVoiceNarration(TUTORIAL_SCENES[nextIndex].banglaVoiceScript);
    }
  };

  // Progress ticker when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeTab === "simulator") {
      const stepMs = 100;
      const totalMs = currentScene.durationSeconds * 1000;
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (stepMs / totalMs) * 100;
          if (next >= 100) {
            if (currentSceneIndex < TUTORIAL_SCENES.length - 1) {
              handleSceneChange(currentSceneIndex + 1);
            } else {
              setIsPlaying(false);
            }
            return 0;
          }
          return next;
        });
      }, stepMs);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex, currentScene, activeTab]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else if (isPlaying) {
      playMaleVoiceNarration(currentScene.banglaVoiceScript);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-surface-100 border border-surface-border overflow-hidden shadow-2xl relative w-full">
      {/* Top Bar: Mode Switcher & Title */}
      <div className="bg-surface-200/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Badge & Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-crimson/15 border border-brand-crimson/30 flex items-center justify-center text-brand-crimson shrink-0">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-brand-crimson animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson font-bold">
                OFFICIAL WALKTHROUGH
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[9px] sm:text-[10px] font-bold border border-emerald-500/30">
                MALE VOICE (BUNTY AI)
              </span>
            </div>
            <h3 className="font-display text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
              ARENEX টুর্নামেন্টে অংশগ্রহণের সম্পূর্ণ গাইড
            </h3>
          </div>
        </div>

        {/* Right: Tab Mode Switcher */}
        <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-surface-border self-start md:self-auto font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab("simulator");
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === "simulator"
                ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/30"
                : "text-slate-600 dark:text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ইন্টারেক্টিভ সিমুলেটর</span>
          </button>
          <button
            onClick={() => {
              handlePause();
              setActiveTab("video");
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === "video"
                ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/30"
                : "text-slate-600 dark:text-gray-400 hover:text-white"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>ফুল ভিডিও (MP4)</span>
          </button>
        </div>
      </div>

      {activeTab === "simulator" ? (
        <>
          {/* Responsive Chapter Stepper Bar */}
          <div className="bg-surface-200/60 px-4 sm:px-6 py-2.5 border-b border-surface-border flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
              {TUTORIAL_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneChange(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                    currentSceneIndex === idx
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm"
                      : "bg-surface-100/60 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-transparent"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-surface-200 flex items-center justify-center text-[9px] font-black">
                    {idx + 1}
                  </span>
                  <span className="hidden md:inline">{scene.title.slice(0, 14)}...</span>
                </button>
              ))}
            </div>

            {/* Audio Mute Toggle */}
            <button
              onClick={toggleMute}
              className="p-1.5 sm:p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-border text-gray-300 hover:text-white transition-all shrink-0 ml-2"
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              )}
            </button>
          </div>

          {/* Main Simulated Display Screen */}
          <div className="relative min-h-[380px] sm:min-h-[460px] md:aspect-[16/9] bg-[#070b13] overflow-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8">
            {/* Cyber Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2136e_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            {/* Top Scene Tracker Header */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] sm:text-xs font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-brand-crimson animate-pulse" />
                <span className="font-bold">SCENE {currentSceneIndex + 1} OF 7</span>
                <span className="text-gray-500 hidden sm:inline">|</span>
                <span className="text-cyan-400 font-bold hidden sm:inline">{currentScene.title}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">⏱ {currentScene.durationSeconds}s</span>
              </div>
            </div>

            {/* Central Animated Mockup Graphic */}
            <div className="relative z-10 max-w-xl mx-auto w-full my-auto py-4">
              {/* Central Play Overlay Button when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-2xl">
                  <button
                    onClick={handlePlay}
                    className="p-5 sm:p-6 rounded-full bg-brand-crimson hover:bg-brand-crimsonDark text-white shadow-2xl shadow-brand-crimson/50 hover:scale-110 active:scale-95 transition-all group border-2 border-white/20"
                    title="Play Walkthrough"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5 group-hover:animate-pulse" />
                  </button>
                </div>
              )}

              {/* Scene 1: Welcome & Landing */}
              {currentScene.mockupType === "home" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-surface-100/95 border border-surface-border/90 backdrop-blur-md shadow-2xl space-y-3.5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30 flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-lg sm:text-2xl font-black text-white uppercase tracking-tight">
                    Welcome to ARENEX Arena
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-md mx-auto">
                    বাংলাদেশের বিশ্বস্ত ও অটোমেটেড ফ্রি ফায়ার টুর্নামেন্ট হাব। কাস্টম ম্যাচ খেলুন ও নিশ্চিত ক্যাশ প্রাইজ জিতুন।
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-[10px] sm:text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      ✓ 100% bKash Verification
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      ✓ Instant Timed Room Gate
                    </span>
                  </div>
                </div>
              )}

              {/* Scene 2: Signup & In-game UID */}
              {currentScene.mockupType === "signup" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-surface-100/95 border border-surface-border/90 backdrop-blur-md shadow-2xl space-y-3 text-center max-w-md mx-auto">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2 text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5" />
                      Player Identity Setup
                    </span>
                    <span className="text-emerald-400 font-bold">✓ Profile Linked</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200 border border-surface-border text-left font-mono text-xs space-y-1.5">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Free Fire IGN (নাম)</span>
                      <span className="font-bold text-brand-crimson text-sm block">ALPHA〆KILLER</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Free Fire UID</span>
                      <span className="font-bold text-white tracking-widest text-sm block">1098234871</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 block">
                    রেফারি আপনার এই গেম ইউআইডি দেখে কিল ও পয়েন্ট ট্র্যাক করবেন।
                  </span>
                </div>
              )}

              {/* Scene 3: WhatsApp Community */}
              {currentScene.mockupType === "whatsapp" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-surface-100/95 border border-surface-border/90 backdrop-blur-md shadow-2xl space-y-3.5 text-center max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-black text-white uppercase">
                    ARENEX Official WhatsApp Channel
                  </h4>
                  <p className="text-xs text-gray-300 font-sans">
                    ম্যাচ শিডিউল, জরুরি নোটিফিকেশন ও দ্রুত লাইভ সাপোর্টের জন্য আমাদের অফিশিয়াল চ্যানেলে যুক্ত থাকুন।
                  </p>
                  <a
                    href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>Join WhatsApp Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Scene 4: Tournament Selection & Slot Booking */}
              {currentScene.mockupType === "tournament" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-surface-100/95 border border-surface-border/90 backdrop-blur-md shadow-2xl space-y-3.5 text-center max-w-lg mx-auto">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="font-display font-black text-white uppercase text-xs sm:text-sm">
                      Dhaka Night Battle — Solo Cup
                    </span>
                    <span className="px-2 py-0.5 rounded bg-brand-crimson text-white text-[10px] font-mono font-bold">
                      SOLO BR
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-left font-mono text-xs">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-gray-400 uppercase block">Entry Fee</span>
                      <span className="font-bold text-white text-xs sm:text-sm">৳50.00</span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-gray-400 uppercase block">Prize Pool</span>
                      <span className="font-bold text-amber-400 text-xs sm:text-sm">৳2,000.00</span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-gray-400 uppercase block">Slots</span>
                      <span className="font-bold text-cyan-400 text-xs sm:text-sm">24 / 48</span>
                    </div>
                  </div>
                  <div className="py-2.5 rounded-xl bg-brand-crimson text-white font-display font-bold text-xs uppercase tracking-wider shadow-md">
                    Claim Spot & Lock Ticket →
                  </div>
                </div>
              )}

              {/* Scene 5: bKash Fee Payment */}
              {currentScene.mockupType === "payment" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-surface-100/95 border border-[#e2136e]/50 backdrop-blur-md shadow-2xl space-y-3 max-w-md mx-auto">
                  <div className="bg-[#e2136e] -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 p-3 rounded-t-2xl flex items-center justify-between text-white font-display font-black text-xs uppercase tracking-wider">
                    <span>bKash Secure Checkout</span>
                    <span>Slot #12 Locked</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200 border border-surface-border text-left font-mono text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[11px]">Send Money To:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#e2136e] text-xs sm:text-sm">
                          {ARENEX_BKASH_RECIPIENT_NUMBER}
                        </span>
                        <button
                          onClick={() => handleCopy(ARENEX_BKASH_RECIPIENT_NUMBER, "bkash")}
                          className="p-1 rounded bg-surface-100 hover:bg-surface-elevated text-gray-400 hover:text-white"
                          title="Copy bKash Number"
                        >
                          {copiedKey === "bkash" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[11px]">TrxID Submitted:</span>
                      <span className="font-bold text-cyan-400 text-xs sm:text-sm">BL92A8ZK91</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[11px]">Verification:</span>
                      <span className="font-bold text-emerald-400 text-[10px] uppercase">
                        ✓ Instant Approved
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scene 6: Timed Room Decryption Gate */}
              {currentScene.mockupType === "room" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-cyan-950/40 border-2 border-cyan-500/50 backdrop-blur-md shadow-2xl space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-cyan-300">
                    <div className="flex items-center gap-1.5">
                      <Unlock className="w-4 h-4 text-cyan-400" />
                      <span className="font-display font-black text-xs uppercase tracking-wider">
                        Custom Room Unlocked
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ Check-in Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-left font-mono">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Room ID</span>
                      <span className="font-bold text-white text-base sm:text-lg tracking-wider">ARENEX-8291</span>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-xl bg-surface-200 border border-surface-border">
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Password</span>
                      <span className="font-bold text-cyan-300 text-base sm:text-lg tracking-wider">1234</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 block text-center">
                    ফ্রি ফায়ার খুলে Custom Room এ আইডি ও পাসওয়ার্ড দিয়ে জয়েন করুন।
                  </span>
                </div>
              )}

              {/* Scene 7: Scoring & Cash Payout */}
              {currentScene.mockupType === "payout" && (
                <div className="p-5 sm:p-7 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl space-y-3 text-center max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 text-brand-gold border border-brand-gold/30 flex items-center justify-center mx-auto">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-lg sm:text-xl font-black text-white uppercase">
                    Prize Credited to Wallet!
                  </h4>
                  <div className="p-3 rounded-xl bg-surface-200 border border-surface-border font-mono text-xs flex items-center justify-between">
                    <span className="text-gray-400">1st Place + Top Fragger:</span>
                    <span className="font-bold text-brand-gold text-sm sm:text-base">৳1,500.00 BDT</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                    ✓ সরাসরি আপনার বিকাশ বা নগদ নাম্বারে ক্যাশআউট সম্পন্ন!
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Subtitles Bar */}
            <div className="relative z-10 bg-black/85 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-gray-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {currentScene.title}
                </span>
                <span className="text-cyan-400 font-bold hidden sm:inline">{currentScene.tagline}</span>
              </div>

              <div className="text-xs sm:text-sm font-sans font-medium text-slate-100 dark:text-gray-200 text-left leading-relaxed">
                {currentScene.banglaSubtitles.map((sub, i) => (
                  <p key={i} className="flex items-start sm:items-center gap-1.5">
                    <span className="text-brand-crimson font-bold shrink-0">›</span>
                    <span>{sub}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Video Timeline Progress Bar */}
          <div className="w-full bg-surface-200 h-1.5 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-crimson via-cyan-400 to-emerald-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(226,19,110,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Bottom Video Controls Bar */}
          <div className="p-3.5 sm:p-5 bg-surface-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Play / Pause / Navigation */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => handleSceneChange(currentSceneIndex - 1)}
                disabled={currentSceneIndex === 0}
                className="p-2 sm:p-2.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border text-slate-700 dark:text-gray-300 disabled:opacity-30 transition-all"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {isPlaying ? (
                <button
                  onClick={handlePause}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/30 transition-all active:scale-95"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Guide</span>
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/30 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Walkthrough (ভয়েস সহ)</span>
                </button>
              )}

              <button
                onClick={() => handleSceneChange(currentSceneIndex + 1)}
                disabled={currentSceneIndex === TUTORIAL_SCENES.length - 1}
                className="p-2 sm:p-2.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border text-slate-700 dark:text-gray-300 disabled:opacity-30 transition-all"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSceneChange(0)}
                className="p-2 sm:p-2.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border text-slate-700 dark:text-gray-300 transition-all"
                title="Restart Tutorial"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick CTA to Action */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-border">
              <Link
                href="/tournaments"
                className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-200 font-display font-bold text-xs uppercase tracking-wider transition-all"
              >
                Browse Tournaments
              </Link>
              <a
                href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none text-center px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Group</span>
              </a>
            </div>
          </div>
        </>
      ) : (
        /* Full MP4 Video Player View */
        <div className="p-4 sm:p-8 space-y-4 text-center">
          {externalVideoUrl ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-surface-border shadow-2xl">
              <iframe
                src={externalVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="min-h-[360px] rounded-2xl bg-surface-200/70 border-2 border-dashed border-surface-border flex flex-col items-center justify-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-brand-crimson/15 text-brand-crimson border border-brand-crimson/30 flex items-center justify-center shadow-lg">
                <Video className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-display text-lg font-black text-slate-900 dark:text-white uppercase">
                  MP4 Video Walkthrough
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-400 font-sans">
                  আপনি ElevenLabs 'Bunty' ভয়েস ও স্ক্রিন রেকর্ড দিয়ে ভিডিও রেন্ডার করে{" "}
                  <code className="px-1.5 py-0.5 rounded bg-surface-100 text-brand-crimson font-mono text-[11px]">
                    /public/videos/arenex-tutorial.mp4
                  </code>{" "}
                  ফাইলে রাখলে বা ইউটিউব লিংক দিলে এখানে সরাসরি প্লে হবে।
                </p>
              </div>
              <button
                onClick={() => setActiveTab("simulator")}
                className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-crimson/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>সরাসরি সিমুলেটর দেখুন</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

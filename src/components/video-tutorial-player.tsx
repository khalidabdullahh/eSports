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

const TUTORIAL_SCENES: TutorialScene[] = [
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

export function VideoTutorialPlayer() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentScene = TUTORIAL_SCENES[currentSceneIndex];

  // Voice narration handler
  const playVoiceNarration = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "bn-BD";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try to find a Bengali voice if available
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(
      (v) => v.lang.includes("bn") || v.lang.includes("Bengali") || v.name.includes("Bangla")
    );
    if (bnVoice) {
      utterance.voice = bnVoice;
    }

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    playVoiceNarration(currentScene.banglaVoiceScript);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSceneChange = (index: number) => {
    const nextIndex = Math.max(0, Math.min(TUTORIAL_SCENES.length - 1, index));
    setCurrentSceneIndex(nextIndex);
    setProgress(0);
    if (isPlaying) {
      playVoiceNarration(TUTORIAL_SCENES[nextIndex].banglaVoiceScript);
    }
  };

  // Progress ticker when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
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
  }, [isPlaying, currentSceneIndex, currentScene]);

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else if (isPlaying) {
      playVoiceNarration(currentScene.banglaVoiceScript);
    }
  };

  return (
    <div className="rounded-3xl bg-surface-100 border border-surface-border overflow-hidden shadow-2xl space-y-0 relative">
      {/* Tactical Header Bar */}
      <div className="bg-surface-200 px-5 sm:px-6 py-4 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-crimson/15 border border-brand-crimson/30 flex items-center justify-center text-brand-crimson">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson font-bold">
                OFFICIAL VIDEO TUTORIAL
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                BANGLA VOICEOVER
              </span>
            </div>
            <h3 className="font-display text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
              ARENEX ব্যবহার ও টুর্নামেন্টে অংশগ্রহণের সম্পূর্ণ গাইড
            </h3>
          </div>
        </div>

        {/* Scene Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 font-mono text-xs">
          {TUTORIAL_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                currentSceneIndex === idx
                  ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/30"
                  : "bg-surface-elevated text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{scene.title.slice(0, 10)}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Viewport (16:9 Display Mockup) */}
      <div className="relative aspect-[16/9] bg-black overflow-hidden flex flex-col justify-between p-5 sm:p-8">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2136e_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Top Watermark & Scene Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-brand-crimson animate-pulse" />
            <span className="font-bold">ARENEX SIMULATOR</span>
            <span className="text-gray-500">|</span>
            <span className="text-cyan-400">
              SCENE {currentSceneIndex + 1} OF {TUTORIAL_SCENES.length}
            </span>
          </div>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 border border-white/10 text-gray-300 hover:text-white transition-all"
            title={isMuted ? "Unmute Bangla Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        {/* Center Scene Content Simulation */}
        <div className="relative z-10 max-w-2xl mx-auto w-full text-center space-y-4 my-auto">
          {/* Animated Mockup Graphic by Scene */}
          {currentScene.mockupType === "home" && (
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-surface-border/80 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-xl bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30 flex items-center justify-center mx-auto shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-black text-white uppercase">
                Welcome to ARENEX Esports Arena
              </h4>
              <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-lg mx-auto">
                Discover live Free Fire solo and squad cups. Guaranteed prize pools and automated double-entry verification.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 font-mono text-[11px]">
                <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ✓ 100% Secure bKash Integration
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  ✓ Instant Match Decryption
                </span>
              </div>
            </div>
          )}

          {currentScene.mockupType === "signup" && (
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-surface-border/80 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-surface-border pb-2 text-xs font-mono">
                <span className="text-cyan-400 font-bold">Step 1: Link Free Fire UID</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-200 border border-surface-border text-left font-mono text-xs space-y-1">
                <span className="text-gray-400 block text-[10px] uppercase">In-Game Name (IGN)</span>
                <span className="font-bold text-brand-crimson text-sm block">ALPHA〆KILLER</span>
                <span className="text-gray-400 block text-[10px] uppercase pt-1">Free Fire UID</span>
                <span className="font-bold text-white tracking-widest text-sm block">1098234871</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 block">
                Referees match this verified in-game UID to award match kills & prize rewards.
              </span>
            </div>
          )}

          {currentScene.mockupType === "whatsapp" && (
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-surface-border/80 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn max-w-md mx-auto">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display text-lg font-black text-white uppercase">
                Join ARENEX Official WhatsApp Channel
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                Get tournament room announcements, schedule alerts, and 24/7 organizer support.
              </p>
              <a
                href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Join WhatsApp Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {currentScene.mockupType === "tournament" && (
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-surface-border/80 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-display font-black text-white uppercase text-sm">
                  Dhaka Night Battle — Solo Cup
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-crimson text-white text-[10px] font-mono font-bold">
                  SOLO BR
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-left font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-surface-200 border border-surface-border">
                  <span className="text-[10px] text-gray-400 uppercase block">Entry Fee</span>
                  <span className="font-bold text-white text-sm">৳50.00</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-200 border border-surface-border">
                  <span className="text-[10px] text-gray-400 uppercase block">Prize Pool</span>
                  <span className="font-bold text-amber-400 text-sm">৳2,000.00</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-200 border border-surface-border">
                  <span className="text-[10px] text-gray-400 uppercase block">Slots</span>
                  <span className="font-bold text-cyan-400 text-sm">24 / 48</span>
                </div>
              </div>
              <div className="py-2.5 rounded-xl bg-brand-crimson text-white font-display font-bold text-xs uppercase tracking-wider shadow-md">
                Claim Spot & Lock Ticket →
              </div>
            </div>
          )}

          {currentScene.mockupType === "payment" && (
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-[#e2136e]/50 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn max-w-lg mx-auto">
              <div className="bg-[#e2136e] -mx-6 -mt-6 p-3 rounded-t-2xl flex items-center justify-between text-white font-display font-black text-xs uppercase tracking-wider">
                <span>bKash Secure Checkout</span>
                <span>Slot #12 Locked</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-200 border border-surface-border text-left font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">bKash Number:</span>
                  <span className="font-bold text-[#e2136e] text-sm">{ARENEX_BKASH_RECIPIENT_NUMBER}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TrxID Submitted:</span>
                  <span className="font-bold text-cyan-400 text-sm">BL92A8ZK91</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-bold text-emerald-400 text-[11px] uppercase">Verified (Option B)</span>
                </div>
              </div>
            </div>
          )}

          {currentScene.mockupType === "room" && (
            <div className="p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-500/50 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn max-w-lg mx-auto">
              <div className="flex items-center justify-between text-cyan-300">
                <div className="flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-cyan-400" />
                  <span className="font-display font-black text-xs uppercase tracking-wider">
                    Custom Room Unlocked
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ Verified Access</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left font-mono">
                <div className="p-3 rounded-xl bg-surface-200 border border-surface-border">
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Custom Room ID</span>
                  <span className="font-bold text-white text-lg tracking-wider">ARENEX-8291</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-200 border border-surface-border">
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Lobby Password</span>
                  <span className="font-bold text-cyan-300 text-lg tracking-wider">1234</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 block">
                Open Free Fire → Custom Match → Search Room ID → Enter Password
              </span>
            </div>
          )}

          {currentScene.mockupType === "payout" && (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl space-y-3 animate-fadeIn max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/20 text-brand-gold border border-brand-gold/30 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-black text-white uppercase">
                Prize Credited to Your Wallet!
              </h4>
              <div className="p-3 rounded-xl bg-surface-200 border border-surface-border font-mono text-xs flex items-center justify-between">
                <span className="text-gray-400">1st Place + Top Fragger:</span>
                <span className="font-bold text-brand-gold text-base">৳1,500.00 BDT</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                ✓ Disbursed directly to your registered bKash Number
              </span>
            </div>
          )}
        </div>

        {/* Bottom Subtitles Bar */}
        <div className="relative z-10 bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {currentScene.title}
            </span>
            <span className="text-cyan-400 font-bold">{currentScene.tagline}</span>
          </div>

          <div className="text-xs sm:text-sm font-sans font-medium text-slate-100 dark:text-gray-200 text-left leading-relaxed">
            {currentScene.banglaSubtitles.map((sub, i) => (
              <p key={i} className="flex items-center gap-1.5">
                <span className="text-brand-crimson font-bold">›</span>
                <span>{sub}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Video Progress Bar */}
      <div className="w-full bg-surface-200 h-1.5 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-crimson via-cyan-400 to-emerald-400 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(226,19,110,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Video Controls Bar */}
      <div className="p-4 sm:p-5 bg-surface-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Play / Pause / Navigation */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={() => handleSceneChange(currentSceneIndex - 1)}
            disabled={currentSceneIndex === 0}
            className="p-2.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border text-slate-700 dark:text-gray-300 disabled:opacity-30 transition-all"
            title="Previous Scene"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={handlePause}
              className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/30 transition-all active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Guide</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Video Guide (বাংলা ভয়েস)</span>
            </button>
          )}

          <button
            onClick={() => handleSceneChange(currentSceneIndex + 1)}
            disabled={currentSceneIndex === TUTORIAL_SCENES.length - 1}
            className="p-2.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border text-slate-700 dark:text-gray-300 disabled:opacity-30 transition-all"
            title="Next Scene"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSceneChange(0)}
            className="p-2.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border text-slate-700 dark:text-gray-300 transition-all"
            title="Restart Tutorial"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Quick CTA to Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <Link
            href="/tournaments"
            className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-200 font-display font-bold text-xs uppercase tracking-wider transition-all"
          >
            Browse Tournaments
          </Link>
          <a
            href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Community</span>
          </a>
        </div>
      </div>
    </div>
  );
}

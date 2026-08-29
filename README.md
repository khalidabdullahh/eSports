# ARENEX — Next-Generation Esports Tournament Platform

> **"WHERE PLAYERS COMPETE. LEGENDS RISE."**  
> *Conceptual Origin: **ARENA + NEXT = ARENEX***  
> *The Player Journey: **ENTER → COMPETE → PERFORM → PROVE → RISE***

AreNex is a premium, mobile-first esports tournament platform architected initially for competitive **Free Fire** Battle Royale with an extensible multi-game engine (PUBG Mobile, Valorant Mobile, COD Warzone).

---

## 🛡️ Brand Foundation & Design System

1. **Brand Concept & Origin**
   - **Arena**: Competition, battle, skill, performance, challenge, and the stage where champions emerge.
   - **Next**: The future, next-generation competitive infrastructure, evolution, and the next level of esports.
   - **Interpretation**: AreNex is a digital arena where players compete, prove their skill, build their reputation, and rise toward greatness.

2. **Official Brand Tagline**
   - **"WHERE PLAYERS COMPETE. LEGENDS RISE."**
   - Communicates genuine aspiration: Every legend begins as a player. The arena provides the stage for verified performance.

3. **Color Architecture (80% / 15% / 5% Formula)**
   - **80% Base**: Pitch Black / Deep Charcoal canvas (`#07090E`, `#0A0D15`)
   - **15% Surfaces**: Elevated tactical cards and panels (`#0D111A`, `#141A28`, `#1C2438`)
   - **5% High-Impact Accent**: **Electric Crimson / Apex Ruby** (`#FF1E44`, `#E11D48`)
   - **Functional Accents**: Championship Gold (`#F59E0B`), Victory Emerald (`#10B981`)

4. **Vector Logo System (`ArenexLogo`)**
   - Geometric hexagonal arena boundary enclosing an upward ascending delta blade ("A + N" monogram with rising momentum).
   - Fully vector SVG with support for horizontal lockups, stacked lockups, monochrome streaming overlays, and mobile app icons.

5. **Living Brand Guide**
   - Interactive design guidelines available directly at [`/brand`](http://localhost:3000/brand).
   - Brand manifesto, purpose, mission, vision, and philosophy at [`/about`](http://localhost:3000/about).

---

## ⚡ Core Platform Capabilities

1. **Tournament Engine & Strict State Machine**
   - Formal linear lifecycle transitions: `DRAFT` → `PUBLISHED` → `REGISTRATION_OPEN` → `REGISTRATION_CLOSED` → `CHECK_IN` → `LIVE` → `RESULT_SUBMITTED` → `VERIFICATION` → `DISPUTE_WINDOW` → `FINALIZED` → `PAYOUT_PROCESSING` → `COMPLETED`.
   - Formats: Solo Battle Royale (50 players), Squad Clash (4v4 + substitutes), and Lone Wolf (1v1 duel).

2. **Protected Room Credential Vault**
   - Custom Room ID and Password cryptographically protected on the server.
   - Decrypted strictly for checked-in competitors once the scheduled unlock time arrives.

3. **Official Referee Control Panel & Live Broadcast Telemetry**
   - Touch-optimized referee console for rapid +1 kill logging, eliminations, and placement recording.
   - Public live broadcast screen with stream embed, live killfeed, and real-time leaderboard.

4. **Deterministic Scoring & Reward Engine**
   - Mathematically reproducible scoring: Placement points + (Kills × Multiplier).
   - **Podium Prize Pool**: e.g. ৳1,000 guaranteed (1st: ৳500, 2nd: ৳300, 3rd: ৳200).
   - **Performance Reward Pool**: e.g. ৳500 ring-fenced for top fraggers (৳200, ৳150, ৳100, ৳50).
   - Podium winners excluded from performance pool by default.

5. **Append-Only Financial Ledger**
   - Double-entry accounting system tracking `ENTRY_FEE`, `PRIZE_LIABILITY`, `PERFORMANCE_REWARD`, `REFUND`, and `PAYOUT`.
   - Stored in **integer minor units** (e.g. poisha/cents).

6. **15-Minute Dispute Window & Resolution Desk**
   - Post-match dispute filing with screenshot / video evidence links and administrative determinations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.24 (App Router, Server Actions, Route Handlers, React 19)
- **Language**: TypeScript (Strict Mode, 0 errors)
- **Styling**: Tailwind CSS (AreNex Crimson/Gold/Emerald dark tokens)
- **Database & Storage**: Supabase (PostgreSQL 15, RLS, Realtime Channels)
- **Icons**: Lucide React

---

## 🚀 Quick Start & Development

```bash
# 1. Install dependencies
npm install

# 2. Run core engine verification suite
node scripts/run-tests.mjs

# 3. Build production bundle
npm run build

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to enter the AreNex arena.

---

## 🎮 Demo Tournament: "Night Battle — Solo Cup"

- **Title**: Night Battle — Solo Cup
- **Format**: Solo Battle Royale (Bermuda)
- **Max Participants**: 50 warriors
- **Entry Ticket**: ৳50.00
- **Total Collection**: ৳2,500.00
- **Guaranteed Arena Pool**: ৳1,500.00 (Podium: ৳1,000 + Top Fraggers: ৳500)
- **Gross Platform Margin**: ৳1,000.00

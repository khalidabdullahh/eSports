# NexusOps — Production-Minded Esports Tournament Platform

> **"Premium dark esports analytics platform with real-time tournament operations."**  
> *Core feeling: "Join. Compete. Perform. Earn."*

NexusOps is a high-performance, mobile-first esports tournament platform designed initially for competitive **Free Fire** Battle Royale with an extensible abstraction layer for multi-game support (PUBG Mobile, Valorant Mobile, COD Warzone).

---

## ⚡ Core Platform Capabilities

1. **Tournament Engine & Strict State Machine**
   - Formal linear lifecycle transitions: `DRAFT` → `PUBLISHED` → `REGISTRATION_OPEN` → `REGISTRATION_CLOSED` → `CHECK_IN` → `LIVE` → `RESULT_SUBMITTED` → `VERIFICATION` → `DISPUTE_WINDOW` → `FINALIZED` → `PAYOUT_PROCESSING` → `COMPLETED`.
   - Server-side transition validation rejecting illegal state jumps.
   - Formats: Solo (50-player Battle Royale), Squad (4v4 + substitutes), and Lone Wolf (1v1 duel).

2. **Atomic Slot Allocation & Locked Roster Snapshots**
   - Race-condition-free capacity allocation ensuring slots never exceed tournament capacity.
   - Permanent roster snapshotting upon registration close with immutable audit logs for administrative exceptions.

3. **Protected Room Credential Security Gate**
   - Custom Room ID and Password are cryptographically protected on the server.
   - Decrypted and revealed **only** to authorized players who have completed check-in once the scheduled unlock time arrives.
   - Access attempts logged with IP, user ID, and timestamp in `room_access_logs`.

4. **Official Referee Control Panel & Live Broadcast Telemetry**
   - Fast, touch-optimized mobile/tablet referee console for rapid +1 kill logging, eliminations, and placement recording.
   - Append-only event history with sequence numbers, `correction_of_event_id`, and void/undo mechanisms.
   - Public live broadcast screen with stream embed, live killfeed, and real-time leaderboard updating without client-side trust.

5. **Deterministic Scoring & Reward Engine**
   - Mathematically reproducible scoring: Placement points + (Kills × Multiplier).
   - **Podium Prize Pool**: e.g. ৳1,000 guaranteed (1st: ৳500, 2nd: ৳300, 3rd: ৳200).
   - **Performance Reward Pool**: e.g. ৳500 ring-fenced for top fraggers (৳200, ৳150, ৳100, ৳50).
   - Podium winners are strictly excluded from performance pool bonuses by default.
   - Permanent immutable calculation snapshot stored on finalization.

6. **Append-Only Financial Ledger**
   - Double-entry accounting system tracking `ENTRY_FEE`, `PRIZE_LIABILITY`, `PERFORMANCE_REWARD`, `REFUND`, and `PAYOUT`.
   - All amounts stored as **integer minor units** (e.g. poisha/cents) eliminating floating point inaccuracies.

7. **15-Minute Dispute Window & Resolution Desk**
   - Formal post-match dispute filing with screenshot / video evidence links.
   - Administrative review queue with binding Accept / Reject determinations.

8. **Role-Based Access Control (RBAC)**
   - Roles: `SUPER_ADMIN`, `OWNER`, `TOURNAMENT_ADMIN`, `REFEREE`, `RESULT_MANAGER`, `FINANCE_ADMIN`, `STREAM_MANAGER`, `SUPPORT`, `PLAYER`.
   - Complete PostgreSQL Row Level Security (RLS) policies.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Esports Dark Theme Tokens: 80% Charcoal/Black, 15% Secondary Surfaces, 5% Accents: Vibrant Cyan `#00F0FF`, Crimson `#FF334B`, Gold `#FFB800`, Emerald `#00E676`)
- **Database & Storage**: Supabase (PostgreSQL 15, RLS, Realtime Channels, Storage Buckets)
- **Icons**: Lucide React
- **Validation**: Zod

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Core Engine Unit Tests
```bash
node scripts/run-tests.mjs
```

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Demo Tournament: "Night Battle — Solo Cup"

The platform comes pre-seeded with the featured demo tournament:
- **Title**: Night Battle — Solo Cup
- **Format**: Solo Battle Royale (Bermuda)
- **Max Participants**: 50 warriors
- **Entry Fee**: ৳50.00
- **Total Collection**: ৳2,500.00
- **Main Prize Pool**: ৳1,000.00 (1st: ৳500, 2nd: ৳300, 3rd: ৳200)
- **Top Fraggers Pool**: ৳500.00 (৳200, ৳150, ৳100, ৳50)
- **Gross Platform Margin**: ৳1,000.00

### Interactive Personas (Role Switcher in Header):
- **Apex Director** (`SUPER_ADMIN`): Full executive control and audit logs.
- **Falcon Official** (`REFEREE`): Official match referee console for live scoring.
- **Vault Keeper** (`FINANCE_ADMIN`): Payment verification queue and double-entry ledger.
- **Alpha Striker** (`PLAYER`): Checked-in player with decrypted room key (`99401824`, pass: `APEX#2026(NIGHT)`).

---

## 📁 Project Directory Structure

```
├── scripts/
│   ├── run-tests.mjs          # Automated engine test runner
│   └── test-engine.ts         # TypeScript test suite
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   ├── tournaments/       # Catalog & Details (/tournaments, /tournaments/[id])
│   │   │   ├── [id]/register  # Slot hold & bKash checkout
│   │   │   └── [id]/room      # Protected room decryption gate
│   │   ├── live/              # Real-time live match broadcast & telemetry
│   │   ├── matches/[id]/      # Match view
│   │   ├── rankings/          # Global warrior power rankings
│   │   ├── teams/             # Clans and snapshotted rosters
│   │   ├── dashboard/         # Player lifecycle dashboard
│   │   ├── admin/             # Executive admin portal
│   │   │   ├── referee/       # Touch-optimized referee desk
│   │   │   ├── finance/       # Payment verification & financial ledger
│   │   │   ├── disputes/      # Dispute resolution center
│   │   │   ├── moderation/    # UID bans and reports
│   │   │   └── audit/         # System audit trail
│   │   ├── actions/           # Server actions for mutations
│   │   └── api/match/[id]/    # Real-time state API
│   ├── components/            # Reusable esports design system components
│   ├── lib/
│   │   ├── services/          # State machine, Scoring, Reward engine, Providers
│   │   ├── store.ts           # Authoritative data store
│   │   └── seed-data.ts       # Night Battle Solo Cup seed data
│   └── types/                 # Domain models, enums, rules
└── supabase/migrations/       # PostgreSQL schema & Row Level Security (RLS)
```

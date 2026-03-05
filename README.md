<div align="center">
<h1>CaliGym</h1>
<h3><em>Structured calisthenics progression — from first push-up to front lever</em></h3>
<p>
<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
</a>
<img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js 15">
<img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript">
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748" alt="Prisma">
</p>
</div>

## About

CaliGym is an open-source calisthenics training app that guides athletes through structured skill progressions. Instead of random workouts, you follow a proven ladder — earning each level before moving to the next.

**6 progression families · 78 exercises · structured level-up system**

- Push-Up Family (10 levels: wall push-up → planche push-up)
- Pull-Up Family (10 levels: dead hang → muscle-up)
- Dip Family (10 levels: bench dip → ring dip)
- Squat Family (10 levels: assisted squat → pistol squat)
- L-Sit Family (8 levels: tuck hold → full L-sit)
- Front Lever Family (10 levels: tuck → full front lever)

## Features

- **Exercise Library** — browse, search, and filter 78+ calisthenics exercises with video demos, step-by-step instructions, cues, and common mistakes
- **Progression Dashboard** — track your current level across all 6 families with visual progress indicators
- **Level Timeline** — see every step of a progression family with unlock criteria for each level
- **Workout Tracking** — log sets with reps, hold time, form quality, band assistance, and RPE
- **Leaderboard** — compare progress with the community
- **Multi-language** — English, French, Spanish, Portuguese, Russian, Chinese

## Stack

- **Framework**: Next.js 15 (App Router + Server Actions)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: BetterAuth (email/password + OAuth)
- **Styling**: TailwindCSS + shadcn/ui + DaisyUI
- **Architecture**: Feature-Sliced Design (FSD)

## Quick Start

### Prerequisites

- Node.js v18+
- pnpm v8+
- PostgreSQL

### Installation

1. **Clone and install**

   ```bash
   git clone https://github.com/dciconi/caligym.git
   cd caligym
   pnpm install
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env — set DATABASE_URL and auth secrets
   ```

3. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database**

   ```bash
   pnpm db:seed-equipment
   pnpm db:seed-push-pull
   pnpm db:seed-dip-squat
   pnpm db:seed-lsit-frontlever
   ```

5. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                  # Next.js pages and layouts
├── features/             # Business units (auth, progression-system, exercises, dashboard)
├── entities/             # Domain entities (exercise, program, workout-session)
├── shared/               # Shared utilities, constants, UI primitives
└── widgets/              # Composable UI (Sidebar, Header)

scripts/
├── seed-equipment.ts         # 9 equipment items
├── seed-push-pull-families.ts   # Push-Up + Pull-Up families
├── seed-dip-squat-families.ts   # Dip + Squat families
└── seed-lsit-frontlever-families.ts  # L-Sit + Front Lever families
```

## Seed Scripts

| Script | Command | Content |
|--------|---------|---------|
| Equipment | `pnpm db:seed-equipment` | 9 equipment types (bar, parallels, rings, band, wall…) |
| Push / Pull | `pnpm db:seed-push-pull` | 20 exercises, 2 families, 20 levels |
| Dip / Squat | `pnpm db:seed-dip-squat` | 20 exercises, 2 families, 20 levels |
| L-Sit / Front Lever | `pnpm db:seed-lsit-frontlever` | 18 exercises, 2 families, 18 levels |

All seeds are idempotent — safe to re-run.

## Deployment

```bash
# Build
pnpm build

# Run migrations against production DB
export DATABASE_URL="your-production-db-url"
npx prisma migrate deploy

# Seed production DB
pnpm db:seed-equipment && pnpm db:seed-push-pull && pnpm db:seed-dip-squat && pnpm db:seed-lsit-frontlever

# Start
pnpm start
```

## Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [BetterAuth](https://www.better-auth.com/)

## Credits

Forked from [workout.cool](https://github.com/Snouzy/workout-cool) — an open-source fitness platform by [@Snouzy](https://github.com/Snouzy). The original project provided the Next.js + FSD foundation that CaliGym is built on.

## License

MIT — see [LICENSE](LICENSE) for details.

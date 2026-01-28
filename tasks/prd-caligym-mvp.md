# PRD: CaliGym MVP — Calisthenics Progression Training App

## Introduction

CaliGym is a calisthenics-specific training platform that guides users from complete beginner to advanced skills like muscle-ups, planches, and front levers. It is built by forking [workout-cool](https://github.com/Snouzy/workout-cool) (Next.js 15, Prisma + PostgreSQL, Feature-Sliced Design, shadcn/ui + DaisyUI, Better Auth, i18n) and transforming it from a general gym tracker into a progression-focused calisthenics app.

The core differentiator is the **progression system**: exercises are organized into families (e.g., Push-Up Family, Pull-Up Family) with clear levels, prerequisites, and unlock criteria. The app tells users exactly what to train and when they're ready to advance.

**Platform strategy:** Next.js web app + separate React Native mobile app sharing the same PostgreSQL backend via API routes. workout-cool already has `/api/` routes designed for mobile consumption and Expo EAS references.

**Key fork decisions:**
- **Strip** gym-specific features (weight tracking per set, gym equipment types, BMI/calorie/heart-rate tools, ads)
- **Keep** auth, i18n, leaderboard, profiles, programs infrastructure, statistics, PWA, admin panel, Stripe/RevenueCat billing (freemium model)
- **Replace** the exercise data model (EAV → rigid calisthenics schema with first-class progression families)
- **Replace** the workout builder with template-based calisthenics programs
- **Add** progression tracking, skill assessments, equipment setup, and calisthenics exercise database

**Resolved decisions:**
- **Video content:** YouTube links/embeds (no self-hosting)
- **Monetization:** Freemium (keep Stripe + RevenueCat infrastructure from workout-cool)
- **Mobile:** React Native app sharing the backend, web app via Next.js
- **Community moderation:** Admin-moderated (leverage existing admin panel)
- **Offline:** Future feature, not MVP
- **Multi-language:** Leverage existing i18n setup (en + fr minimum)

---

## Goals

- Provide a curated database of 100-150 calisthenics exercises organized into 6 progression families
- Let users track their current level in each progression family and see what to unlock next
- Offer pre-built program templates (e.g., "Beginner Full Body", "Muscle-Up Prep") that adapt to user equipment and level
- Enable workout logging with calisthenics-appropriate tracking (reps, hold time, form quality, band assistance)
- Show a progress dashboard with current levels, recent workouts, and progression history
- Serve both complete beginners and intermediate trainees

---

## User Stories

### US-001: Fork and strip workout-cool
**Description:** As a developer, I need a clean starting point by forking workout-cool and removing features that don't apply to calisthenics.

**Acceptance Criteria:**
- [ ] Fork workout-cool into the caligym repo
- [ ] Remove: weight-per-set tracking UI, gym equipment types, BMI calculator, calorie calculator, heart-rate zones, ads components, license system
- [ ] Keep: auth (Better Auth), i18n, leaderboard, user profiles, session history, programs infrastructure, statistics foundation, admin panel, PWA, theming, feedback system
- [ ] App builds and runs without errors after removal
- [ ] Typecheck/lint passes

---

### US-002: Design and migrate to calisthenics exercise schema
**Description:** As a developer, I need a new database schema that models calisthenics concepts as first-class entities instead of the existing EAV attribute system.

**Acceptance Criteria:**
- [ ] Remove `ExerciseAttribute`, `ExerciseAttributeName`, `ExerciseAttributeValue` models and the `ExerciseAttributeNameEnum`/`ExerciseAttributeValueEnum` enums
- [ ] Create new Prisma models:
  - `Exercise` — id, name (en/fr), slug, description, instructions (string[]), cues (string[]), commonMistakes (string[]), videoUrl, imageUrls, difficultyLevel (enum: beginner/intermediate/advanced/elite), measurementType (enum: reps/time/reps_each_side/time_each_side), defaultSets, defaultReps, defaultHoldTime, restBetweenSets, category (enum), subcategory (string), primaryMuscles (enum[]), secondaryMuscles (enum[]), bandAssistance (bool), bandResistance (bool)
  - `ProgressionFamily` — id, name, slug, description, category
  - `ProgressionLevel` — id, familyId, exerciseId, level (int), unlockCriteria (JSON: minReps, minSets, minHoldTime, minFormQuality, consistencyWeeks)
  - `Equipment` — id, name, type (enum: bar/parallels/rings/band/wall/floor/box/bench), heightVariant (enum), portable (bool)
  - `ExerciseEquipment` — many-to-many join between Exercise and Equipment
- [ ] Create enums: `ExerciseCategory` (push_horizontal, push_vertical, pull_horizontal, pull_vertical, core_anterior, core_posterior, core_stability, legs, skills, mobility), `DifficultyLevel`, `MeasurementType`, `MuscleGroup`, `EquipmentType`, `EquipmentHeight`
- [ ] Migration runs successfully on a fresh database
- [ ] Typecheck passes

---

### US-003: Seed the exercise database
**Description:** As a user, I want a comprehensive library of calisthenics exercises so I can browse and learn movements.

**Acceptance Criteria:**
- [ ] Seed script populates 100-150 calisthenics exercises with: name, description, instructions, cues, common mistakes, category, muscles, difficulty, measurement type, defaults
- [ ] 8 equipment items seeded (pull-up bar, parallel bars low/medium/high, rings, resistance bands, wall, floor, box/bench)
- [ ] Exercise-equipment relationships populated
- [ ] Each exercise has a YouTube video URL (placeholder acceptable for MVP, real links preferred)
- [ ] Seed is idempotent (can re-run without duplicates)
- [ ] Typecheck passes

---

### US-004: Seed progression families and levels
**Description:** As a user, I want exercises organized into progression families so I can see the path from beginner to advanced.

**Acceptance Criteria:**
- [ ] 6 progression families seeded: Push-Up Family, Pull-Up Family, Dip Family, Squat Family, L-Sit Family, Front Lever Family
- [ ] Each family has 8-10 levels with corresponding exercises linked
- [ ] Each level has unlock criteria defined (e.g., "3x8 clean reps" or "3x20s hold with good form")
- [ ] Progression levels are ordered and queryable (get all levels for a family, get next level)
- [ ] Typecheck passes

---

### US-005: User equipment selection
**Description:** As a user, I want to select what equipment I have access to so the app only shows me relevant exercises and programs.

**Acceptance Criteria:**
- [ ] New `UserEquipment` join table linking users to equipment
- [ ] Equipment selection screen during onboarding (multi-select with icons for each equipment type)
- [ ] Equipment selection editable from profile/settings
- [ ] Equipment choice persists in database
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-006: User progression tracking
**Description:** As a user, I want to see my current level in each progression family and track my advancement.

**Acceptance Criteria:**
- [ ] New `UserProgression` model: userId, progressionFamilyId, currentLevel, unlockedAt, lastAssessedAt
- [ ] Initialized to level 1 for all families on account creation
- [ ] API to get all progression statuses for a user
- [ ] API to advance a user's level (with validation that unlock criteria are met)
- [ ] Typecheck passes

---

### US-007: Progression dashboard page
**Description:** As a user, I want a dashboard showing my current level in each progression family, what I've unlocked, and what's next.

**Acceptance Criteria:**
- [ ] Dashboard page at `/progression` (or similar)
- [ ] Shows each of the 6 progression families as cards
- [ ] Each card displays: family name, current level number and exercise name, next level exercise name, unlock criteria for next level
- [ ] Visual indicator of progress (e.g., progress bar showing level X/10)
- [ ] Clicking a family card navigates to a detail view showing all levels
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-008: Progression family detail view
**Description:** As a user, I want to see the full progression tree for a family so I understand the complete path.

**Acceptance Criteria:**
- [ ] Detail page at `/progression/[familySlug]`
- [ ] Shows all levels in order with exercise name, difficulty, and unlock criteria
- [ ] Levels at or below current level marked as "unlocked" (visually distinct)
- [ ] Current level highlighted
- [ ] Levels above current level shown as "locked" with criteria to unlock
- [ ] Each exercise links to its detail page
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-009: Exercise detail page
**Description:** As a user, I want to view full details of any exercise including instructions, cues, and video.

**Acceptance Criteria:**
- [ ] Exercise detail page at `/exercises/[slug]`
- [ ] Displays: name, video embed, description, step-by-step instructions, form cues, common mistakes, category, muscles worked, difficulty, equipment needed
- [ ] Shows which progression family/level this exercise belongs to (if any)
- [ ] Shows "previous" and "next" exercise in the progression
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-010: Exercise browse/search page
**Description:** As a user, I want to browse and search the exercise library filtered by category, muscle, equipment, or difficulty.

**Acceptance Criteria:**
- [ ] Exercise list page at `/exercises`
- [ ] Filter by: category, primary muscle, equipment, difficulty level
- [ ] Search by name
- [ ] Filters persist in URL params
- [ ] Cards show: exercise name, category badge, difficulty badge, primary muscles
- [ ] Clicking a card navigates to exercise detail
- [ ] Respects user's equipment selection (option to show only exercises matching user's equipment)
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-011: Program templates
**Description:** As a user, I want to choose from pre-built calisthenics programs that match my goals and equipment.

**Acceptance Criteria:**
- [ ] Reuse existing `Program`/`ProgramWeek`/`ProgramSession`/`ProgramSessionExercise` models (adapt as needed for calisthenics)
- [ ] Seed 4-5 program templates: Beginner Full Body (3x/week), Muscle-Up Prep (3x/week), Front Lever Program (3x/week), Minimal Equipment (floor+wall), Park Workout
- [ ] Each program specifies required equipment
- [ ] Program listing page shows only programs compatible with user's equipment
- [ ] Each program has a description, target level, schedule, and equipment requirements
- [ ] Typecheck passes

---

### US-012: Workout session logging for calisthenics
**Description:** As a user, I want to log my workout sets with calisthenics-appropriate data (reps or hold time, form quality, band used).

**Acceptance Criteria:**
- [ ] Modify `WorkoutSet` model: remove weight/unit fields, add `holdTimeSeconds` (int, nullable), `formQuality` (enum: poor/acceptable/good/excellent, nullable), `bandUsed` (enum: none/light/medium/heavy/extra_heavy, nullable), `rpe` (int 1-10, nullable)
- [ ] Set logging UI shows appropriate inputs based on exercise measurement type (reps input for rep exercises, timer/seconds input for hold exercises)
- [ ] Optional form quality selector per set
- [ ] Optional band selector per set
- [ ] Optional RPE selector per set
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-013: Workout session flow
**Description:** As a user, I want to start a workout from a program session, log each exercise, and complete the session.

**Acceptance Criteria:**
- [ ] User can start a workout from a program session
- [ ] Workout screen shows exercises in order with target sets/reps/hold times from the program
- [ ] User logs actual performance per set
- [ ] Rest timer between sets (with configurable duration)
- [ ] Session can be completed and rated (reuse existing rating system)
- [ ] Completed session saved to history
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-014: Simple progress dashboard
**Description:** As a user, I want a home dashboard showing my recent activity, progression status, and key stats.

**Acceptance Criteria:**
- [ ] Dashboard at `/` (authenticated home) or `/dashboard`
- [ ] Shows: workouts this week count, current streak, total workouts
- [ ] Shows progression family summary (family name + current level for each, compact)
- [ ] Shows last 3-5 workouts with date, program name, duration
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-015: Assessment/level-up flow
**Description:** As a user, I want to test if I'm ready for the next progression level and advance when I meet the criteria.

**Acceptance Criteria:**
- [ ] New `Assessment` model: userId, progressionFamilyId, exerciseTested, date, repsCompleted, holdTimeSeconds, formQuality, rpe, passed (bool)
- [ ] "Test My Level" button on progression family detail page
- [ ] Assessment flow: shows the unlock criteria, user logs their attempt, system evaluates pass/fail
- [ ] On pass: user's progression level advances, celebration feedback shown
- [ ] On fail: encouraging message with tips, suggest staying at current level
- [ ] Assessment history viewable per family
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-016: Onboarding flow adaptation
**Description:** As a new user, I want an onboarding flow that sets up my equipment, experience level, and goals.

**Acceptance Criteria:**
- [ ] Adapt existing onboarding to include: experience level selection (beginner/some experience/intermediate/advanced), equipment selection (from US-005), training goal selection (pick 1-3 goals: e.g., first pull-up, muscle-up, front lever, general fitness, pistol squat, handstand)
- [ ] Add `experienceLevel` and goals to user model
- [ ] Experience level sets initial progression levels (beginners start at level 1, intermediates may start higher)
- [ ] Onboarding recommends a starting program based on answers
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

- FR-1: The system must store exercises with a rigid calisthenics-specific schema (not EAV) including category, muscles, progression info, measurement type, instructions, and cues
- FR-2: The system must organize exercises into progression families with ordered levels and unlock criteria
- FR-3: The system must track each user's current level per progression family and support level advancement
- FR-4: The system must allow users to select their available equipment and filter exercises/programs accordingly
- FR-5: The system must provide pre-built program templates with weekly schedules of calisthenics exercises
- FR-6: The system must allow users to log workout sets with reps or hold time, form quality, band assistance, and RPE
- FR-7: The system must evaluate assessment attempts against unlock criteria to determine progression
- FR-8: The system must display a progress dashboard with workout stats and progression summaries
- FR-9: The system must seed 100-150 exercises and 6 fully-mapped progression families
- FR-10: The system must support i18n for exercise names and descriptions (at minimum en + fr, leveraging existing i18n infrastructure)
- FR-11: The system must retain the existing leaderboard, profile, and session history features from workout-cool

---

## Non-Goals (Out of Scope for MVP)

- Custom workout builder (users build their own sessions from scratch)
- Social features beyond what workout-cool already has (no form check uploads, no community challenges)
- AI-powered workout suggestions
- React Native mobile app (Phase 2 — MVP is web only, but API routes are designed to support it)
- Offline mode
- Progress photos
- Educational content library / guides / glossary
- Visual skill tree (fancy interactive tree visualization — simple list view is sufficient for MVP)
- More than 6 progression families (remaining families are Phase 2)
- Weighted exercise tracking (e.g., weighted pull-ups with kg/lbs — calisthenics focus only)
- Video hosting (YouTube embeds only)

---

## Technical Considerations

### What to strip from workout-cool
- `WorkoutSet` weight/unit fields and related UI
- EAV exercise attribute system (`ExerciseAttribute`, `ExerciseAttributeName`, `ExerciseAttributeValue`, related enums)
- BMI, calorie, heart-rate calculator pages and logic
- License system
- Ads components
- The 3-step workout builder feature (equipment → muscles → generate) — replaced by program templates

### What to keep
- Better Auth (email/password + OAuth)
- i18n (next-international, locale routing)
- Program models and infrastructure (adapt for calisthenics)
- Workout session and rating system (adapt set model)
- User profiles, leaderboard, session history
- Statistics foundation (adapt for calisthenics metrics)
- Admin panel (adapt for exercise/program management)
- PWA, theming, feedback
- Stripe + RevenueCat billing infrastructure (for freemium model)
- API routes (designed for mobile consumption — will serve future React Native app)

### Mobile strategy
- MVP is web-first (Next.js + PWA)
- API routes are kept and extended to be mobile-ready
- React Native app planned for post-MVP, sharing the same backend
- workout-cool already has Expo EAS config and mobile API patterns to build on

### New Prisma models
- `ProgressionFamily`
- `ProgressionLevel` (links family → exercise with level number and unlock criteria)
- `UserProgression` (user's current level per family)
- `Assessment` (level-up test results)
- `UserEquipment` (user → equipment join)
- Modified `Exercise` (rigid schema replacing EAV)
- Modified `WorkoutSet` (calisthenics fields replacing weight fields)

### Key dependencies (already in workout-cool)
- Prisma 6.5, PostgreSQL
- Next.js 15 App Router with Server Actions
- Zustand + TanStack Query
- React Hook Form + Zod
- Recharts (for progress charts)
- DaisyUI + shadcn/ui

---

## Success Metrics

- User can go from sign-up to first logged workout in under 5 minutes
- All 6 progression families browsable with clear level indicators
- Users can track and advance through at least 2 progression levels in first month of use
- Exercise library covers all major calisthenics movements (100+ exercises)
- Programs generate workouts using only the user's available equipment

---

## Open Questions

1. Should initial progression levels be self-reported during onboarding (user says "I can do 5 pull-ups") or should everyone start at level 1 and test up?
2. How should the leaderboard adapt — rank by total progression levels unlocked? Total workouts? Keep as-is?
3. Should program templates be fully static (seeded) or should admins be able to create new ones via the admin panel? (workout-cool already has admin program CRUD)
4. For i18n of exercise content: seed both en + fr from the start, or en-only for MVP and add translations later?
5. Should the app track "personal records" per exercise (max reps, max hold time) as a separate concept, or derive from workout history?
6. What features should be gated behind premium in the freemium model? (e.g., advanced programs, unlimited history, detailed analytics)

# Calisthenics App Plan

## Vision

A comprehensive calisthenics training platform that guides users from complete beginner to advanced skills like muscle-ups, planches, and front levers. Unlike generic fitness apps, this is built specifically around the unique nature of calisthenics: skill progressions, hold times, equipment variations, and the journey from assisted movements to full bodyweight mastery.

---

## Core Philosophy

Calisthenics is fundamentally different from gym training:
- **Progressions over weight increases** — You don't add plates, you unlock harder variations
- **Skills require prerequisites** — You can't train planche without solid pseudo planche push-ups
- **Equipment is minimal but specific** — Pull-up bar, parallel bars (various heights), rings, bands
- **Holds and isometrics matter** — Many goals are static (L-sit, front lever, handstand)
- **Movement quality > reps** — Form is everything; bad form = no progress + injury

---

## 1. Exercise Database Architecture

### 1.1 Exercise Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Push (Horizontal)** | Chest, front delts, triceps | Push-ups, dips, pseudo planche push-ups |
| **Push (Vertical)** | Shoulders, triceps | Pike push-ups, handstand push-ups, wall HSPU |
| **Pull (Horizontal)** | Upper back, rear delts, biceps | Rows (various angles), front lever rows |
| **Pull (Vertical)** | Lats, biceps | Pull-ups, chin-ups, muscle-ups |
| **Core (Anterior)** | Abs, hip flexors | Hollow body, L-sit, dragon flags |
| **Core (Posterior)** | Lower back, glutes | Back extensions, reverse hyperextensions |
| **Core (Anti-rotation/Stability)** | Obliques, deep core | Pallof variations, side planks |
| **Legs** | Quads, hamstrings, glutes | Squats, pistols, Nordic curls, shrimp squats |
| **Skills/Statics** | Isometric holds requiring high strength | Planche, front lever, back lever, human flag |
| **Mobility/Flexibility** | Active and passive flexibility | Shoulder dislocates, pike stretches, bridges |

### 1.2 Exercise Attributes

Each exercise needs these properties:

```
Exercise {
  id: string
  name: string
  category: Category
  subcategory: Subcategory
  
  // Progression system
  progressionFamily: string        // e.g., "push-up-family", "front-lever-family"
  progressionLevel: number         // 1-10 scale within family
  prerequisites: Exercise[]        // Must be able to do X before attempting this
  
  // Equipment
  equipment: Equipment[]           // bar, rings, parallels, band, wall, floor
  equipmentHeight: "low" | "medium" | "high" | "any" | null
  bandAssistance: boolean          // Can be made easier with band?
  bandResistance: boolean          // Can be made harder with band?
  
  // Measurement
  measurementType: "reps" | "time" | "reps_each_side" | "time_each_side"
  defaultSets: number
  defaultReps: number | null       // For rep-based
  defaultHoldTime: number | null   // For time-based (seconds)
  restBetweenSets: number          // seconds
  
  // Targets
  primaryMuscles: Muscle[]
  secondaryMuscles: Muscle[]
  
  // Guidance
  description: string
  instructions: string[]
  cues: string[]                   // Form cues: "squeeze glutes", "depress shoulders"
  commonMistakes: string[]
  videoUrl: string | null
  imageUrls: string[]
  
  // Difficulty
  difficultyLevel: "beginner" | "intermediate" | "advanced" | "elite"
  strengthRequirement: number      // 1-10
  skillRequirement: number         // 1-10
  mobilityRequirement: number      // 1-10
}
```

### 1.3 Progression Families

This is the heart of the app. Each skill has a progression tree:

#### Example: Push-Up Family
```
Level 1:  Wall Push-Ups
Level 2:  Incline Push-Ups (high)
Level 3:  Incline Push-Ups (low)
Level 4:  Knee Push-Ups
Level 5:  Full Push-Ups
Level 6:  Diamond Push-Ups
Level 7:  Archer Push-Ups
Level 8:  Pseudo Planche Push-Ups
Level 9:  One-Arm Push-Up (assisted)
Level 10: One-Arm Push-Up
```

#### Example: Front Lever Family
```
Level 1:  Dead Hang
Level 2:  Active Hang (scapular pulls)
Level 3:  Tuck Front Lever (hold)
Level 4:  Tuck Front Lever Pulls
Level 5:  Advanced Tuck Front Lever
Level 6:  Single Leg Front Lever
Level 7:  Straddle Front Lever
Level 8:  Full Front Lever (hold)
Level 9:  Front Lever Raises
Level 10: Front Lever Pull-Ups
```

#### Full List of Progression Families

**Upper Body Push:**
- Push-Up Family → One-Arm Push-Up
- Dip Family → Weighted Dips / Ring Dips
- Pike Push-Up Family → Handstand Push-Up
- Planche Family → Full Planche

**Upper Body Pull:**
- Pull-Up Family → One-Arm Pull-Up
- Row Family → Front Lever Rows
- Front Lever Family → Full Front Lever
- Back Lever Family → Full Back Lever
- Muscle-Up Family → Strict Muscle-Up / Ring Muscle-Up

**Core:**
- Hollow Body Family → Full Hollow Hold
- L-Sit Family → V-Sit / Manna
- Dragon Flag Family → Full Dragon Flag
- Hanging Leg Raise Family → Toes-to-Bar / Windshield Wipers
- Plank Family → Extended Plank / RKC Plank
- Side Plank Family → Star Side Plank

**Legs:**
- Squat Family → Pistol Squat
- Lunge Family → Shrimp Squat
- Nordic Curl Family → Full Nordic Curl
- Glute Bridge Family → Single Leg Bridge / Nordic Hip Hinge

**Skills:**
- Handstand Family → Freestanding Handstand → Press to Handstand
- Human Flag Family → Full Human Flag

### 1.4 Equipment Definitions

```
Equipment {
  id: string
  name: string
  type: "bar" | "parallels" | "rings" | "band" | "wall" | "floor" | "box" | "bench"
  heightVariant: "low" | "medium" | "high" | null
  portable: boolean
  commonLocations: string[]  // "park", "gym", "home"
}
```

**Core Equipment List:**
- Pull-up bar (high)
- Parallel bars / P-bars (low ~30cm, medium ~80cm, high ~120cm)
- Gymnastic rings
- Resistance bands (light, medium, heavy, extra-heavy)
- Dip station
- Wall
- Floor
- Box/bench (for incline/decline)

---

## 2. User System

### 2.1 User Profile

```
User {
  // Basic info
  id: string
  email: string
  name: string
  
  // Physical stats (for personalization)
  height: number
  weight: number
  age: number
  gender: string
  
  // Experience
  experienceLevel: "complete_beginner" | "some_experience" | "intermediate" | "advanced"
  trainingGoals: Goal[]
  
  // Available equipment (critical for workout generation)
  availableEquipment: Equipment[]
  
  // Injuries/limitations
  limitations: Limitation[]
  
  // Preferences
  workoutDuration: number         // preferred minutes
  workoutsPerWeek: number
  preferredWorkoutDays: Day[]
}
```

### 2.2 Goal Types

```
Goal {
  type: "skill" | "strength" | "endurance" | "body_composition" | "general_fitness"
  target: string                  // e.g., "muscle_up", "10_pull_ups", "hold_l_sit_30s"
  deadline: Date | null
  priority: number
}
```

**Example Goals:**
- Unlock muscle-up
- Hold 60-second L-sit
- Do 20 consecutive pull-ups
- Achieve full front lever
- Complete pistol squat each leg
- Freestanding handstand for 30 seconds

---

## 3. Progression & Assessment System

### 3.1 Skill Assessments

Users periodically test their current level in each progression family:

```
Assessment {
  id: string
  userId: string
  exerciseFamily: string
  date: Date
  
  // What they tested
  exerciseTested: Exercise
  
  // Results
  repsCompleted: number | null
  holdTimeSeconds: number | null
  formQuality: "poor" | "acceptable" | "good" | "excellent"
  rpe: number                     // Rate of Perceived Exertion 1-10
  
  // System's determination
  currentLevel: number
  readyForNextLevel: boolean
  notes: string
}
```

### 3.2 Progression Rules

The app needs logic to determine when someone is ready to progress:

```
ProgressionRule {
  fromExercise: Exercise
  toExercise: Exercise
  
  // Criteria to unlock next level
  criteria: {
    minReps: number | null        // e.g., "3x8 clean reps"
    minSets: number | null
    minHoldTime: number | null    // e.g., "30 seconds"
    minFormQuality: FormQuality
    consistencyWeeks: number      // how many weeks they've hit this
  }
}
```

**Example Progression Rules:**

| From | To | Criteria |
|------|----|----------|
| Tuck Front Lever | Advanced Tuck FL | Hold 3x20s with good form |
| Diamond Push-Ups | Archer Push-Ups | 3x12 with excellent form |
| Assisted Pistol | Full Pistol | 3x5 each leg with minimal assistance |

### 3.3 Regression Handling

If user struggles or gets injured:
- Suggest dropping back one progression level
- Offer band-assisted variations
- Reduce volume, maintain intensity
- Flag potential overtraining

---

## 4. Workout System

### 4.1 Workout Structure

Calisthenics workouts typically follow these patterns:

**Pattern A: Full Body (3x/week)**
- Warm-up (10 min)
- Skill work (10-15 min) — handstands, L-sits, movement practice
- Strength: Push + Pull superset
- Strength: Legs
- Core work
- Cool-down / mobility

**Pattern B: Upper/Lower Split (4x/week)**
- Upper A: Horizontal push/pull focus
- Lower A: Quad-dominant + core
- Upper B: Vertical push/pull focus
- Lower B: Hip-dominant + core

**Pattern C: Push/Pull/Legs (5-6x/week)**
- Push day
- Pull day
- Legs + core day
- Repeat

**Pattern D: Skill-Focused**
- Daily skill practice (handstands, planches)
- 3x/week strength work

### 4.2 Workout Generation Logic

```
WorkoutGenerator {
  inputs: {
    user: User
    targetDuration: number
    workoutType: "full_body" | "upper" | "lower" | "push" | "pull" | "skill"
    equipment: Equipment[]
    focusAreas: Category[]
    excludeExercises: Exercise[]
  }
  
  outputs: {
    warmup: Exercise[]
    skillWork: Exercise[]         // Optional, for skill-focused users
    mainWork: WorkoutBlock[]
    finisher: Exercise[] | null
    cooldown: Exercise[]
  }
}

WorkoutBlock {
  type: "straight_sets" | "superset" | "circuit" | "emom" | "amrap"
  exercises: ExerciseInstance[]
  restBetweenSets: number
  restAfterBlock: number
}

ExerciseInstance {
  exercise: Exercise
  sets: number
  targetReps: number | null
  targetTime: number | null
  actualReps: number[] | null     // Logged per set
  actualTime: number[] | null
  notes: string
}
```

### 4.3 Workout Templates

Pre-built templates for common goals:

- **Beginner Full Body** (3x/week, 45 min)
- **Muscle-Up Prep** (3x/week, focus on pull + dip strength)
- **Planche Journey** (4x/week, push-heavy with specific prep)
- **Front Lever Program** (3x/week, pull-heavy)
- **Handstand Practice** (daily 15 min skill + 3x strength)
- **Street Workout Style** (high volume, lots of pull-ups/dips)
- **Ring Specialist** (rings-only workouts)
- **Minimal Equipment** (floor + wall only)
- **Park Workout** (typical outdoor setup)

---

## 5. Tracking & Analytics

### 5.1 Workout Logging

```
WorkoutLog {
  id: string
  oderId: string
  date: Date
  plannedWorkout: Workout
  
  // What actually happened
  exercisesCompleted: ExerciseLog[]
  totalDuration: number
  overallRpe: number
  energyLevel: number             // 1-5
  notes: string
  
  // Auto-calculated
  totalVolume: number             // sets × reps
  musclesWorked: Muscle[]
}

ExerciseLog {
  exercise: Exercise
  sets: SetLog[]
  skipped: boolean
  skipReason: string | null
}

SetLog {
  setNumber: number
  reps: number | null
  holdTime: number | null
  bandUsed: Band | null
  formQuality: FormQuality
  rpe: number
}
```

### 5.2 Progress Metrics

**Strength Progress:**
- Max reps at each progression level
- Estimated 1RM equivalents (for moves like weighted pull-ups)
- Volume over time (weekly/monthly)

**Skill Progress:**
- Hold times for isometrics
- Current level in each progression family
- Skills unlocked (badges/achievements)

**Consistency:**
- Workouts per week
- Streak tracking
- Completion rate

### 5.3 Visualizations

- **Progression Tree View** — Visual skill tree showing unlocked/locked exercises
- **Muscle Heatmap** — What's been trained this week
- **Volume Charts** — Weekly volume per muscle group
- **PR Tracker** — Personal records with dates
- **Calendar View** — Workout history

---

## 6. Content & Education

### 6.1 Exercise Library

Each exercise needs:
- HD video demo (front + side angles)
- Step-by-step written instructions
- Form cues (what to focus on)
- Common mistakes + how to fix
- Scaling options (easier/harder)
- FAQ

### 6.2 Educational Content

**Guides:**
- "Your First Pull-Up" complete guide
- "Muscle-Up Progression" breakdown
- "Why You're Not Progressing" troubleshooting
- "Training Around Injuries"
- "Building Your Home Setup"

**Concepts:**
- Progressive overload in calisthenics
- Deload weeks
- Greasing the groove
- Periodization for skills
- Nutrition basics for calisthenics

### 6.3 Movement Library / Glossary

- Scapular movements explained
- Hollow body position
- Posterior pelvic tilt
- False grip
- etc.

---

## 7. Equipment Setup Wizard

### 7.1 Initial Setup Flow

1. **What equipment do you have access to?**
   - Pull-up bar
   - Dip station / parallel bars
   - Rings
   - Resistance bands (which strengths?)
   - Wall space
   - Outdoor park equipment
   
2. **Where do you primarily train?**
   - Home
   - Gym
   - Outdoor park
   - Mix

3. **Equipment photo recognition** (nice-to-have)
   - User uploads photo of their setup
   - App identifies available equipment

### 7.2 Equipment-Aware Workout Generation

If user only has pull-up bar + floor:
- No ring exercises
- No dip variations (unless bar allows Korean dips)
- Focus on pull-up bar exercises + floor work

---

## 8. Social & Community Features

### 8.1 Core Social

- **Progress sharing** — Share PRs, unlocked skills
- **Workout sharing** — Post completed workouts
- **Form check requests** — Upload video for community feedback

### 8.2 Challenges

- **Monthly challenges** — "100 pull-ups a day for 30 days"
- **Skill challenges** — "Unlock muscle-up this month"
- **Community goals** — Collective rep counters

### 8.3 Leaderboards (Optional)

- Most pull-ups in a day/week/month
- Longest L-sit hold
- Most skills unlocked
- Streak leaderboard

---

## 9. Technical Architecture (Building on workout.cool)

### 9.1 What to Keep from workout.cool

- Next.js 14 + App Router
- Prisma + PostgreSQL
- Feature-Sliced Design architecture
- shadcn/ui components
- Authentication system
- Basic workout/exercise structure

### 9.2 What to Add/Modify

**New Database Tables:**
- `progression_families`
- `progression_levels`
- `prerequisites`
- `assessments`
- `user_equipment`
- `user_goals`
- `skill_unlocks`
- `workout_templates`

**New Features:**
- `features/progression-system/`
- `features/assessment/`
- `features/skill-tree/`
- `features/equipment-setup/`
- `features/workout-generator/` (heavily modified)

**New Entities:**
- `entities/progression/`
- `entities/assessment/`
- `entities/equipment/`

### 9.3 External Integrations

- **Video hosting** — YouTube embeds (free) or Mux/Cloudflare Stream (paid)
- **Image hosting** — Cloudflare Images or S3
- **Analytics** — Posthog or Plausible
- **Push notifications** — OneSignal or Firebase

---

## 10. MVP Scope vs Full Vision

### 10.1 MVP (Phase 1) — 4-6 weeks

**Must Have:**
- [ ] Curated exercise database (100-150 calisthenics exercises)
- [ ] 5-6 progression families fully mapped (push-up, pull-up, dip, squat, L-sit, front lever)
- [ ] Basic progression tracking (current level per family)
- [ ] Equipment selection
- [ ] Workout generator (basic, respects equipment)
- [ ] Workout logging
- [ ] Simple progress dashboard

**Exercise Content:**
- Written instructions for all exercises
- YouTube video links (no hosting yet)

### 10.2 Phase 2 — +4 weeks

- [ ] Full progression families (all listed above)
- [ ] Assessment system
- [ ] Skill tree visualization
- [ ] Pre-built workout templates (8-10 programs)
- [ ] Band assistance/resistance tracking
- [ ] PR tracking with history

### 10.3 Phase 3 — +4 weeks

- [ ] Custom workout builder
- [ ] Rest timer with audio cues
- [ ] Educational content library
- [ ] Progress photos
- [ ] Export/share workouts
- [ ] Basic social features (share PRs)

### 10.4 Phase 4 — Future

- [ ] Community form checks
- [ ] AI-powered workout suggestions
- [ ] Wearable integration
- [ ] Offline mode
- [ ] Native mobile apps

---

## 11. Naming & Branding Ideas

**Name Options:**
- Calisthenic.app
- BodyweightPro
- BarsAndRings
- Progresso (progression-focused)
- Unlock (unlocking skills)
- Gravity Training
- Street Strength

**Tone:**
- Not bro-y or intimidating
- Inclusive (all skill levels)
- Focused on the journey, not just end goals
- Community-oriented

---

## 12. Open Questions

1. **Video content** — Create original? License? Use YouTube links?
2. **Monetization** — Freemium? One-time? Subscription?
3. **Mobile** — Web-first responsive? Or React Native from start?
4. **Community moderation** — If social features, who moderates?
5. **Offline capability** — Important for park workouts without signal
6. **Multi-language** — workout.cool already has i18n setup

---

## 13. Next Steps

1. **Validate this plan** — Review, add missing pieces
2. **Create detailed PRD** — Specs for MVP scope
3. **Map exercise database** — Full list of exercises with progressions
4. **Design skill trees** — Visual progression maps
5. **Wireframes** — Key screens
6. **Technical spec** — Database schema, API design
7. **Start building** — Fork workout.cool, begin modifications

---

## Appendix A: Sample Progression Trees

### Pull-Up Family (Complete)

```
                    ┌─────────────────────────────────────┐
                    │         ONE-ARM PULL-UP             │
                    │            (Level 10)               │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     ARCHER PULL-UPS                 │
                    │            (Level 9)                │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     WEIGHTED PULL-UPS               │
                    │         (Level 8)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     L-SIT PULL-UPS                  │
                    │         (Level 7)                   │
                    └──────────────┬──────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────┴─────────┐   ┌─────────┴─────────┐   ┌─────────┴─────────┐
│   WIDE PULL-UPS   │   │  CLOSE PULL-UPS   │   │    CHIN-UPS       │
│     (Level 6)     │   │     (Level 6)     │   │    (Level 6)      │
└─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
          └────────────────────────┼────────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │        FULL PULL-UPS                │
                    │           (Level 5)                 │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     BAND-ASSISTED PULL-UPS          │
                    │           (Level 4)                 │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     NEGATIVE PULL-UPS               │
                    │           (Level 3)                 │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     SCAPULAR PULLS                  │
                    │           (Level 2)                 │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │        DEAD HANG                    │
                    │           (Level 1)                 │
                    └─────────────────────────────────────┘
```

### Planche Family (Complete)

```
                    ┌─────────────────────────────────────┐
                    │         FULL PLANCHE                │
                    │            (Level 10)               │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     STRADDLE PLANCHE                │
                    │            (Level 9)                │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     SINGLE-LEG PLANCHE              │
                    │         (Level 8)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     ADVANCED TUCK PLANCHE           │
                    │         (Level 7)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     TUCK PLANCHE                    │
                    │         (Level 6)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     PLANCHE LEANS                   │
                    │         (Level 5)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │   PSEUDO PLANCHE PUSH-UPS           │
                    │         (Level 4)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     FROG STAND                      │
                    │         (Level 3)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │     CROW POSE                       │
                    │         (Level 2)                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │   WRIST PREP + PLANK HOLDS          │
                    │         (Level 1)                   │
                    └─────────────────────────────────────┘
```

---

## Appendix B: Muscle Mapping

```
Upper Body - Push:
├── Chest (Pectoralis Major/Minor)
├── Anterior Deltoid
├── Triceps
└── Serratus Anterior

Upper Body - Pull:
├── Latissimus Dorsi
├── Rhomboids
├── Rear Deltoid
├── Biceps
├── Brachialis
└── Forearms (grip)

Core:
├── Rectus Abdominis
├── Obliques (Internal/External)
├── Transverse Abdominis
├── Hip Flexors
├── Erector Spinae
└── Quadratus Lumborum

Lower Body:
├── Quadriceps
├── Hamstrings
├── Glutes (Max/Med/Min)
├── Calves
└── Hip Adductors/Abductors
```

---

## Appendix C: Band Resistance Levels

| Color (Common) | Resistance | Use Case |
|----------------|------------|----------|
| Yellow/Tan | 5-15 lbs | Light assistance, warm-up, mobility |
| Red | 15-35 lbs | Moderate assistance |
| Black | 25-65 lbs | Standard pull-up assistance |
| Purple | 40-80 lbs | Heavy assistance for beginners |
| Green | 50-120 lbs | Very heavy assistance |
| Blue | 65-175 lbs | Maximum assistance |

*Note: Colors vary by manufacturer*

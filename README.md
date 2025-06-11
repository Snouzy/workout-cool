<div align="center">
<img src="public/logo.png" alt="Workout.cool Logo" width="120" height="120">
<h1>Workout.cool</h1>
<h3><em>Modern fitness coaching platform with comprehensive exercise database</em></h3>
<p>
<img src="https://img.shields.io/github/contributors/Snouzy/workout-cool?style=plastic" alt="Contributors">
<img src="https://img.shields.io/github/forks/Snouzy/workout-cool" alt="Forks">
<img src="https://img.shields.io/github/stars/Snouzy/workout-cool" alt="Stars">
<img src="https://img.shields.io/github/issues/Snouzy/workout-cool" alt="Issues">
<img src="https://img.shields.io/github/languages/count/Snouzy/workout-cool" alt="Languages">
<img src="https://img.shields.io/github/repo-size/Snouzy/workout-cool" alt="Repository Size">
<a href="https://ko-fi.com/workoutcool">
   <img src="https://img.shields.io/badge/sponsor%20on-ko--fi-ff5f5f?logo=ko-fi&logoColor=white&style=flat-square">
</a>
</p>
</div>

## Contributors

[![snouzy_biceps](https://avatars.githubusercontent.com/u/32961176?s=52&v=4)](https://twitter.com/snouzy_biceps)
[![lucaasnp_](https://avatars.githubusercontent.com/u/44783073?s=52&v=4)](https://twitter.com/lucaasnp_)

## About

A comprehensive fitness coaching platform that allows create workout plans for you, track progress, and access a vast exercise database with
detailed instructions and video demonstrations.

## 🎯 Project Origin & Motivation

This project was born from a personal mission to revive and improve upon a previous fitness platform. As the **primary contributor** to the
original [workout.lol](https://github.com/workout-lol/workout-lol) project, I witnessed its journey and abandonment. 🥹

### The Story Behind **_workout.cool_**

- 🏗️ **Original Contributor**: I was the main contributor to workout.lol
- 💼 **Business Challenges**: The original project faced major hurdles with exercise video partnerships (no reliable video provider) could
  be established
- 💰 **Project Sale**: Due to these partnership issues, the project was sold to another party
- 📉 **Abandonment**: The new owner quickly realized that **exercise video licensing costs were prohibitively expensive**, began to be sick
  and abandoned the entire project
- 🔄 **Revival Attempts**: For the past **9 months**, I've been trying to reconnect with the new stakeholder
- 📧 **Radio Silence**: Despite multiple (15) attempts, there has been no response
- 🚀 **New Beginning**: Rather than let this valuable work disappear, I decided to create a fresh, modern implementation

### Why **_workout.cool_** Exists

**Someone had to step up.**

The opensource fitness community deserves better than broken promises and abandoned platforms.

I'm not building this for profit.

This isn't just a revival : it's an evolution. **workout.cool** represents everything the original project could have been, with the
reliability, modern approach, and **maintenance** that the fitness open source community deserves.

## 👥 From the Community, For the Community

**I'm not just a developer : I'm a user who refused to let our community down.**

I experienced firsthand the frustration of watching a beloved tool slowly disappear. Like many of you, I had workouts saved, progress
tracked, and a routine built around the platform.

### My Mission: Rescue & Revive.

_If you were part of the original workout.lol community, welcome back! If you're new here, welcome to the future of fitness platform
management._

## Quick Start

### Prerequisites

- Node.js 18+
- Either:
  - Docker
  - OR PostgreSQL external database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Snouzy/workout-cool.git
   cd workout-cool
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your database URL and other required environment variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/workout_cool"
   BETTER_AUTH_SECRET="your-secret-key"
   # ... other variables
   ```

4. **Set up the database**

   #### Option 1: Using Docker

   The project provides a convenient `make` command that handles everything:

   ```bash
   make init
   ```

   This single command will:

   - Start the PostgreSQL database using Docker
   - Run database migrations
   - Start the development server

   #### Option 2: Manual PostgreSQL Setup

   If you prefer to use your own PostgreSQL installation:

   ```bash
   # Run migrations
   npx prisma migrate deploy
   npx prisma generate

   # Start the development server
   pnpm dev
   ```

5. **Open your browser** Navigate to [http://localhost:3000](http://localhost:3000)

## Exercise Database Import

The project includes a comprehensive exercise database. To import a sample of exercises:

### Prerequisites for Import

1. **Prepare your CSV file**

Your CSV should have these columns:

```
id,name,name_en,description,description_en,full_video_url,full_video_image_url,introduction,introduction_en,slug,slug_en,attribute_name,attribute_value
```

You can use the provided example.

### Import Commands

```bash
# Import exercises from a CSV file
pnpm run import:exercises-full /path/to/your/exercises.csv

# Example with the provided sample data
pnpm run import:exercises-full ./data/sample-exercises.csv
```

### CSV Format Example

```csv
id,name,name_en,description,description_en,full_video_url,full_video_image_url,introduction,introduction_en,slug,slug_en,attribute_name,attribute_value
157,"Fentes arrières à la barre","Barbell Reverse Lunges","<p>Stand upright...</p>","<p>Stand upright...</p>",https://youtube.com/...,https://img.youtube.com/...,slug-fr,slug-en,TYPE,STRENGTH
157,"Fentes arrières à la barre","Barbell Reverse Lunges","<p>Stand upright...</p>","<p>Stand upright...</p>",https://youtube.com/...,https://img.youtube.com/...,slug-fr,slug-en,PRIMARY_MUSCLE,QUADRICEPS
```

### Available Attribute Types

- **TYPE**: `STRENGTH`, `CARDIO`, `PLYOMETRICS`, `STRETCHING`, etc.
- **PRIMARY_MUSCLE**: `QUADRICEPS`, `CHEST`, `BACK`, `SHOULDERS`, etc.
- **SECONDARY_MUSCLE**: Secondary muscle groups targeted
- **EQUIPMENT**: `BARBELL`, `DUMBBELL`, `BODYWEIGHT`, `MACHINE`, etc.
- **MECHANICS_TYPE**: `COMPOUND`, `ISOLATION`

## Project Architecture

This project follows **Feature-Sliced Design (FSD)** principles with Next.js App Router:

```
src/
├── app/ # Next.js pages, routes and layouts
├── processes/ # Business flows (multi-feature)
├── widgets/ # Composable UI with logic (Sidebar, Header)
├── features/ # Business units (auth, exercise-management)
├── entities/ # Domain entities (user, exercise, workout)
├── shared/ # Shared code (UI, lib, config, types)
└── styles/ # Global CSS, themes
```

### Architecture Principles

- **Feature-driven**: Each feature is independent and reusable
- **Clear domain isolation**: `shared` → `entities` → `features` → `widgets` → `app`
- **Consistency**: Between business logic, UI, and data layers

### Example Feature Structure

```
features/
└── exercise-management/
├── ui/ # UI components (ExerciseForm, ExerciseCard)
├── model/ # Hooks, state management (useExercises)
├── lib/ # Utilities (exercise-helpers)
└── api/ # Server actions or API calls
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use Feature-Sliced Design architecture
- Write meaningful commit messages
- Add tests for new features

## Deployment

### Using Docker (Not ready yet : todo)

```bash
# Build the Docker image
docker build -t workout-cool .

# Run the container
docker run -p 3000:3000 workout-cool
```

### Manual Deployment

```bash
# Build the application
pnpm build

# Run database migrations
export DATABASE_URL="your-production-db-url"
npx prisma migrate deploy

# Start the production server
pnpm start
```

## Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Better Auth](https://github.com/better-auth/better-auth)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## 🤝 Join the Rescue Mission

**This is about rebuilding what we lost, together.**

### How You Can Help

- 🌟 **Star this repo** to show the world our community is alive and thriving
- 🐛 **Report issues** you find. I'm listening to every single one
- 💡 **Share your feature requests** finally, someone who will actually implement them !
- 🔄 **Spread the word** to fellow fitness enthusiasts who lost hope
- 🤝 **Contribute code** if you're a developer : let's build this together

## 💖 Sponsor This Project

Appear in the README and on the website as supporter by donating:

<div align="center">
  <a href="https://ko-fi.com/workoutcool" target="_blank">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Sponsor on Ko-fi" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <!-- TODO: setup -->
  <!-- <a href="https://buymeacoffee.com/workout_cool" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174" />
  </a> -->
</div>

<p align="center">
  <em>If you believe in open-source fitness tools and want to help this project thrive,<br>
  consider buying me a coffee ☕ or sponsoring the continued development.</em>
</p>

<p align="center">
  Your support helps cover hosting costs, exercise database updates, and continuous improvement.<br>
  Thank you for keeping <strong>workout.cool</strong> alive and evolving 💪
</p>

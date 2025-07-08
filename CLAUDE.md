# CLAUDE.md

## Project Overview

Workout.cool is a fitness app with two main components:

- **Website** Next.js (App Router) web client with Server Actions Location: `/Users/mathiasbradiceanu/dev/perso/workout-cool-web`

- **Mobile App** React Native app for iOS and Android Consumes the Workout.cool Next.js API Location:
  `/Users/mathiasbradiceanu/dev/perso/workout-cool-mobile`

## Architecture

### System Components

1. **Web Client (Next.js)**

   - Uses App Router and Server Actions for data mutations
   - Provides REST/JSON API endpoints consumed by the mobile app
   - TailwindCSS for styling
   - Contain the schema of the prisma database in `/Users/mathiasbradiceanu/dev/perso/workout-cool-web/prisma/schema.prisma`

2. **Mobile App (React Native / Expo)**

   - Communicates with the Next.js API for workouts
   - Push notifications and offline support for session data

3. **Both projects are using the FSD design system**.

### Data Flow

1. Mobile app and browser make API requests to the Next.js server
2. Next.js Server Actions handle form submissions, data mutations, and fetches
3. Data is stored/retrieved from the database via Next.js backend logic
4. Web client renders pages and exposes JSON endpoints
5. Mobile app syncs progress and displays workout sessions

## Key Features

- **3-Step Session Builder**: Equipment → Target Muscles → Generated Exercises
- **Embedded Videos**: Guide users through each exercise
- **In-Session Tracking**: Add sets with Reps, Weight, Time, or Bodyweight
- **Session History**: “Commit-style” log of past workouts on user profile
- **Repeat & Share**: Re-run past sessions or share summaries with others

## External Integrations

- **Database**: PostgreSQL via Next.js data layer
- **ORM**: Prisma, the schema is under `/Users/mathiasbradiceanu/dev/perso/workout-cool-web/prisma/schema.prisma`
- **Authentication**: BetterAuth (email/password, OAuth)
- **Video Hosting**: YouTube

## Linting

- ESLint and Prettier configured in both web and mobile workspaces

## Deployment

- **Website**: Vercel (Next.js)
- **Mobile App**: Expo EAS Build & Updates

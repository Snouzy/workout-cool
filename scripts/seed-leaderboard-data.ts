#!/usr/bin/env ts-node
import dayjs from "dayjs";
import { PrismaClient, ExerciseAttributeValueEnum } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Seed leaderboard data with sample users and workout sessions
 * Creates a variety of workout streaks to demonstrate the leaderboard functionality
 */
async function seedLeaderboardData() {
  console.log("🌱 Seeding leaderboard data with sample users and workout sessions...");

  try {
    // Sample users data - simplified to focus on total workout sessions
    const usersData = [
      {
        id: "user_warrior_sarah",
        name: "Sarah Warrior",
        email: "sarah.warrior@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Sarah",
        totalSessions: 150,
      },
      {
        id: "user_consistent_mary",
        name: "Mary Consistency",
        email: "mary.consistent@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Mary",
        totalSessions: 120,
      },
      {
        id: "user_streak_champion",
        name: "Alex Thunder",
        email: "alex.thunder@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Alex",
        totalSessions: 90,
      },
      {
        id: "user_comeback_lisa",
        name: "Lisa Comeback",
        email: "lisa.comeback@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Lisa",
        totalSessions: 80,
      },
      {
        id: "user_fitness_john",
        name: "John Fitness",
        email: "john.fitness@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=John",
        totalSessions: 64,
      },
      {
        id: "user_yoga_emma",
        name: "Emma Zen",
        email: "emma.zen@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Emma",
        totalSessions: 56,
      },
      {
        id: "user_machine_tom",
        name: "Tom Machine",
        email: "tom.machine@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Tom",
        totalSessions: 50,
      },
      {
        id: "user_beginner_mike",
        name: "Mike Beginner",
        email: "mike.beginner@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=Mike",
        totalSessions: 24,
      },
    ];

    // Create users
    console.log("👤 Creating sample users...");
    for (const userData of usersData) {
      await prisma.user.upsert({
        where: { id: userData.id },
        update: {
          name: userData.name,
          email: userData.email,
          image: userData.image,
        },
        create: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image,
          emailVerified: true,
          createdAt: dayjs().subtract(60, "days").toDate(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("💪 Creating workout sessions to generate streaks...");

    // Create workout sessions for each user based on their streak data
    for (const userData of usersData) {
      console.log(`  📋 Creating sessions for ${userData.name}...`);

      const sessionsToCreate = [];

      // Create workout sessions to match the total sessions count
      for (let i = 0; i < userData.totalSessions; i++) {
        const daysAgo = Math.floor(Math.random() * 59) + 1; // 1-60 days ago
        const sessionDate = dayjs().subtract(daysAgo, "days");

        // Force time to be at least 2 hours ago to account for timezone differences
        const maxHour = Math.min(22, dayjs().hour() - 2); // At least 2 hours ago
        const startTime = sessionDate.hour(Math.floor(Math.random() * Math.max(1, maxHour)) + 6);

        const sessionDuration = 30 + Math.floor(Math.random() * 60);

        sessionsToCreate.push({
          userId: userData.id,
          startedAt: startTime.toDate(),
          endedAt: startTime.add(sessionDuration, "minutes").toDate(), // Always set endedAt for completed sessions
          duration: sessionDuration * 60, // Convert to seconds
          muscles: [ExerciseAttributeValueEnum.CHEST, ExerciseAttributeValueEnum.SHOULDERS, ExerciseAttributeValueEnum.TRICEPS], // Sample muscle groups
        });
      }

      // Create all sessions for this user
      for (const sessionData of sessionsToCreate) {
        await prisma.workoutSession.create({
          data: sessionData,
        });
      }
    }
    console.log(`
📊 Summary:
- Created ${usersData.length} sample users with workout sessions
- Generated realistic completed workout sessions with proper endedAt timestamps
- Leaderboard rankings by total workouts:
  🥇 Sarah Warrior: 150 workouts
  🥈 Mary Consistency: 120 workouts
  🥉 Alex Thunder: 90 workouts
    `);
  } catch (error) {
    console.error("❌ Error seeding leaderboard data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedLeaderboardData()
    .then(() => {
      console.log("🎉 Leaderboard data seeded successfully!\n");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Leaderboard seeding failed:", error);
      process.exit(1);
    });
}

export default seedLeaderboardData;

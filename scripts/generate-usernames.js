const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generateUsername(name) {
  // Remove accents and special characters, keep only alphanumeric and spaces
  const cleanName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toLowerCase();

  // Split into words and take first two significant words
  const words = cleanName.split(/\s+/).filter(word => word.length > 1);
  
  let baseUsername = words.slice(0, 2).join("");
  
  // If still empty or too short, use fallback
  if (baseUsername.length < 3) {
    baseUsername = "user" + Date.now().toString().slice(-4);
  }
  
  // Ensure it's not too long
  if (baseUsername.length > 20) {
    baseUsername = baseUsername.slice(0, 20);
  }
  
  return baseUsername;
}

async function generateUsernamesForExistingUsers() {
  console.log('🚀 Starting username generation for existing users...');
  
  // Get all users without username
  const usersWithoutUsername = await prisma.user.findMany({
    where: {
      username: null
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  console.log(`📊 Found ${usersWithoutUsername.length} users without usernames`);

  let successCount = 0;
  let errorCount = 0;

  for (const user of usersWithoutUsername) {
    try {
      // Generate base username
      let baseUsername = generateUsername(user.name);
      let finalUsername = baseUsername;
      let attempts = 0;

      // Check if username is unique, if not, add a number suffix
      while (attempts < 10) {
        const existingUser = await prisma.user.findFirst({
          where: { username: finalUsername }
        });

        if (!existingUser) {
          break;
        }

        attempts++;
        finalUsername = `${baseUsername}${attempts}`;
      }

      // Update the user with the new username
      await prisma.user.update({
        where: { id: user.id },
        data: { username: finalUsername }
      });

      console.log(`✅ Generated username "${finalUsername}" for user ${user.email}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate username for user ${user.email}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📈 Username generation complete!`);
  console.log(`   ✅ Success: ${successCount} users`);
  console.log(`   ❌ Errors: ${errorCount} users`);
}

// Run the script
generateUsernamesForExistingUsers()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
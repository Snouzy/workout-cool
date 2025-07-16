import { defineConfig } from "cypress";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineConfig({
  viewportHeight: 1300,
  viewportWidth: 1200,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async findUserByEmail(email:string) {
          const user = await prisma.user.findUnique({
            where: {email},
          })
          console.log('User found:', user);
          
          return user
        },
      })
      return config
    },
    baseUrl: "http://localhost:3000/",
    screenshotOnRunFailure: true,
    testIsolation: true,
  },
});

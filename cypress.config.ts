import { defineConfig } from "cypress";
import { PrismaClient } from "@prisma/client"
import { registered_user } from "./cypress/fixtures/accountInfo.json"

const prisma = new PrismaClient()

export default defineConfig({
  blockHosts: [
    ".google"
  ],
  defaultCommandTimeout:10000,
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
        async deleteUserByEmail(email: string) {
          const deletedUser = await prisma.user.delete({
            where: {email},
          })
          console.log('User deleted', deletedUser);
          return deletedUser
        },
        async createUser() {
          const premiumUser = await prisma.user.create({
            data: {
              id: "testid4km",
              firstName: `${registered_user.first_name}`,
              lastName: `${registered_user.last_name}`,
              name: `${registered_user.first_name}`,
              email: `${registered_user.email.toLocaleLowerCase()}`,
              emailVerified: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              isPremium: true,
            }
          })
          return premiumUser
        },
      })
      return config
    },
    baseUrl: "http://localhost:3000/",
    screenshotOnRunFailure: true,
    testIsolation: true,
  },
});
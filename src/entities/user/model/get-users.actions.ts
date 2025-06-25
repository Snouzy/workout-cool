"use server";

import { z } from "zod";
import { Prisma, UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient, ActionError } from "@/shared/api/safe-actions";

const getUsersSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "email"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const getUsersAction = authenticatedActionClient.schema(getUsersSchema).action(async ({ parsedInput, ctx }) => {
  try {
    const { user: authUser } = ctx;

    if (!authUser || authUser.role !== UserRole.admin) {
      throw new ActionError("Access denied. Admin role required.");
    }

    const { page, limit, search, sortBy, sortOrder } = parsedInput;

    // Validate input parameters
    if (page < 1) {
      throw new ActionError("Page number must be positive");
    }

    if (limit < 1 || limit > 100) {
      throw new ActionError("Limit must be between 1 and 100");
    }

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { id: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const selectClause = {
      id: true,
      email: true,
      emailVerified: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      role: true,
    };

    const totalCount = await prisma.user.count({ where });
    const skip = (page - 1) * limit;

    let orderByPrisma: Prisma.UserOrderByWithRelationInput = {};
    if (sortBy === "createdAt") {
      orderByPrisma = { createdAt: sortOrder };
    } else if (sortBy === "email") {
      orderByPrisma = { email: sortOrder };
    }

    const fetchedUsers = await prisma.user.findMany({
      select: selectClause,
      where,
      orderBy: orderByPrisma,
      skip,
      take: limit,
    });

    const usersToReturn = fetchedUsers.map((u) => ({
      ...u,
      // Ensure dates are properly serialized
      createdAt: u.createdAt.toISOString(),
    }));

    return {
      users: usersToReturn,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error in getUsersAction:", error);

    if (error instanceof ActionError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new ActionError(`Database error: ${error.code}`);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new ActionError("Database connection error");
    }

    throw new ActionError("Failed to fetch users");
  }
});

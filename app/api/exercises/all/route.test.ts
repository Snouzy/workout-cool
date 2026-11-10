import { expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "./route";

const exercise = vi.hoisted(() => ({ count: vi.fn(), findMany: vi.fn() }));
vi.mock("@/shared/lib/prisma", () => ({ prisma: { exercise } }));

it("allows a Swedish name search without including instruction text in the public list", async () => {
  exercise.count.mockResolvedValue(1);
  exercise.findMany.mockResolvedValue([{ id: "lunge", nameSv: "Utfall" }]);

  const response = await GET(new NextRequest("https://example.com/api/exercises/all?search=Utfall"));

  expect(response.status).toBe(200);
  const [{ where, select }] = exercise.findMany.mock.calls[0];
  expect(where.AND[0].OR).toContainEqual({ nameSv: { contains: "Utfall", mode: "insensitive" } });
  expect(select.nameSv).toBe(true);
  for (const field of ["description", "descriptionEn", "descriptionSv", "introduction", "introductionEn", "introductionSv"]) {
    expect(select[field]).toBeUndefined();
  }
});

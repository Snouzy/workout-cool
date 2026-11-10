import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { GET, POST } from "./route";

const db = vi.hoisted(() => ({
  program: { findUnique: vi.fn(), findFirst: vi.fn() },
  userProgramEnrollment: { findUnique: vi.fn() },
}));
vi.mock("@/shared/lib/prisma", () => ({ prisma: db }));
vi.mock("@/shared/api/mobile-auth", () => ({ getMobileCompatibleSession: async () => ({ user: { id: "user" } }) }));

const request = new NextRequest("https://example.com/api/programs/strength/enroll");
const params = { params: Promise.resolve({ slug: "strength" }) };

describe("program enrollment by translated slug", () => {
  beforeEach(() => vi.resetAllMocks());

  it("uses the existing French URL first when a localized URL belongs to another program", async () => {
    db.program.findUnique.mockResolvedValue({ id: "original" });
    db.userProgramEnrollment.findUnique.mockResolvedValue(null);

    const response = await GET(request, params);

    expect(response.status).toBe(200);
    expect(db.program.findFirst).not.toHaveBeenCalled();
    expect(db.userProgramEnrollment.findUnique).toHaveBeenCalledWith({
      where: { userId_programId: { userId: "user", programId: "original" } },
    });
  });

  it("accepts the English URL used in Swedish when submitting an enrollment", async () => {
    db.program.findUnique.mockResolvedValue(null);
    db.program.findFirst.mockResolvedValue({ id: "translated", participantCount: 3 });
    db.userProgramEnrollment.findUnique.mockResolvedValue({ id: "enrollment" });

    const response = await POST(request, params);

    expect(db.program.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ OR: expect.arrayContaining([{ slugEn: "strength" }]), isActive: true, visibility: "PUBLISHED" }),
      }),
    );
    expect(await response.json()).toEqual({ enrollment: { id: "enrollment" }, isNew: false, totalEnrollments: 3 });
  });
});

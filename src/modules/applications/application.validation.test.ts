import { describe, it, expect } from "vitest";

import {
  createApplicationSchema,
  applicationIdSchema,
} from "./application.validation.js";

describe("Application Validation", () => {
  const valid24 = "0123456789abcdef01234567";

  it("validates create application schema", () => {
    const result = createApplicationSchema.safeParse({
      projectId: valid24,
      coverLetter: "I am a great developer with 5 years of experience.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid project ID", () => {
    const result = createApplicationSchema.safeParse({
      projectId: "invalid",
      coverLetter: "I am a great developer.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects cover letter shorter than 10 chars", () => {
    const result = createApplicationSchema.safeParse({
      projectId: valid24,
      coverLetter: "short",
    });
    expect(result.success).toBe(false);
  });

  it("validates application ID schema", () => {
    const result = applicationIdSchema.safeParse({
      id: valid24,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid application ID", () => {
    const result = applicationIdSchema.safeParse({
      id: "not-a-valid-id",
    });
    expect(result.success).toBe(false);
  });
});

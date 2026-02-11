import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, inviteSchema } from "@/lib/validations/auth";

describe("Login Validation Schema", () => {
  it("should validate correct login input", () => {
    const validInput = {
      email: "test@example.com",
      password: "password123",
    };

    const result = loginSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should normalize email to lowercase", () => {
    const input = {
      email: "TEST@EXAMPLE.COM",
      password: "password123",
    };

    const result = loginSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("should trim email whitespace", () => {
    const input = {
      email: "  test@example.com  ",
      password: "password123",
    };

    const result = loginSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("should reject invalid email format", () => {
    const invalidInput = {
      email: "invalid-email",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject empty email", () => {
    const invalidInput = {
      email: "",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const invalidInput = {
      email: "test@example.com",
      password: "",
    };

    const result = loginSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe("Register Validation Schema", () => {
  it("should validate correct register input", () => {
    const validInput = {
      name: "Test User",
      password: "password123",
    };

    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject password shorter than 8 characters", () => {
    const invalidInput = {
      name: "Test User",
      password: "pass123",
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject empty name", () => {
    const invalidInput = {
      name: "",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject name longer than 100 characters", () => {
    const invalidInput = {
      name: "a".repeat(101),
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe("Invite Validation Schema", () => {
  it("should validate correct invite input", () => {
    const validInput = {
      email: "invite@example.com",
    };

    const result = inviteSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should normalize email to lowercase", () => {
    const input = {
      email: "INVITE@EXAMPLE.COM",
    };

    const result = inviteSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("invite@example.com");
    }
  });

  it("should reject invalid email format", () => {
    const invalidInput = {
      email: "invalid-email",
    };

    const result = inviteSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

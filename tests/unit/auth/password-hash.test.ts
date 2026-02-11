import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";

describe("Password Hashing", () => {
  it("should hash password with bcrypt", async () => {
    const password = "testPassword123";
    const hashedPassword = await bcrypt.hash(password, 12);

    expect(hashedPassword).toBeTruthy();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.startsWith("$2a$") || hashedPassword.startsWith("$2b$")).toBe(true);
  });

  it("should verify password correctly", async () => {
    const password = "testPassword123";
    const hashedPassword = await bcrypt.hash(password, 12);

    const isValid = await bcrypt.compare(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it("should reject invalid password", async () => {
    const password = "testPassword123";
    const wrongPassword = "wrongPassword";
    const hashedPassword = await bcrypt.hash(password, 12);

    const isValid = await bcrypt.compare(wrongPassword, hashedPassword);
    expect(isValid).toBe(false);
  });

  it("should use salt rounds of 12", async () => {
    const password = "testPassword123";
    const hashedPassword = await bcrypt.hash(password, 12);

    // bcrypt hash format: $2a$[rounds]$[salt][hash]
    const rounds = hashedPassword.split("$")[2];
    expect(rounds).toBe("12");
  });
});

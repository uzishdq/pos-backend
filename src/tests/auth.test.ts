import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { db } from "../db";
import { AuthService } from "../services/auth.service";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createTestApp } from "./setupTestApp";

const auth = new AuthService();
const app = createTestApp();

const testUser = {
  username: "testuser",
  password: "testpass123",
  confirmPassword: "testpass123",
};

let refreshToken: string;
let accessToken: string;

describe("AuthService", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash(testUser.password, 10);

    await db.insert(users).values({
      username: testUser.username,
      password: hash,
    });
  });

  it("should login and returt tokens", async () => {
    const result = await auth.login(testUser);

    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");

    refreshToken = result.refreshToken;
  });

  it("should refresh token", async () => {
    const token = await auth.refreshToken(refreshToken);

    expect(token).toHaveProperty("accessToken");
  });

  it("should logout and invalidate refresh token", async () => {
    await auth.logout(refreshToken);

    await expect(auth.refreshToken(refreshToken)).rejects.toThrow(
      "Invalid refresh token"
    );
  });

  it("should not login with username not found", async () => {
    await expect(
      auth.login({
        username: "adminadmin",
        password: testUser.password,
      })
    ).rejects.toThrow("username not found");
  });

  it("should not login with password not match", async () => {
    await expect(
      auth.login({
        username: testUser.username,
        password: "testPassword",
      })
    ).rejects.toThrow("password not match");
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.username, testUser.username));
  });
});

describe("AuthRoutes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User Registered");
  });

  it("should login with registered user", async () => {
    const res = await request(app).post("/api/auth/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");

    refreshToken = res.body.data.refreshToken;
    accessToken = res.body.data.accessToken;
  });

  it("should refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged Out");
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.username, testUser.username));
  });
});

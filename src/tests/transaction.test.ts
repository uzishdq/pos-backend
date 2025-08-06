import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { TransactionService } from "../services/transaction.service";
import { db } from "../db";
import { products, transactionItems, transactions, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createTestApp } from "./setupTestApp";

const service = new TransactionService();
const app = createTestApp();

const testUser = {
  username: "cahier",
  password: "cahier123123",
  confirmPassword: "cahier123123",
};

let testUserId: string;
let testProductId: string;
let accessToken: string;

describe("TransactionService", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash("kasirpass", 10);

    const [user] = await db
      .insert(users)
      .values({
        username: "kasir1",
        password: hash,
        role: "CASHIER",
      })
      .returning();
    testUserId = user.id;

    const [product] = await db
      .insert(products)
      .values({
        name: "Produk A",
        price: "10000",
      })
      .returning();
    testProductId = product.id;
  });

  it("should create a transaction with valid data", async () => {
    const data = {
      userId: testUserId,
      items: [{ productId: testProductId, qyt: 2 }],
    };

    const trx = await service.create(data);

    expect(trx).toHaveProperty("id");

    const items = await db
      .select()
      .from(transactionItems)
      .where(eq(transactionItems.transactionId, trx.id));
    expect(items.length).toBe(1);
    expect(Number(items[0].price)).toBe(10000);
  });

  it("should throw if product not found", async () => {
    const data = {
      userId: testUserId,
      items: [{ productId: 'non-existent-id"', qyt: 1 }],
    };

    await expect(service.create(data)).rejects.toThrow();
  });

  it("should fetch all transactions", async () => {
    const result = await service.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  afterAll(async () => {
    await db.delete(transactionItems);
    await db.delete(transactions);
    await db.delete(products).where(eq(products.id, testProductId));
    await db.delete(users).where(eq(users.id, testUserId));
  });
});

describe("Transaction Routes", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash(testUser.password, 10);

    const [user] = await db
      .insert(users)
      .values({
        username: testUser.username,
        password: hash,
        role: "CASHIER",
      })
      .returning();

    testUserId = user.id;

    const res = await request(app).post("/api/auth/login").send(testUser);

    accessToken = res.body.data.accessToken;

    const [product] = await db
      .insert(products)
      .values({
        name: "Teh Botol",
        price: "5000",
      })
      .returning();

    testProductId = product.id;
  });

  it("should create a transaction via route", async () => {
    const data = {
      userId: testUserId,
      items: [{ productId: testProductId, qyt: 2 }],
    };

    const response = await request(app)
      .post("/api/transactions/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
  });

  it("should fetch all products", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  afterAll(async () => {
    await db.delete(transactionItems);
    await db.delete(transactions);
    await db.delete(products).where(eq(products.id, testProductId));
    await db.delete(users).where(eq(users.id, testUserId));
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { ProductService } from "../services/product.service";
import { db } from "../db";
import { products, users } from "../db/schema";
import { createTestApp } from "./setupTestApp";

const service = new ProductService();
const app = createTestApp();

let createdId: string;
let accessToken: string;

const testUser = {
  username: "admin",
  password: "adminadmin",
  confirmPassword: "adminadmin",
};

const data = {
  name: "Test Product",
  price: "1000",
};

describe("ProductService", () => {
  it("should create a new product", async () => {
    const product = await service.create(data);
    createdId = product.id;

    expect(product).toMatchObject(data);
  });

  it("should get all products", async () => {
    const result = await service.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get product by id", async () => {
    const result = await service.findById(createdId);
    expect(result?.id).toBe(createdId);
  });

  it("should update product", async () => {
    const updated = {
      id: createdId,
      name: "Updated Product",
      price: "250000",
    };

    const result = await service.update(updated);

    expect(result.name).toBe("Updated Product");
    expect(result.price).toBe("250000");
  });

  it("should delete product", async () => {
    const deleted = {
      id: createdId,
      name: "Updated Product",
      price: "250000",
    };

    const result = await service.delete(deleted);
    expect(result).toBeTruthy();

    await expect(service.findById(createdId)).rejects.toThrow(
      "product not found"
    );
  });

  afterAll(async () => {
    await db.delete(products).where(eq(products.id, createdId));
  });
});

describe("ProductsRoute", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash(testUser.password, 10);

    await db.insert(users).values({
      username: testUser.username,
      password: hash,
      role: "ADMIN",
    });

    const res = await request(app).post("/api/auth/login").send(testUser);

    accessToken = res.body.data.accessToken;
  });

  it("should create product", async () => {
    const res = await request(app)
      .post("/api/products/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(data);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id");

    createdId = res.body.data.id;
  });

  it("should fetch all products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch product by id", async () => {
    const res = await request(app)
      .get(`/api/products/${createdId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdId);
  });

  it("should update product", async () => {
    const res = await request(app)
      .put("/api/products/update")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id: createdId,
        name: "Updated A",
        price: "200000",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated A");
  });

  it("should delete product", async () => {
    const res = await request(app)
      .delete("/api/products/delete")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id: createdId,
        name: "Updated A",
        price: "200000",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product Deleted");
  });

  afterAll(async () => {
    await db.delete(products).where(eq(products.id, createdId));
    await db.delete(users).where(eq(users.username, testUser.username));
  });
});

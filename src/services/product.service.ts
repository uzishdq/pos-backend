import { eq } from "drizzle-orm";
import { db } from "../db";
import { products } from "../db/schema";
import {
  ProductInputSchemaType,
  UpdateOrDeleteProductSchemaType,
} from "../utils/schema/product.schema";

export class ProductService {
  async create(data: ProductInputSchemaType) {
    const [result] = await db.insert(products).values(data).returning();

    return result;
  }

  async update(data: UpdateOrDeleteProductSchemaType) {
    const [result] = await db
      .update(products)
      .set({
        name: data.name,
        price: data.price,
      })
      .where(eq(products.id, data.id))
      .returning();

    if (!result) {
      throw new Error("product not found");
    }

    return result;
  }

  async delete(data: UpdateOrDeleteProductSchemaType) {
    const [result] = await db
      .delete(products)
      .where(eq(products.id, data.id))
      .returning();

    if (!result) {
      throw new Error("product not found");
    }

    return result;
  }

  async findAll() {
    const result = await db.select().from(products);

    return result;
  }

  async findById(id: string) {
    const [result] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!result) {
      throw new Error("product not found");
    }

    return result;
  }
}

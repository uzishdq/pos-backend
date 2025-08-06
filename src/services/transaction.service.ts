import { inArray } from "drizzle-orm";
import { db } from "../db";
import { products, transactionItems, transactions } from "../db/schema";
import { TransactionInputSchemaType } from "../utils/schema/transaction.schema";

export class TransactionService {
  async create(data: TransactionInputSchemaType) {
    const productIds = data.items.map((i) => i.productId);

    const items = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (items.length !== data.items.length) {
      throw new Error("Some products not found");
    }

    let total: number = 0;

    const itemDetails = data.items.map((item) => {
      const product = items.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const price = Number(product.price);
      total += price * item.qyt;

      return {
        productId: item.productId,
        qyt: item.qyt,
        price: price.toString(),
      };
    });

    const result = await db.transaction(async (tx) => {
      const [tr] = await tx
        .insert(transactions)
        .values({
          userId: data.userId,
          total: total.toString(),
        })
        .returning();

      const itemData = itemDetails.map((d) => ({
        transactionId: tr.id,
        productId: d.productId,
        qyt: d.qyt,
        price: d.price,
      }));

      await tx.insert(transactionItems).values(itemData);

      return tr;
    });

    return result;
  }

  async getAll() {
    const result = await db.select().from(transactions);

    return result;
  }
}

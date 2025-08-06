import { z } from "zod";

export const insertTransactionSchema = z.object({
  userId: z.uuid(),
  items: z.array(
    z.object({
      productId: z.uuid(),
      qyt: z.number().positive(),
    })
  ),
});

export type TransactionInputSchemaType = z.infer<
  typeof insertTransactionSchema
>;

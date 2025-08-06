import { z } from "zod";

const name = z.string().min(5).max(100);
const price = z
  .string()
  .min(1)
  .max(5000)
  .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format");

export const insertProductSchema = z.object({
  name: name,
  price: price,
});

export const updateOrDeleteProductSchema = z.object({
  id: z.uuid(),
  name: name,
  price: price,
});

export type ProductInputSchemaType = z.infer<typeof insertProductSchema>;
export type UpdateOrDeleteProductSchemaType = z.infer<
  typeof updateOrDeleteProductSchema
>;
